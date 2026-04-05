import express from 'express';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { prisma } from '../db.js';
import { audit } from '../utils/audit.js';
import { waitlistLimiter } from '../middleware/rateLimiter.js';
import { sendEmail } from '../utils/email.js';

/* global process */
const router = express.Router();

const waitlistCreateSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  healthVector: z.string().optional(),
  rationale: z.string().min(10),
});

function newSubmissionEmailHtml({ fullName, email, healthVector, rationale }) {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fffe;border:1px solid #e0f0ee;border-radius:12px;">
      <h2 style="color:#062926;margin:0 0 4px;">New Waitlist Application</h2>
      <p style="color:#527B78;font-size:13px;margin:0 0 24px;">Someone just applied to join the ALLC waitlist.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#9cb8b5;width:120px;">Name</td><td style="padding:8px 0;color:#062926;font-weight:600;">${fullName}</td></tr>
        <tr><td style="padding:8px 0;color:#9cb8b5;">Email</td><td style="padding:8px 0;color:#062926;">${email}</td></tr>
        <tr><td style="padding:8px 0;color:#9cb8b5;">Program</td><td style="padding:8px 0;color:#062926;">${healthVector || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#9cb8b5;vertical-align:top;">Rationale</td><td style="padding:8px 0;color:#062926;">${rationale}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e0f0ee;margin:24px 0;"/>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display:inline-block;padding:10px 24px;background:#2AB5A5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Review in Admin Dashboard</a>
      <p style="color:#9cb8b5;font-size:11px;margin:20px 0 0;">ALLC — Asian Lifestyle Longevity Clinic</p>
    </div>
  `;
}

router.post('/', waitlistLimiter, async (req, res) => {
  const parsed = waitlistCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }

  const sanitizedData = {
    ...parsed.data,
    rationale: sanitizeHtml(parsed.data.rationale, { allowedTags: [], allowedAttributes: {} }),
    fullName: sanitizeHtml(parsed.data.fullName, { allowedTags: [], allowedAttributes: {} }),
  };

  const appRow = await prisma.waitlistApplication.create({ data: sanitizedData });
  await audit(null, 'waitlist.submit', 'WaitlistApplication', appRow.id, { email: appRow.email });

  // Notify clinic of new application (fire-and-forget — don't block response)
  const notifyEmail = process.env.CLINIC_NOTIFY_EMAIL;
  if (notifyEmail) {
    sendEmail({
      to: notifyEmail,
      subject: `New Waitlist Application — ${sanitizedData.fullName}`,
      html: newSubmissionEmailHtml(sanitizedData),
    }).catch(() => {}); // silent — never fail the request over a notification
  }

  return res.status(201).json({ id: appRow.id, message: 'Application submitted' });
});

export default router;
