import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { getFileStream } from '$lib/server/storage';
import type { RequestHandler } from './$types';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '$env/dynamic/private';
import { createHmac } from 'crypto';

const SIGNING_SECRET = env.B2_APPLICATION_KEY!;

function logDebug(message: string) {
    const logPath = path.resolve('debug-proxy.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

export const GET: RequestHandler = async ({ url, request, locals, params }) => {
    const fileUrl = url.searchParams.get('url');
    logDebug(`Request for url: ${fileUrl}`);
            
    // Log headers for debugging
    const headers: Record<string, string> = {};
    request.headers.forEach((v, k) => headers[k] = v);
    // Redact cookie value but show presence
    if (headers.cookie) headers.cookie = `[Present, length: ${headers.cookie.length}]`;
    logDebug(`Request Headers: ${JSON.stringify(headers)}`);

    // 0. Signature Validation (Bypass Session if Valid)
    const t = url.searchParams.get('t');
    const sig = url.searchParams.get('sig');
    const workspace = params.workspace;
    let isSignatureValid = false;

    if (fileUrl && t && sig && workspace) {
        const payload = `${fileUrl}|${t}|${workspace}`;
        const expectedSig = createHmac('sha256', SIGNING_SECRET)
            .update(payload)
            .digest('hex');
        
        if (sig === expectedSig) {
            // Check expiration (e.g. 1 hour = 3600000 ms)
            // Use 24 hours just to be safe for now, or match standard presigned url times
            const timeDiff = Date.now() - Number(t);
            if (timeDiff < 24 * 3600 * 1000) {
                 logDebug('Signature valid, bypassing session check');
                 isSignatureValid = true;
            } else {
                logDebug(`Signature expired. Diff: ${timeDiff}`);
            }
        } else {
            logDebug(`Invalid signature. Expected: ${expectedSig}, Got: ${sig}`);
        }
    }

    // 1. Validate Session (only if signature is invalid)
    if (!isSignatureValid) {
        let user = locals.user;

        if (user) {
            logDebug(`Session validated via locals for user: ${user.email}`);
        } else {
            logDebug('locals.user missing, attempting manual validation');
            try {
                const cookie = request.headers.get('cookie');
                logDebug(`Cookie present: ${!!cookie}, Length: ${cookie?.length || 0}`);

                const sessionData = await validateSession(request);
                if (!sessionData?.session) {
                    logDebug('Session validation failed: No session data returned from validateSession');
                    throw error(401, 'Unauthorized');
                }
                logDebug(`Session validated manually for user: ${sessionData.user?.email}`);
                user = sessionData.user; // Use the manually validated user
            } catch (e) {
                logDebug(`Session validation error/throw: ${JSON.stringify(e)}`);
                if ((e as any)?.status === 401) throw e;
                throw error(401, 'Unauthorized');
            }
        }
    }

    // 2. Get URL/Key
    if (!fileUrl) {
        logDebug('Missing url parameter');
        throw error(400, 'Missing url parameter');
    }

    // 3. Extract Bucket and Key
    const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
    const match = fileUrl.match(b2Regex);

    if (!match) {
        logDebug(`Invalid B2 URL format: ${fileUrl}`);
        throw error(400, 'Invalid B2 URL');
    }

    const bucket = match[1];
    const key = match[2];
    logDebug(`Extracted bucket: ${bucket}, key: ${key}`);

    try {
        // 4. Fetch from S3
        const output = await getFileStream(key, bucket);
        
        if (!output.Body) {
            logDebug('File not found in S3 (Body is empty)');
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

        logDebug('Serving file successfully');
        return new Response(body, {
            headers
        });
    } catch (err) {
        logDebug(`Error serving file: ${err}`);
        console.error('Error serving file:', err);
        throw error(500, 'Error serving file');
    }
};
