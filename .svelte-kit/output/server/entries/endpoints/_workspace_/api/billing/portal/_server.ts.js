import { json } from "@sveltejs/kit";
import { getBillingCompany, getStripe } from "../../../../../../chunks/billing.js";
import { g as getBillingContext } from "../../../../../../chunks/resolve-context.js";
const POST = async (event) => {
  const ctx = await getBillingContext(event);
  let customerId = ctx?.selectedCustomerId ?? null;
  if (!customerId?.startsWith("cus_")) {
    const billing = await getBillingCompany(event);
    customerId = billing?.stripeCustomerId ?? null;
  }
  if (!customerId?.startsWith("cus_")) {
    return json({ error: "No billing company or Stripe customer linked" }, { status: 400 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return json({ error: "Stripe not configured" }, { status: 503 });
  }
  const workspace = event.params.workspace ?? "allianzy";
  const origin = event.url.origin;
  const returnUrl = `${origin}/${workspace}/dashboard/billing`;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    return json({ url: session.url });
  } catch (err) {
    console.error("[billing/portal] Stripe error:", err);
    return json({ error: "Failed to create portal session" }, { status: 500 });
  }
};
export {
  POST
};
