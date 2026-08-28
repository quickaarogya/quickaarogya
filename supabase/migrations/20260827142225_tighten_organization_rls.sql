-- Phase 16: Defense-in-Depth Row Level Security (RLS) Policies Scoped by organizationId

-- 1. Enable RLS on Organization and StaffMember
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaffMember" ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any previous permissive policies
DROP POLICY IF EXISTS "Permissive staff read on Organization" ON "Organization";
DROP POLICY IF EXISTS "Permissive staff read on StaffMember" ON "StaffMember";
DROP POLICY IF EXISTS "Staff members can view their own organization" ON "Organization";
DROP POLICY IF EXISTS "Staff can view roster of their own organization" ON "StaffMember";
DROP POLICY IF EXISTS "Org Admins can update their own organization" ON "Organization";
DROP POLICY IF EXISTS "Org Admins can manage staff in their organization" ON "StaffMember";

-- 3. Strict Organization Policies:
-- A staff member can only view and interact with the Organization they belong to, or public directory verified entities
CREATE POLICY "Staff members can view their own organization"
ON "Organization"
FOR SELECT
USING (
  id IN (
    SELECT "organizationId"
    FROM "StaffMember"
    WHERE "userId" = auth.uid()::text
      AND "isActive" = true
  )
  OR "verificationStatus" = 'VERIFIED'
);

CREATE POLICY "Org Admins can update their own organization"
ON "Organization"
FOR UPDATE
USING (
  id IN (
    SELECT "organizationId"
    FROM "StaffMember"
    WHERE "userId" = auth.uid()::text
      AND "role" = 'ORG_ADMIN'
      AND "isActive" = true
  )
);

-- 4. Strict StaffMember Policies:
-- Staff members can ONLY view fellow staff members within their own organization (cross-tenant isolation)
CREATE POLICY "Staff can view roster of their own organization"
ON "StaffMember"
FOR SELECT
USING (
  "organizationId" IN (
    SELECT "organizationId"
    FROM "StaffMember"
    WHERE "userId" = auth.uid()::text
      AND "isActive" = true
  )
);

-- Only ORG_ADMINs can insert, update, or remove staff within their own organization
CREATE POLICY "Org Admins can manage staff in their organization"
ON "StaffMember"
FOR ALL
USING (
  "organizationId" IN (
    SELECT "organizationId"
    FROM "StaffMember"
    WHERE "userId" = auth.uid()::text
      AND "role" = 'ORG_ADMIN'
      AND "isActive" = true
  )
);
