import express from 'express';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../db.js';
import { audit } from '../utils/audit.js';
import { authGuard, roleGuard } from '../middleware/auth.js';

const router = express.Router();

const ALLOWED_CATEGORIES = ['Event', 'Seminar', 'Health Article', 'Tip'];

const blogCreateSchema = z.object({
  title: z.string().min(1).max(300),
  shortDescription: z.string().min(1).max(500),
  content: z.string().min(1),
  category: z.enum(['Event', 'Seminar', 'Health Article', 'Tip']),
  author: z.string().default('Dr. Divya Gautam'),
  coverImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  date: z.string().optional(), // ISO date string
});

const blogUpdateSchema = blogCreateSchema.partial();

function sanitizePost(data) {
  return {
    ...data,
    title: sanitizeHtml(data.title || '', { allowedTags: [], allowedAttributes: {} }),
    shortDescription: sanitizeHtml(data.shortDescription || '', { allowedTags: [], allowedAttributes: {} }),
    content: sanitizeHtml(data.content || '', {
      allowedTags: ['p', 'br', 'b', 'strong', 'em', 'i', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
      allowedAttributes: {},
    }),
    tags: (data.tags || []).map((t) => sanitizeHtml(t, { allowedTags: [], allowedAttributes: {} })).filter(Boolean),
  };
}

// --- Public routes ---

// GET /api/v1/blog — list published posts
router.get('/', async (req, res) => {
  const category = req.query.category;
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 9), 1), 50);
  const skip = (page - 1) * limit;

  const where = { published: true };
  if (category && ALLOWED_CATEGORIES.includes(category)) {
    where.category = category;
  }

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        shortDescription: true,
        category: true,
        author: true,
        coverImage: true,
        tags: true,
        date: true,
        published: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return res.json({
    items,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  });
});

// GET /api/v1/blog/:id — single published post
router.get('/:id', async (req, res) => {
  const post = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!post || !post.published) {
    return res.status(404).json({ message: 'Post not found' });
  }
  return res.json({ post });
});

// --- Admin routes (protected) ---

// GET /api/v1/blog/admin/all — all posts (published + drafts) for admin
router.get('/admin/all', authGuard, roleGuard(Role.SUPERADMIN, Role.ADMIN, Role.REVIEWER), async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count(),
  ]);

  return res.json({
    items,
    pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  });
});

// POST /api/v1/blog — create post
router.post('/', authGuard, roleGuard(Role.SUPERADMIN, Role.ADMIN), async (req, res) => {
  const parsed = blogCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }

  const sanitized = sanitizePost(parsed.data);

  const post = await prisma.blogPost.create({
    data: {
      ...sanitized,
      coverImage: sanitized.coverImage || null,
      date: sanitized.date ? new Date(sanitized.date) : new Date(),
    },
  });

  await audit(req.user.sub, 'blog.create', 'BlogPost', post.id, { title: post.title });
  return res.status(201).json({ post });
});

// PATCH /api/v1/blog/:id — update post
router.patch('/:id', authGuard, roleGuard(Role.SUPERADMIN, Role.ADMIN), async (req, res) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Post not found' });

  const parsed = blogUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues });
  }

  const sanitized = sanitizePost({ ...existing, ...parsed.data });
  const updateData = {
    ...sanitized,
    coverImage: sanitized.coverImage || null,
  };
  if (sanitized.date) {
    updateData.date = new Date(sanitized.date);
  }

  const post = await prisma.blogPost.update({
    where: { id: req.params.id },
    data: updateData,
  });

  await audit(req.user.sub, 'blog.update', 'BlogPost', post.id, { title: post.title });
  return res.json({ post });
});

// DELETE /api/v1/blog/:id — delete post (SUPERADMIN only)
router.delete('/:id', authGuard, roleGuard(Role.SUPERADMIN), async (req, res) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Post not found' });

  await prisma.blogPost.delete({ where: { id: req.params.id } });
  await audit(req.user.sub, 'blog.delete', 'BlogPost', req.params.id, { title: existing.title });
  return res.json({ message: 'Post deleted' });
});

export default router;
