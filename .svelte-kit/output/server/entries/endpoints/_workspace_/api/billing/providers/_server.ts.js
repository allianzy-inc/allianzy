import { json } from "@sveltejs/kit";
import { a as findAllProviderConfigs } from "../../../../../../chunks/provider-config.repository.js";
const GET = async () => {
  const configs = await findAllProviderConfigs(true);
  return json({
    providers: configs.map((c) => ({
      code: c.code,
      label: c.label,
      isAutomatic: c.isAutomatic
    }))
  });
};
export {
  GET
};
