import { b as private_env } from "../../../../chunks/shared-server.js";
const GET = async () => {
  const authUrl = "https://ep-shy-rain-ahs7rwph.neonauth.c-3.us-east-1.aws.neon.tech/allianzy/auth";
  return new Response(JSON.stringify({
    vite_env: "Set",
    process_env: !!process.env.VITE_NEON_AUTH_URL ? "Set" : "Unset",
    dynamic_env: !!private_env.VITE_NEON_AUTH_URL ? "Set" : "Unset",
    auth_url_prefix: authUrl.substring(0, 8) + "..."
  }), {
    headers: { "Content-Type": "application/json" }
  });
};
export {
  GET
};
