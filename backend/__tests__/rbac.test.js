/**
 * RBAC (Role-Based Access Control) tests
 * Validates that role enforcement is correct across protected endpoints.
 *
 * These tests focus on access control boundaries — verifying that each role
 * can only access the endpoints it's authorized for. Data-layer operations
 * (create, update) are tested separately.
 */
import { jest } from '@jest/globals';

// Mock argon2 (required by admin routes for user creation)
jest.unstable_mockModule('argon2', () => ({
  default: {
    verify: jest.fn(),
    hash: jest.fn().mockResolvedValue('$argon2-hashed'),
  },
}));

jest.unstable_mockModule('../src/utils/email.js', () => ({
  sendEmail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule('../src/db.js', () => ({
  prisma: {
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    refreshToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    passwordResetToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    waitlistApplication: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    auditEvent: { create: jest.fn().mockResolvedValue({}), findMany: jest.fn().mockResolvedValue([]) },
    blogPost: {
      create: jest.fn().mockResolvedValue({}),
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
      count: jest.fn().mockResolvedValue(0),
    },
    $disconnect: jest.fn(),
  },
}));

// Import AFTER mocks are defined
const { default: supertest } = await import('supertest');
const { default: app } = await import('../src/server.js');
const { prisma } = await import('../src/db.js');

// Import the actual secret used by verifyAccessToken
const { ACCESS_TOKEN_SECRET } = await import('../src/utils/jwt.js');
const jwt = (await import('jsonwebtoken')).default;

function makeToken(role) {
  return jwt.sign(
    { sub: `user-${role}`, role, email: `${role.toLowerCase()}@allc.local` },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

const request = supertest(app);

beforeEach(() => {
  jest.clearAllMocks();
  // Re-set default mock implementations after clearAllMocks
  prisma.waitlistApplication.findMany.mockResolvedValue([]);
  prisma.waitlistApplication.count.mockResolvedValue(0);
  prisma.user.findMany.mockResolvedValue([]);
  prisma.auditEvent.create.mockResolvedValue({});
  prisma.auditEvent.findMany.mockResolvedValue([]);
});

describe('Role-Based Access Control', () => {
  // --- No token ---
  it('should reject unauthenticated requests to admin endpoints', async () => {
    const res = await request.get('/api/v1/admin/waitlist');
    expect(res.status).toBe(401);
  });

  // --- REVIEWER permissions ---
  it('should allow REVIEWER to GET /admin/waitlist', async () => {
    prisma.waitlistApplication.findMany.mockResolvedValue([]);
    prisma.waitlistApplication.count.mockResolvedValue(0);

    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', `Bearer ${makeToken('REVIEWER')}`);

    expect(res.status).toBe(200);
  });

  it('should forbid REVIEWER from PATCH /admin/waitlist/:id', async () => {
    const res = await request
      .patch('/api/v1/admin/waitlist/some-id')
      .set('Authorization', `Bearer ${makeToken('REVIEWER')}`)
      .send({ status: 'ACCEPTED' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden');
  });

  it('should forbid REVIEWER from DELETE /admin/waitlist/:id', async () => {
    const res = await request
      .delete('/api/v1/admin/waitlist/some-id')
      .set('Authorization', `Bearer ${makeToken('REVIEWER')}`);

    expect(res.status).toBe(403);
  });

  it('should forbid REVIEWER from GET /admin/users', async () => {
    const res = await request
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${makeToken('REVIEWER')}`);

    expect(res.status).toBe(403);
  });

  it('should forbid REVIEWER from GET /admin/audit-events', async () => {
    const res = await request
      .get('/api/v1/admin/audit-events')
      .set('Authorization', `Bearer ${makeToken('REVIEWER')}`);

    expect(res.status).toBe(403);
  });

  // --- ADMIN permissions ---
  it('should allow ADMIN to GET /admin/waitlist', async () => {
    prisma.waitlistApplication.findMany.mockResolvedValue([]);
    prisma.waitlistApplication.count.mockResolvedValue(0);

    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`);

    expect(res.status).toBe(200);
  });

  it('should allow ADMIN to GET /admin/audit-events', async () => {
    prisma.auditEvent.findMany.mockResolvedValue([]);

    const res = await request
      .get('/api/v1/admin/audit-events')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`);

    expect(res.status).toBe(200);
  });

  it('should forbid ADMIN from GET /admin/users', async () => {
    const res = await request
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`);

    expect(res.status).toBe(403);
  });

  it('should forbid ADMIN from POST /admin/users', async () => {
    const res = await request
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .send({ email: 'new@allc.local', password: 'Test12345', role: 'REVIEWER' });

    expect(res.status).toBe(403);
  });

  it('should forbid ADMIN from PATCH /admin/users/:id', async () => {
    const res = await request
      .patch('/api/v1/admin/users/some-id')
      .set('Authorization', `Bearer ${makeToken('ADMIN')}`)
      .send({ role: 'REVIEWER' });

    expect(res.status).toBe(403);
  });

  // --- SUPERADMIN permissions ---
  it('should allow SUPERADMIN to GET /admin/waitlist', async () => {
    prisma.waitlistApplication.findMany.mockResolvedValue([]);
    prisma.waitlistApplication.count.mockResolvedValue(0);

    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', `Bearer ${makeToken('SUPERADMIN')}`);

    expect(res.status).toBe(200);
  });

  it('should allow SUPERADMIN to GET /admin/users', async () => {
    prisma.user.findMany.mockResolvedValue([]);

    const res = await request
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${makeToken('SUPERADMIN')}`);

    expect(res.status).toBe(200);
  });

  it('should allow SUPERADMIN to GET /admin/audit-events', async () => {
    prisma.auditEvent.findMany.mockResolvedValue([]);

    const res = await request
      .get('/api/v1/admin/audit-events')
      .set('Authorization', `Bearer ${makeToken('SUPERADMIN')}`);

    expect(res.status).toBe(200);
  });

  // --- Token security ---
  it('should reject a tampered JWT token', async () => {
    const token = makeToken('SUPERADMIN') + 'tampered';

    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401);
  });

  it('should reject an expired JWT token', async () => {
    const expiredToken = jwt.sign(
      { sub: 'user-exp', role: 'SUPERADMIN', email: 'exp@allc.local' },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '0s' }
    );

    await new Promise((r) => setTimeout(r, 100));

    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  it('should reject requests without Bearer prefix', async () => {
    const res = await request
      .get('/api/v1/admin/waitlist')
      .set('Authorization', makeToken('SUPERADMIN'));

    expect(res.status).toBe(401);
  });
});
