const AUTH_URL = "https://ep-shy-rain-ahs7rwph.neonauth.c-3.us-east-1.aws.neon.tech/allianzy/auth";
async function proxy(request, path) {
  const url = new URL(request.url);
  const search = url.search;
  const baseUrl = AUTH_URL.replace(/\/$/, "");
  const targetUrl = `${baseUrl}/${path}${search}`;
  console.log("[Auth Proxy]", request.method, path, "->", targetUrl);
  const headers = new Headers(request.headers);
  headers.delete("connection");
  const body = request.method !== "GET" && request.method !== "HEAD" ? await request.blob() : void 0;
  const authUrlObj = new URL(AUTH_URL);
  const requestUrl = new URL(request.url);
  const origin = headers.get("origin");
  if (origin) {
    if (origin.startsWith("https://www.")) {
      headers.set("origin", origin.replace("https://www.", "https://"));
    } else if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      headers.set("origin", authUrlObj.origin);
    }
  } else {
    headers.set("origin", requestUrl.origin);
  }
  const referer = headers.get("referer");
  if (referer && referer.startsWith("https://www.")) {
    headers.set("referer", referer.replace("https://www.", "https://"));
  }
  headers.set("host", authUrlObj.host);
  headers.set("x-forwarded-host", authUrlObj.host);
  headers.set("x-forwarded-proto", "https");
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual"
    });
    const responseHeaders = new Headers(response.headers);
    const setCookie = responseHeaders.get("set-cookie");
    if (setCookie) {
      let newSetCookie = setCookie.replace(/Domain=[^;]+;?/gi, "");
      newSetCookie = newSetCookie.replace(/Path=[^;]+;?/gi, "Path=/;");
      responseHeaders.set("set-cookie", newSetCookie);
    }
    const requestOrigin = request.headers.get("origin") || requestUrl.origin;
    if (requestOrigin && (requestOrigin.includes("localhost") || requestOrigin.includes("127.0.0.1"))) {
      responseHeaders.set("Access-Control-Allow-Origin", requestOrigin);
      responseHeaders.set("Access-Control-Allow-Credentials", "true");
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
    return new Response(JSON.stringify({
      message: "Auth proxy error",
      details: error?.message || String(error)
    }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
}
const GET = ({ request, params }) => proxy(request, params.path);
const POST = ({ request, params }) => proxy(request, params.path);
export {
  GET,
  POST
};
