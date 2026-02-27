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

export const SUPPORT_EMAIL = 'support@allianzy.us';

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

export interface SupportNotificationOptions {
    subject: string;
    html: string;
    text?: string;
}

/** Sends a copy of the notification to support@allianzy.us (e.g. new case, client message, intake contact). */
export async function sendSupportNotification({ subject, html, text }: SupportNotificationOptions) {
    return sendEmail({ to: SUPPORT_EMAIL, subject, html, text });
}
