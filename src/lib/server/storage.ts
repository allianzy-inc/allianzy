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

export async function getSignedUrlForFile(url: string | null): Promise<string | null> {
  if (!url) return null;

  // Check if it's a B2 URL
  if (url.includes('backblazeb2.com') && url.includes(env.B2_BUCKET_NAME!)) {
    try {
      // Extract key from URL
      // URL format: https://f005.backblazeb2.com/file/<bucketName>/<key>
      const parts = url.split(`/file/${env.B2_BUCKET_NAME}/`);
      if (parts.length === 2) {
        const key = parts[1];
        
        // Generate a local signed proxy URL instead of a direct S3 presigned URL
        // This hides the backend and allows us to enforce short expiration tied to the app
        return generateLocalProxyUrl(key);
      }
    } catch (err) {
      console.error('Error signing URL:', err);
      return url; // Return original if signing fails
    }
  }

  return url;
}

function generateLocalProxyUrl(key: string): string {
  // Set expiration to 15 minutes (900 seconds)
  const expires = Math.floor(Date.now() / 1000) + 900;
  
  // Create signature: HMAC(secret, key + expires)
  const dataToSign = `${key}:${expires}`;
  const signature = createHmac('sha256', SIGNING_SECRET)
    .update(dataToSign)
    .digest('hex');
    
  // Return local API path
  return `/api/files?key=${encodeURIComponent(key)}&expires=${expires}&signature=${signature}`;
}

export function verifyFileSignature(key: string, expires: string, signature: string): boolean {
  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = parseInt(expires, 10);
    
    // Check expiration
    if (isNaN(exp) || now > exp) {
      return false;
    }
    
    // Recreate signature
    const dataToSign = `${key}:${expires}`;
    const expectedSignature = createHmac('sha256', SIGNING_SECRET)
      .update(dataToSign)
      .digest('hex');
      
    // Constant time comparison to prevent timing attacks
    return signature === expectedSignature;
  } catch (e) {
    return false;
  }
}

export async function getFileStream(key: string) {
  const command = new GetObjectCommand({
    Bucket: env.B2_BUCKET_NAME,
    Key: key
  });
  
  return await s3.send(command);
}
