import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(RESEND_API_KEY);

export interface EmailOptions {
    from?: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ from = 'Allianzy <no-reply@updates.allianzy.us>', to, subject, html, text }: EmailOptions) {
    try {
        const data = await resend.emails.send({
            from,
            to,
            subject,
            html,
            text
        });

        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
