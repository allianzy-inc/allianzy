import { json } from "@sveltejs/kit";
import { g as getBillingContext } from "../../../../../../chunks/resolve-context.js";
import { f as findSubscriptionRecordsByCompanyId, s as syncStripeForCompany } from "../../../../../../chunks/stripe-sync.service.js";
import { getBillingCompany, getStripe } from "../../../../../../chunks/billing.js";
function mapSubscriptionToShape(sub) {
  const meta = sub.metadata ?? {};
  return {
    id: sub.providerSubscriptionId ?? sub.id,
    status: sub.status,
    current_period_end: sub.currentPeriodEnd?.toISOString(),
    cancel_at_period_end: false,
    price_nickname: meta.price_nickname,
    price_unit_amount: sub.amount,
    currency: sub.currency
  };
}
const GET = async (event) => {
  const ctx = await getBillingContext(event);
  if (!ctx || !ctx.linked) {
    return json({ linked: false, subscriptions: [] });
  }
  if (ctx.selectedPaymentAccountId) {
    let subs = await findSubscriptionRecordsByCompanyId(
      ctx.companyId,
      ctx.selectedPaymentAccountId
    );
    if (subs.length === 0 && ctx.accounts.some((a) => a.provider === "stripe")) {
      try {
        await syncStripeForCompany(ctx.companyId);
        subs = await findSubscriptionRecordsByCompanyId(
          ctx.companyId,
          ctx.selectedPaymentAccountId
        );
      } catch (err) {
        console.error("[billing/subscriptions] sync error:", err?.message ?? err);
      }
    }
    const subscriptions = subs.map((s) => mapSubscriptionToShape(s));
    return json({ linked: true, subscriptions });
  }
  const billing = await getBillingCompany(event);
  if (!billing) return json({ linked: false, subscriptions: [] });
  const stripe = getStripe();
  if (!stripe) return json({ linked: true, subscriptions: [] });
  try {
    const list = await stripe.subscriptions.list({
      customer: billing.stripeCustomerId,
      status: "all",
      limit: 100,
      expand: ["data.items.data.price"]
    });
    const subscriptions = (list.data ?? []).map((sub) => {
      const price = sub.items?.data?.[0]?.price;
      return {
        id: sub.id,
        status: sub.status ?? void 0,
        current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1e3).toISOString() : void 0,
        cancel_at_period_end: sub.cancel_at_period_end ?? false,
        price_nickname: price?.nickname ?? void 0,
        price_unit_amount: price?.unit_amount ?? 0,
        currency: price?.currency ?? sub.currency ?? "usd"
      };
    });
    return json({ linked: true, subscriptions });
  } catch (err) {
    console.error("[billing/subscriptions] Stripe error:", err?.message ?? err);
    return json({ linked: true, subscriptions: [], error: err?.message ?? "Stripe error" }, { status: 500 });
  }
};
export {
  GET
};
