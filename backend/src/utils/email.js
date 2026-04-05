/* global process */
import { Resend } from 'resend';
import { logger } from './logger.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ALLC Clinic <noreply@asianllc.com>';

let resend = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
  logger.info('Resend email provider configured');
} else {
  logger.warn('RESEND_API_KEY not set — emails will be logged to console only');
}

/**
 * Send a transactional email.
 * Falls back to console logging when Resend is not configured.
 *
 * @param {{ to: string, subject: string, html: string }} options
 * @returns {Promise<{ success: boolean, id?: string }>}
 */
export async function sendEmail({ to, subject, html }) {
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      if (error) {
        logger.error('Resend email failed', { to, subject, error });
        return { success: false };
      }

      logger.info('Email sent via Resend', { to, subject, id: data?.id });
      return { success: true, id: data?.id };
    } catch (err) {
      logger.error('Resend send exception', { to, subject, error: err.message });
      return { success: false };
    }
  }

  // Fallback: log to console for local development
  logger.info(`[Email Mock] To: ${to} | Subject: ${subject}`);
  logger.info(`[Email Mock] Body:\n${html}`);
  return { success: true, id: 'mock' };
}

/**
 * Build and send the password reset email.
 *
 * @param {{ email: string, resetToken: string, baseUrl: string }} options
 */
export async function sendPasswordResetEmail({ email, resetToken, baseUrl }) {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fffe; border: 1px solid #e0f0ee; border-radius: 12px;">
      <h2 style="color: #062926; margin: 0 0 16px;">Password Reset Request</h2>
      <p style="color: #527B78; font-size: 14px; line-height: 1.6;">
        You requested a password reset for your ALLC admin account. Click the button below to set a new password.
        This link expires in <strong>15 minutes</strong>.
      </p>
      <a href="${resetLink}" style="display: inline-block; margin: 24px 0; padding: 12px 28px; background: #2AB5A5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Reset Password
      </a>
      <p style="color: #527B78; font-size: 12px; line-height: 1.5;">
        If you didn't request this, please ignore this email. Your password won't change.
      </p>
      <hr style="border: none; border-top: 1px solid #e0f0ee; margin: 24px 0;" />
      <p style="color: #9cb8b5; font-size: 11px;">ALLC — Asian Lifestyle Longevity Clinic</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your ALLC admin password',
    html,
  });
}
