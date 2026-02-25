import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { b as private_env } from "./shared-server.js";
import { createHmac } from "crypto";
const s3 = new S3Client({
  endpoint: private_env.B2_ENDPOINT,
  region: private_env.B2_REGION,
  credentials: {
    accessKeyId: private_env.B2_APPLICATION_KEY_ID,
    secretAccessKey: private_env.B2_APPLICATION_KEY
  }
});
const SIGNING_SECRET = private_env.B2_APPLICATION_KEY;
async function uploadFile(file, folder = "uploads") {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${folder}/${Date.now()}-${safeName}`;
  await s3.send(new PutObjectCommand({
    Bucket: private_env.B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type
  }));
  return `https://f005.backblazeb2.com/file/${private_env.B2_BUCKET_NAME}/${key}`;
}
async function deleteFile(fileUrl) {
  if (!fileUrl) return;
  const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
  const match = fileUrl.match(b2Regex);
  if (match) {
    const key = match[2];
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: private_env.B2_BUCKET_NAME,
        Key: key
      }));
    } catch (error) {
      console.error("Error deleting file from storage:", error);
    }
  }
}
function getSignedUrlForFile(url, workspace = "allianzy") {
  if (url == null || typeof url !== "string") return null;
  const urlStr = url.trim();
  if (!urlStr) return null;
  url = urlStr;
  if ((url.includes("/api/files") || url.includes("/api/public/files")) && url.includes("url=")) {
    try {
      const match2 = url.match(/url=([^&]+)/);
      if (match2) {
        const decodedUrl = decodeURIComponent(match2[1]);
        return getSignedUrlForFile(decodedUrl, workspace);
      }
    } catch (e) {
      console.error("Error parsing existing proxy URL:", e);
    }
  }
  if (url.includes("/api/files") || url.includes("/dashboard/api/files") || url.includes("/api/public/files")) {
    try {
      const urlObj = new URL(url, "http://dummy.com");
      const originalUrl = urlObj.searchParams.get("url");
      if (originalUrl) {
        return getSignedUrlForFile(originalUrl, workspace);
      }
    } catch (e) {
      console.error("Error parsing existing proxy URL:", e);
    }
  }
  const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
  const match = url.match(b2Regex);
  if (match) {
    const timestamp = Date.now();
    const payload = `${url}|${timestamp}|${workspace}`;
    const signature = createHmac("sha256", SIGNING_SECRET).update(payload).digest("hex");
    return `/api/public/files?url=${encodeURIComponent(url)}&t=${timestamp}&sig=${signature}&w=${workspace}`;
  }
  return url;
}
async function getFileStream(key, bucket) {
  const command = new GetObjectCommand({
    Bucket: bucket || private_env.B2_BUCKET_NAME,
    Key: key
  });
  return await s3.send(command);
}
export {
  getSignedUrlForFile as a,
  deleteFile as d,
  getFileStream as g,
  uploadFile as u
};
