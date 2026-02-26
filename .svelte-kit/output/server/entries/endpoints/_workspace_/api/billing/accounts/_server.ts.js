import { json } from "@sveltejs/kit";
import { g as getBillingContext } from "../../../../../../chunks/resolve-context.js";
const GET = async (event) => {
  const ctx = await getBillingContext(event);
  if (!ctx) {
    return json({ accounts: [], defaultCustomerId: null, selectedCustomerId: null });
  }
  const defaultCustomerId = ctx.accounts.find((a) => a.isDefault)?.customerId ?? ctx.accounts[0]?.customerId ?? null;
  return json({
    accounts: ctx.accounts.map((a) => ({
      customerId: a.customerId,
      isDefault: a.isDefault,
      provider: a.provider,
      label: a.label,
      paymentAccountId: a.paymentAccountId || void 0
    })),
    defaultCustomerId,
    selectedCustomerId: ctx.selectedCustomerId
  });
};
export {
  GET
};
