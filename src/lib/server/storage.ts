import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';
import { createHmac } from 'crypto';

const s3 = new S3Client({
  endpoint: env.B2_ENDPOINT,
  region: env.B2_REGION,
  credentials: {
    accessKeyId: env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: env.B2_APPLICATION_KEY!
  }
});

// Use B2_APPLICATION_KEY as the secret for signing local URLs since it's secure
const SIGNING_SECRET = env.B2_APPLICATION_KEY!;

export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Sanitize filename
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${Date.now()}-${safeName}`;

  await s3.send(new PutObjectCommand({
    Bucket: env.B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type
  }));

  // Return the standard B2 Native URL format
  // This is stored in DB. We will proxy it when displaying.
  return `https://f005.backblazeb2.com/file/${env.B2_BUCKET_NAME}/${key}`;
}

export async function getSignedUrlForFile(url: string | null, workspace: string = 'allianzy'): Promise<string | null> {
  if (!url) return null;

  // Robust B2 URL detection using regex
  // Matches: https://<host>/file/<bucket>/<key>
  // Example: https://f005.backblazeb2.com/file/allianzy/uploads/123-test.pdf
  const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
  const match = url.match(b2Regex);

  if (match) {
    // Return a local proxy URL to avoid CORS issues with direct B2 links
    // The proxy will handle fetching the file from B2 and streaming it to the client
    // Add timestamp to prevent caching issues and signature for security
    const timestamp = Date.now();
    const payload = `${url}|${timestamp}|${workspace}`;
    const signature = createHmac('sha256', SIGNING_SECRET)
      .update(payload)
      .digest('hex');

    return `/${workspace}/dashboard/api/files?url=${encodeURIComponent(url)}&t=${timestamp}&sig=${signature}`;
  }

  return url;
}

export async function getFileStream(key: string, bucket?: string) {
  const command = new GetObjectCommand({
    Bucket: bucket || env.B2_BUCKET_NAME,
    Key: key
  });
  
  return await s3.send(command);
}
