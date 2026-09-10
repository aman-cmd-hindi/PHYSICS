-- 00002_rbac_and_content_lifecycle.sql
-- Enforces strict server-side role resolution, RLS boundaries, and Content Studio review lifecycle.

-- 1. Update profiles table constraint to support distinct roles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'tutor', 'admin', 'content_manager', 'admin/content_manager'));

-- 2. Force signup trigger to ALWAYS create 'student' role regardless of browser metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'student' -- Locked: Never trust role from client metadata
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Prevent users from updating their own role column via RLS
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile details"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    -- Ensure role cannot be altered by normal user update
    role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 4. Content Review & Publication Audit Table
CREATE TABLE IF NOT EXISTS public.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'VALIDATION', 'HUMAN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')),
  human_verified BOOLEAN NOT NULL DEFAULT false,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewer_email TEXT,
  change_reason TEXT NOT NULL,
  checksum TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;

-- Only Admins and Content Managers can view and insert review logs
CREATE POLICY "Admin content review read"
  ON public.content_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'content_manager', 'admin/content_manager')
    )
  );

CREATE POLICY "Admin content review insert"
  ON public.content_reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'content_manager', 'admin/content_manager')
    )
  );

-- 5. Durable Offline Sync Queue Table (Server Sink & Acknowledgement)
CREATE TABLE IF NOT EXISTS public.sync_mutations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mutation_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload JSONB NOT NULL,
  client_version TEXT,
  client_timestamp TIMESTAMPTZ NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'failed')),
  idempotency_key TEXT NOT NULL UNIQUE,
  server_acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sync_mutations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sync mutations"
  ON public.sync_mutations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
