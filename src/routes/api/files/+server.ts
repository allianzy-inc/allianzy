import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyFileSignature, getFileStream } from '$lib/server/storage';

export const GET: RequestHandler = async ({ url }) => {
    const key = url.searchParams.get('key');
    const expires = url.searchParams.get('expires');
    const signature = url.searchParams.get('signature');

    if (!key || !expires || !signature) {
        throw error(400, 'Missing parameters');
    }

    // Verify signature
    if (!verifyFileSignature(key, expires, signature)) {
        throw error(403, 'Invalid or expired signature');
    }

    try {
        const response = await getFileStream(key);
        
        // AWS SDK v3 Body can be various types.
        // For SvelteKit/Web Standard Response, we need a Web ReadableStream or Blob or Buffer.
        // If running in Node, Body is often a Node Readable stream.
        
        const body = response.Body;
        let stream: ReadableStream | Blob | BufferSource | null = null;

        if (body) {
             // Check if it has transformToWebStream (Node environment newer SDKs)
            if (typeof (body as any).transformToWebStream === 'function') {
                stream = (body as any).transformToWebStream();
            } else if (typeof (body as any).transformToByteArray === 'function') {
                // Fallback to byte array (buffers the file)
                const bytes = await (body as any).transformToByteArray();
                stream = bytes;
            } else {
                // Fallback attempt to use as is (might fail if raw Node stream)
                stream = body as any;
            }
        }

        if (!stream) {
            throw error(404, 'File content empty');
        }

        // Determine content type
        const contentType = response.ContentType || 'application/octet-stream';
        
        // Extract filename from key
        const filename = key.split('/').pop() || 'download';

        return new Response(stream as any, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'private, max-age=3600',
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });
    } catch (err) {
        console.error('Error serving file:', err);
        throw error(404, 'File not found or inaccessible');
    }
};
