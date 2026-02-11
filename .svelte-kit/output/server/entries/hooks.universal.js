function reroute({ url }) {
  const DOMAIN_MAP = {
    "allianzy.com": "allianzy",
    "www.allianzy.com": "allianzy",
    "beltrix.agency": "beltrix",
    "www.beltrix.agency": "beltrix",
    // Localhost mapping for testing (optional, defaults to allianzy)
    "localhost:5173": "allianzy",
    "127.0.0.1:5173": "allianzy"
  };
  const host = url.host;
  let assignedWorkspace = DOMAIN_MAP[host];
  if (!assignedWorkspace && (host.includes("localhost") || host.includes("127.0.0.1"))) {
    assignedWorkspace = "allianzy";
  }
  const VALID_WORKSPACES = ["allianzy", "beltrix"];
  if (assignedWorkspace) {
    if (url.pathname.startsWith(`/${assignedWorkspace}`)) {
      return url.pathname;
    }
    if (url.pathname.startsWith("/api")) {
      return url.pathname;
    }
    const firstSegment = url.pathname.split("/")[1];
    if (VALID_WORKSPACES.includes(firstSegment)) {
      return url.pathname;
    }
    return `/${assignedWorkspace}${url.pathname === "/" ? "" : url.pathname}`;
  }
  return url.pathname;
}
export {
  reroute
};
