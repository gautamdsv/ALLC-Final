import express from 'express';
import argon2 from 'argon2';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { Role, WaitlistStatus } from '@prisma/client';
import { prisma } from '../db.js';
import { audit } from '../utils/audit.js';
import { authGuard, roleGuard } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';

const router = express.Router();

router.use(authGuard);

router.get('/waitlist', roleGuard(Role.SUPERADMIN, Role.ADMIN, Role.REVIEWER), async (req, res) => {
  const status = req.query.status;
  const email = req.query.email;
  const search = req.query.search;
  const sortBy = req.query.sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 100);
  const skip = (page - 1) * limit;
  const where = {};
  if (status && Object.values(WaitlistStatus).includes(status)) {
    where.status = status;
  }
  if (email) {
    where.email = { contains: String(email), mode: 'insensitive' };
  }
  if (search) {
    const query = String(search).trim();
    if (query) {
      where.OR = [
        { fullName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { rationale: { contains: query, mode: 'insensitive' } },
      ];
    }
  }

  const [items, total] = await Promise.all([
    prisma.waitlistApplication.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.waitlistApplication.count({ where }),
  ]);
  return res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

router.patch('/waitlist/:id', roleGuard(Role.SUPERADMIN, Role.ADMIN), async (req, res) => {
  const updateSchema = z.object({
    status: z.nativeEnum(WaitlistStatus).optional(),
    adminNotes: z.string().optional(),
    priorityScore: z.number().int().min(0).max(100).optional(),
  });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  
  const updateData = { ...parsed.data };
  if (updateData.adminNotes) {
    updateData.adminNotes = sanitizeHtml(updateData.adminNotes, { allowedTags: [], allowedAttributes: {} });
  }

  const row = await prisma.waitlistApplication.update({
    where: { id: req.params.id },
    data: updateData,
  });
  await audit(req.user.sub, 'waitlist.update', 'WaitlistApplication', row.id, parsed.data);

  // Notify applicant when their status changes to a final state
  if (parsed.data.status === 'ACCEPTED' || parsed.data.status === 'REJECTED') {
    const isAccepted = parsed.data.status === 'ACCEPTED';
    sendEmail({
      to: row.email,
      subject: isAccepted
        ? 'Your ALLC application has been accepted 🎉'
        : 'Update on your ALLC application',
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fffe;border:1px solid #e0f0ee;border-radius:12px;">
          <h2 style="color:#062926;margin:0 0 16px;">Hello ${row.fullName},</h2>
          <p style="color:#527B78;font-size:14px;line-height:1.6;">
            ${isAccepted
              ? 'We are delighted to inform you that your application to the ALLC wellness programme has been <strong>accepted</strong>. Our team will be in touch shortly with next steps.'
              : 'Thank you for your interest in the ALLC wellness programme. After careful review, we are unable to offer a place at this time. We encourage you to reapply in the future.'}
          </p>
          <hr style="border:none;border-top:1px solid #e0f0ee;margin:24px 0;"/>
          <p style="color:#9cb8b5;font-size:11px;">ALLC — Asian Lifestyle Longevity Clinic | contact@asianllc.com</p>
        </div>
      `,
    }).catch(() => {}); // fire-and-forget — never block admin action
  }

  return res.json({ item: row });
});

router.delete('/waitlist/:id', roleGuard(Role.SUPERADMIN, Role.ADMIN), async (req, res) => {
  const existing = await prisma.waitlistApplication.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ message: 'Application not found' });
  }

  await prisma.waitlistApplication.delete({ where: { id: req.params.id } });
  await audit(req.user.sub, 'waitlist.delete', 'WaitlistApplication', req.params.id, {
    email: existing.email,
    fullName: existing.fullName,
  });
  return res.json({ message: 'Application deleted' });
});

router.get('/users', roleGuard(Role.SUPERADMIN), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, isActive: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ items: users });
});

router.post('/users', roleGuard(Role.SUPERADMIN), async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(Role).default(Role.ADMIN),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  const created = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: await argon2.hash(parsed.data.password),
      role: parsed.data.role,
    },
    select: { id: true, email: true, role: true, isActive: true, createdAt: true },
  });
  await audit(req.user.sub, 'user.create', 'User', created.id, { email: created.email, role: created.role });
  return res.status(201).json({ item: created });
});

router.patch('/users/:id', roleGuard(Role.SUPERADMIN), async (req, res) => {
  const schema = z.object({
    role: z.nativeEnum(Role).optional(),
    isActive: z.boolean().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }
  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: { id: true, email: true, role: true, isActive: true, createdAt: true, lastLoginAt: true },
  });
  await audit(req.user.sub, 'user.update', 'User', updated.id, parsed.data);
  return res.json({ item: updated });
});

router.get('/audit-events', roleGuard(Role.SUPERADMIN, Role.ADMIN), async (_req, res) => {
  const events = await prisma.auditEvent.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ items: events });
});

export default router;
