import { error } from "@sveltejs/kit";
import { g as getFileStream } from "../../../../../chunks/storage.js";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";
import { b as private_env } from "../../../../../chunks/shared-server.js";
import { createHmac } from "crypto";
const SIGNING_SECRET = private_env.B2_APPLICATION_KEY;
function logDebug(message) {
  try {
    const logPath = path.resolve("debug-public-proxy.log");
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}
`);
  } catch (e) {
  }
}
const OPTIONS = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  });
};
const GET = async ({ url, request }) => {
  const fileUrl = url.searchParams.get("url");
  const t = url.searchParams.get("t");
  const sig = url.searchParams.get("sig");
  const workspace = url.searchParams.get("w");
  logDebug(`Request: ${url.toString()}`);
  if (!fileUrl || !t || !sig || !workspace) {
    logDebug("Missing parameters");
    throw error(400, "Missing parameters");
  }
  const payload = `${fileUrl}|${t}|${workspace}`;
  const expectedSig = createHmac("sha256", SIGNING_SECRET).update(payload).digest("hex");
  if (sig !== expectedSig) {
    logDebug(`Invalid signature. Expected: ${expectedSig}, Got: ${sig}`);
    throw error(403, "Invalid signature");
  }
  const timeDiff = Date.now() - Number(t);
  if (timeDiff > 24 * 3600 * 1e3) {
    logDebug(`Signature expired. Diff: ${timeDiff}`);
    throw error(410, "Link expired");
  }
  const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
  const match = fileUrl.match(b2Regex);
  if (!match) {
    logDebug(`Invalid B2 URL format: ${fileUrl}`);
    throw error(400, "Invalid B2 URL");
  }
  const bucket = match[1];
  const key = match[2];
  try {
    const output = await getFileStream(key, bucket);
    if (!output.Body) {
      logDebug("File not found in S3 (Body is empty)");
      throw error(404, "File not found");
    }
    const headers = new Headers();
    if (output.ContentType) headers.set("Content-Type", output.ContentType);
    if (output.ContentLength) headers.set("Content-Length", output.ContentLength.toString());
    if (output.LastModified) headers.set("Last-Modified", output.LastModified.toUTCString());
    headers.set("Cache-Control", "private, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Content-Disposition", "inline");
    const stream = output.Body;
    let body = null;
    if (typeof stream.pipe === "function") {
      body = Readable.toWeb(stream);
    } else {
      body = stream;
    }
    logDebug("Serving file successfully");
    return new Response(body, {
      headers
    });
  } catch (err) {
    logDebug(`Error serving file: ${err}`);
    console.error("Error serving file:", err);
    throw error(500, "Error serving file");
  }
};
export {
  GET,
  OPTIONS
};
