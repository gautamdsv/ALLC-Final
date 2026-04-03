-- CreateIndex
CREATE INDEX "WaitlistApplication_createdAt_idx" ON "WaitlistApplication"("createdAt");

-- CreateIndex
CREATE INDEX "WaitlistApplication_status_createdAt_idx" ON "WaitlistApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "WaitlistApplication_email_idx" ON "WaitlistApplication"("email");
