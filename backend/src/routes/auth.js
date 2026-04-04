import express from 'express';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { audit } from '../utils/audit.js';
import { authGuard } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import {
  createAccessToken,
  hashPlainToken,
  verifyHashedToken,
  REFRESH_TOKEN_SECRET
} from '../utils/jwt.js';

const router = express.Router();

const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
const isProd = process.env.NODE_ENV === 'production';

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    await audit(null, 'auth.login.failed', 'User', user?.id, { email: parsed.data.email });
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await argon2.verify(user.passwordHash, parsed.data.password);
  if (!validPassword) {
    await audit(user.id, 'auth.login.failed', 'User', user.id, {});
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
  });
  const tokenHash = await hashPlainToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await audit(user.id, 'auth.login.success', 'User', user.id, {});

  setRefreshCookie(res, refreshToken);
  return res.json({
    accessToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

router.post('/refresh', authLimiter, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Missing refresh token' });
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const storedTokens = await prisma.refreshToken.findMany({
    where: {
      userId: payload.sub,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });
  const match = await Promise.all(
    storedTokens.map(async (tokenRow) => ({
      tokenRow,
      ok: await verifyHashedToken(tokenRow.tokenHash, refreshToken),
    })),
  );
  const matched = match.find((item) => item.ok)?.tokenRow;
  if (!matched) {
    return res.status(401).json({ message: 'Refresh session not found' });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'User inactive' });
  }

  const nextRefreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
  });

  await prisma.refreshToken.update({
    where: { id: matched.id },
    data: { revokedAt: new Date() },
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await hashPlainToken(nextRefreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip,
    },
  });

  setRefreshCookie(res, nextRefreshToken);
  return res.json({
    accessToken: createAccessToken(user),
    user: { id: user.id, email: user.email, role: user.role },
  });
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

router.post('/forgot-password', authLimiter, async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  
  if (user && user.isActive) {
     const resetToken = crypto.randomBytes(32).toString('hex');
     const tokenHash = await hashPlainToken(resetToken);
     
     await prisma.passwordResetToken.create({
       data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
       }
     });

     const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
     await sendPasswordResetEmail({ email: user.email, resetToken, baseUrl });
  }
  
  // We always return 200 to prevent email enumeration
  return res.json({ message: 'If that email exists, we sent a password reset link.' });
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  newPassword: z.string().min(8)
});

router.post('/reset-password', authLimiter, async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    return res.status(400).json({ message: 'Invalid link or expired.' });
  }

  const resetTokens = await prisma.passwordResetToken.findMany({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });

  const match = await Promise.all(
    resetTokens.map(async (tokenRow) => ({
      tokenRow,
      ok: await verifyHashedToken(tokenRow.tokenHash, parsed.data.token),
    }))
  );
  
  const matched = match.find((item) => item.ok)?.tokenRow;
  if (!matched) {
    return res.status(400).json({ message: 'Invalid link or expired.' });
  }

  const newPasswordHash = await argon2.hash(parsed.data.newPassword);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash }
  });
  
  await prisma.passwordResetToken.update({
    where: { id: matched.id },
    data: { usedAt: new Date() }
  });
  
  // Revoke all existing refresh sessions
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() }
  });
  
  await audit(user.id, 'auth.password_reset.success', 'User', user.id, {});
  return res.json({ message: 'Password has been reset successfully. Please log in.' });
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const sessions = await prisma.refreshToken.findMany({
      where: { revokedAt: null, expiresAt: { gt: new Date() } },
    });
    for (const session of sessions) {
      const ok = await verifyHashedToken(session.tokenHash, refreshToken).catch(() => false);
      if (ok) {
        await prisma.refreshToken.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }
  }
  clearRefreshCookie(res);
  return res.json({ message: 'Logged out' });
});

router.get('/me', authGuard, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: { id: true, email: true, role: true, isActive: true, lastLoginAt: true },
  });
  return res.json({ user });
});

// Self-service password change — any authenticated admin
const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

router.patch('/password', authGuard, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await argon2.verify(user.passwordHash, parsed.data.currentPassword);
  if (!valid) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  const newHash = await argon2.hash(parsed.data.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  // Revoke all sessions — forces re-login on all devices
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  clearRefreshCookie(res);
  await audit(user.id, 'auth.password_change', 'User', user.id, {});
  return res.json({ message: 'Password changed. Please log in again.' });
});

export default router;
