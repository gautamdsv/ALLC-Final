import { prisma } from '../db.js';

export function audit(actorUserId, action, entityType, entityId, metadata) {
  return prisma.auditEvent.create({
    data: {
      actorUserId,
      action,
      entityType,
      entityId,
      metadata,
    },
  });
}
