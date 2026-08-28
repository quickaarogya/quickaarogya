-- Step 1: Add organizationId column to Doctor
ALTER TABLE "Doctor" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Step 2: Add organizationId column to Pharmacy
ALTER TABLE "Pharmacy" ADD COLUMN IF NOT EXISTS "organizationId" TEXT;

-- Step 3: Create Indexes
CREATE INDEX IF NOT EXISTS "Doctor_organizationId_idx" ON "Doctor"("organizationId");
CREATE INDEX IF NOT EXISTS "Pharmacy_organizationId_idx" ON "Pharmacy"("organizationId");

-- Step 4: Add Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Doctor_organizationId_fkey'
    ) THEN
        ALTER TABLE "Doctor" 
        ADD CONSTRAINT "Doctor_organizationId_fkey" 
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Pharmacy_organizationId_fkey'
    ) THEN
        ALTER TABLE "Pharmacy" 
        ADD CONSTRAINT "Pharmacy_organizationId_fkey" 
        FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 5: Backfill seeded Doctor and Pharmacy records to corresponding Organizations
-- 1. Link Dr. Ananya Roy (doc-1) to Apollo Hospital & Heart Center
UPDATE "Doctor" 
SET "organizationId" = 'org-apollo-hospital' 
WHERE "id" = 'doc-1' OR "medicalLicenseNumber" = 'MCI-2012-78901';

-- 2. Link Dr. Vivek Mehra (doc-2) to Dr. Vivek Mehra Lifestyle & Diabetes Clinic
UPDATE "Doctor" 
SET "organizationId" = 'org-dr-vivek-clinic' 
WHERE "id" = 'doc-2' OR "medicalLicenseNumber" = 'DMC-2015-44219';

-- 3. Link any remaining doctors to Apollo Hospital by default
UPDATE "Doctor"
SET "organizationId" = 'org-apollo-hospital'
WHERE "organizationId" IS NULL;

-- 4. Link Apollo 24/7 Express Pharmacy (pharma-1) to Apollo Pharmacy Organization
UPDATE "Pharmacy" 
SET "organizationId" = 'org-apollo-pharmacy' 
WHERE "id" = 'pharma-1' OR "drugLicenseNumber" = 'DL-20B-18492';

-- 5. Link any remaining pharmacies to Apollo Pharmacy by default
UPDATE "Pharmacy"
SET "organizationId" = 'org-apollo-pharmacy'
WHERE "organizationId" IS NULL;
