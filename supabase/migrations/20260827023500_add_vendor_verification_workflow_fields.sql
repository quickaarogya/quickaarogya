-- Add verification application fields to Organization table
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "licenseDocumentUrl" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
