import { Resend } from "resend";
const RESEND_API_KEY = "re_SPeur9fR_2dRTtEnTSMNqmjUannfzjg43";
const resend = new Resend(RESEND_API_KEY);
async function sendEmail({ from = "Allianzy <no-reply@updates.allianzy.us>", to, subject, html, text }) {
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
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
export {
  sendEmail as s
};
