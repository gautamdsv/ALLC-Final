/**
 * Health endpoint test
 * Validates that the API is alive and returns expected structure.
 */
import { jest } from '@jest/globals';

// Mock Prisma before importing the app
jest.unstable_mockModule('../src/db.js', () => ({
  prisma: {
    user: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
    refreshToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
    passwordResetToken: { create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    waitlistApplication: { create: jest.fn(), findMany: jest.fn(), count: jest.fn(), update: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    auditEvent: { create: jest.fn(), findMany: jest.fn() },
    $disconnect: jest.fn(),
  },
}));

const { default: supertest } = await import('supertest');
const { default: app } = await import('../src/server.js');

const request = supertest(app);

describe('GET /api/v1/health', () => {
  it('should return 200 with ok and version', async () => {
    const res = await request.get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('version');
    expect(typeof res.body.version).toBe('string');
  });
});
