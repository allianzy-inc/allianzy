import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getFileStream } from '$lib/server/storage';
import type { RequestHandler } from './$types';
import { Readable } from 'stream';

export const GET: RequestHandler = async ({ url, request }) => {
    // 1. Validate Session
    const sessionData = await validateSession(request);
    if (!sessionData?.session) {
        throw error(401, 'Unauthorized');
    }

    // 2. Get URL/Key
    const fileUrl = url.searchParams.get('url');
    if (!fileUrl) {
        throw error(400, 'Missing url parameter');
    }

    // 3. Extract Bucket and Key
    const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
    const match = fileUrl.match(b2Regex);

    if (!match) {
        throw error(400, 'Invalid B2 URL');
    }

    const bucket = match[1];
    const key = match[2];

    try {
        // 4. Fetch from S3
        const output = await getFileStream(key, bucket);
        
        if (!output.Body) {
            throw error(404, 'File not found');
        }

        const headers = new Headers();
        if (output.ContentType) headers.set('Content-Type', output.ContentType);
        if (output.ContentLength) headers.set('Content-Length', output.ContentLength.toString());
        if (output.LastModified) headers.set('Last-Modified', output.LastModified.toUTCString());
        
        // Cache control
        headers.set('Cache-Control', 'private, max-age=3600');

        // Handle streaming response
        // @ts-ignore
        const stream = output.Body as any;
        
        // Convert to Web ReadableStream if it's a Node stream and supports toWeb (Node 18+)
        // or just pass it if the adapter supports it.
        // For maximum compatibility, we try to convert.
        let body: ReadableStream | null = null;
        
        if (typeof stream.pipe === 'function') {
            // It's a Node stream
            // @ts-ignore
            body = Readable.toWeb(stream);
        } else {
            // It might already be a Web stream or Blob
            body = stream;
        }

        return new Response(body, {
            headers
        });
    } catch (err) {
        console.error('Error serving file:', err);
        throw error(500, 'Error serving file');
    }
};
