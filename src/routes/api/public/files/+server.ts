import { error } from '@sveltejs/kit';
import { getFileStream } from '$lib/server/storage';
import type { RequestHandler } from './$types';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '$env/dynamic/private';
import { createHmac } from 'crypto';

const SIGNING_SECRET = env.B2_APPLICATION_KEY!;

function logDebug(message: string) {
    try {
        const logPath = path.resolve('debug-public-proxy.log');
        const timestamp = new Date().toISOString();
        fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
    } catch (e) {
        // ignore
    }
}

export const OPTIONS: RequestHandler = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    });
};

export const GET: RequestHandler = async ({ url, request }) => {
    const fileUrl = url.searchParams.get('url');
    const t = url.searchParams.get('t');
    const sig = url.searchParams.get('sig');
    const workspace = url.searchParams.get('w'); // Workspace from query param

    logDebug(`Request: ${url.toString()}`);
    
    // 1. Validate Parameters
    if (!fileUrl || !t || !sig || !workspace) {
        logDebug('Missing parameters');
        throw error(400, 'Missing parameters');
    }

    // 2. Validate Signature
    // Payload must match exactly what was signed in storage.ts
    const payload = `${fileUrl}|${t}|${workspace}`;
    const expectedSig = createHmac('sha256', SIGNING_SECRET)
        .update(payload)
        .digest('hex');

    if (sig !== expectedSig) {
        logDebug(`Invalid signature. Expected: ${expectedSig}, Got: ${sig}`);
        throw error(403, 'Invalid signature');
    }

    // 3. Check Expiration (24 hours)
    const timeDiff = Date.now() - Number(t);
    if (timeDiff > 24 * 3600 * 1000) {
        logDebug(`Signature expired. Diff: ${timeDiff}`);
        throw error(410, 'Link expired');
    }

    // 4. Extract Bucket and Key
    const b2Regex = /https:\/\/[^/]+\.backblazeb2\.com\/file\/([^/]+)\/(.+)/;
    const match = fileUrl.match(b2Regex);

    if (!match) {
        logDebug(`Invalid B2 URL format: ${fileUrl}`);
        throw error(400, 'Invalid B2 URL');
    }

    const bucket = match[1];
    const key = match[2];

    try {
        // 5. Fetch from S3/B2
        const output = await getFileStream(key, bucket);
        
        if (!output.Body) {
            logDebug('File not found in S3 (Body is empty)');
            throw error(404, 'File not found');
        }

        const headers = new Headers();
        if (output.ContentType) headers.set('Content-Type', output.ContentType);
        if (output.ContentLength) headers.set('Content-Length', output.ContentLength.toString());
        if (output.LastModified) headers.set('Last-Modified', output.LastModified.toUTCString());
        
        // Cache control and CORS
        headers.set('Cache-Control', 'private, max-age=3600');
        headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins
        headers.set('Content-Disposition', 'inline'); // Force display in browser

        // Handle streaming response
        // @ts-ignore
        const stream = output.Body as any;
        
        let body: ReadableStream | null = null;
        
        if (typeof stream.pipe === 'function') {
            // Node stream
            // @ts-ignore
            body = Readable.toWeb(stream);
        } else {
            // Web stream
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
