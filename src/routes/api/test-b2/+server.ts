import { json } from '@sveltejs/kit';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { getSignedUrlForFile } from '$lib/server/storage';
import type { RequestHandler } from './$types';

const s3 = new S3Client({
  endpoint: env.B2_ENDPOINT,
  region: env.B2_REGION,
  credentials: {
    accessKeyId: env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: env.B2_APPLICATION_KEY!
  }
});

export const GET: RequestHandler = async () => {
    const results: any = {
        config: {
            bucket: env.B2_BUCKET_NAME,
            endpoint: env.B2_ENDPOINT,
            region: env.B2_REGION
        },
        tests: {}
    };

    // Test 1: List Objects
    try {
        const command = new ListObjectsV2Command({
            Bucket: env.B2_BUCKET_NAME,
            MaxKeys: 1
        });
        const response = await s3.send(command);
        results.tests.listObjects = { status: 'success', data: response.Contents?.length || 0 };
    } catch (e: any) {
        results.tests.listObjects = { status: 'error', message: e.message, code: e.Code, name: e.name };
    }

    // Test 2: Generate Signed URL and return it
    const fileKey = 'avatars/1770214904685-Frame_1171274949.png'; 
    const b2Url = `https://f005.backblazeb2.com/file/${env.B2_BUCKET_NAME}/${fileKey}`;
    
    try {
        const signedUrl = getSignedUrlForFile(b2Url, 'allianzy');
        results.tests.signedUrl = signedUrl;
        results.tests.originalUrl = b2Url;
    } catch (e: any) {
        results.tests.signedUrlGeneration = { status: 'error', message: e.message };
    }

    return json(results);
};
