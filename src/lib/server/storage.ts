import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;

  // Extract key from URL
  // URL format: https://f005.backblazeb2.com/file/<bucket>/<key>
  const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
  const match = fileUrl.match(b2Regex);

  if (match) {
    const key = match[2]; // The key is the second capture group
    
    try {
      await s3.send(new DeleteObjectCommand({
        Bucket: env.B2_BUCKET_NAME,
        Key: key
      }));
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      // We don't throw here to allow the DB deletion to proceed even if file deletion fails
    }
  }
}

export function getSignedUrlForFile(url: string | null, workspace: string = 'allianzy'): string | null {
  if (!url) return null;

  // Check if it's already a proxy URL and extract the original B2 URL
  // This handles cases where the DB might have saved a proxy URL instead of the B2 URL
  if (url.includes('/api/files') && url.includes('url=')) {
    try {
      const match = url.match(/url=([^&]+)/);
      if (match) {
        const decodedUrl = decodeURIComponent(match[1]);
        // Recursively call to generate a fresh signature and timestamp
        return getSignedUrlForFile(decodedUrl, workspace);
      }
    } catch (e) {
      console.error('Error parsing existing proxy URL:', e);
    }
  }

  // Check if the URL is already a local proxy URL (legacy or current)
  // If so, extract the original B2 URL and re-sign it
  if (url.includes('/api/files') || url.includes('/dashboard/api/files')) {
    try {
      // Handle both absolute and relative URLs
      const urlObj = new URL(url, 'http://dummy.com'); 
      const originalUrl = urlObj.searchParams.get('url');
      if (originalUrl) {
        // Recursively process the original B2 URL
        return getSignedUrlForFile(originalUrl, workspace);
      }
    } catch (e) {
      console.error('Error parsing existing proxy URL:', e);
    }
  }

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
    // Include workspace in the signature payload to ensure integrity
    const payload = `${url}|${timestamp}|${workspace}`;
    const signature = createHmac('sha256', SIGNING_SECRET)
      .update(payload)
      .digest('hex');

    // Point to the global public API endpoint
    return `/api/public/files?url=${encodeURIComponent(url)}&t=${timestamp}&sig=${signature}&w=${workspace}`;
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
