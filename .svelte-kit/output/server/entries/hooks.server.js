import { redirect } from "@sveltejs/kit";
import { d as db, u as users, a as userCompanies } from "../chunks/db.js";
import { ilike, and, eq } from "drizzle-orm";
import { a as getSignedUrlForFile } from "../chunks/storage.js";
const AUTH_URL = "https://ep-shy-rain-ahs7rwph.neonauth.c-3.us-east-1.aws.neon.tech/allianzy/auth";
async function validateSession(request) {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      console.log("Session validation: No cookie found");
      return null;
    }
    console.log("Session validation: Validating against", AUTH_URL);
    const response = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        cookie
      }
    });
    if (!response.ok) {
      console.log("Session validation: Auth service returned", response.status);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Session validation error:", error);
    return null;
  }
}
const DOMAIN_MAP = {
  "allianzy.com": "allianzy",
  "www.allianzy.com": "allianzy",
  "beltrix.agency": "beltrix",
  "www.beltrix.agency": "beltrix"
};
const VALID_WORKSPACES = ["allianzy", "beltrix"];
const handle = async ({ event, resolve }) => {
  console.log(`[HOOKS] Request: ${event.request.method} ${event.url.pathname}`);
  const host = event.request.headers.get("host") || "";
  let allowedWorkspace = DOMAIN_MAP[host];
  if (!allowedWorkspace && (host.includes("localhost") || host.includes("127.0.0.1"))) {
    const pathSegments = event.url.pathname.split("/").filter(Boolean);
    const requestedWorkspace = pathSegments[0];
    if (requestedWorkspace && VALID_WORKSPACES.includes(requestedWorkspace)) {
      allowedWorkspace = requestedWorkspace;
    } else {
      allowedWorkspace = "allianzy";
    }
  }
  if (allowedWorkspace) {
    event.locals.allowedWorkspace = allowedWorkspace;
    const pathSegments = event.url.pathname.split("/").filter(Boolean);
    const requestedWorkspace = pathSegments[0];
    if (requestedWorkspace && VALID_WORKSPACES.includes(requestedWorkspace)) {
      if (requestedWorkspace !== allowedWorkspace) {
        throw redirect(307, "/");
      }
    }
  }
  const sessionData = await validateSession(event.request);
  if (sessionData && sessionData.user) {
    const localUser = await db.query.users.findFirst({
      where: ilike(users.email, sessionData.user.email)
    });
    if (localUser) {
      const avatarUrl = await getSignedUrlForFile(localUser.avatarUrl, event.locals.allowedWorkspace);
      let primaryCompanyLink = await db.query.userCompanies.findFirst({
        where: and(
          eq(userCompanies.userId, localUser.id),
          eq(userCompanies.isPrimary, true)
        ),
        with: {
          company: true
        }
      });
      if (!primaryCompanyLink) {
        primaryCompanyLink = await db.query.userCompanies.findFirst({
          where: eq(userCompanies.userId, localUser.id),
          with: {
            company: true
          }
        });
      }
      event.locals.user = {
        id: localUser.id.toString(),
        email: localUser.email,
        firstName: localUser.firstName || "",
        lastName: localUser.lastName || "",
        role: localUser.role || "client",
        image: avatarUrl || "",
        companyId: primaryCompanyLink?.companyId || void 0,
        companyName: primaryCompanyLink?.company?.name
      };
    }
  }
  const response = await resolve(event);
  if (event.url.pathname.startsWith("/") && !event.url.pathname.includes(".")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
};
export {
  handle
};
