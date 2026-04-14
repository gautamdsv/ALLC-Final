// Blog API wrapper — uses getAccessToken() from api.js for auth.

import { getAccessToken } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const CATEGORIES = ['Event', 'Seminar', 'Health Article', 'Tip'];

/** Temp client-side ID (used by editor before first save) */
export function generateId() {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function authHeaders() {
  const token = getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Public helpers (no auth needed)

/** Fetch all published posts. */
export async function getPosts({ category, page = 1, limit = 9 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (category && category !== 'All') params.set('category', category);
  const res = await fetch(`${API_BASE}/api/v1/blog?${params}`);
  if (!res.ok) return { items: [], pagination: {} };
  return res.json(); // { items, pagination }
}

/** Fetch one published post by ID. */
export async function getPostById(id) {
  const res = await fetch(`${API_BASE}/api/v1/blog/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.post || null;
}

// Admin helpers (require active session)

/** Fetch all posts (drafts + published) for admin. */
export async function getAllPostsAdmin({ page = 1, limit = 20 } = {}) {
  const res = await fetch(
    `${API_BASE}/api/v1/blog/admin/all?page=${page}&limit=${limit}`,
    { headers: authHeaders(), credentials: 'include' },
  );
  if (!res.ok) return { items: [], pagination: {} };
  return res.json();
}

/** Create or update a post. If id starts with "draft_" or is empty, creates new. */
export async function savePost(post) {
  const isNew = !post.id || post.id.startsWith('draft_');
  const url = isNew
    ? `${API_BASE}/api/v1/blog`
    : `${API_BASE}/api/v1/blog/${post.id}`;

  const body = {
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    category: post.category,
    author: post.author,
    coverImage: post.coverImage || '',
    tags: typeof post.tags === 'string'
      ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : post.tags || [],
    published: post.published,
    date: post.date,
  };

  const res = await fetch(url, {
    method: isNew ? 'POST' : 'PATCH',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Save failed' }));
    throw new Error(err.message || 'Save failed');
  }
  const data = await res.json();
  return data.post;
}

/** Delete a post (SUPERADMIN only). */
export async function deletePost(id) {
  const res = await fetch(`${API_BASE}/api/v1/blog/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Delete failed' }));
    throw new Error(err.message || 'Delete failed');
  }
}
