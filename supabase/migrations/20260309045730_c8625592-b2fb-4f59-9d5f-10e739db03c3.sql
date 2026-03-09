
-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Create kindergartens table
CREATE TABLE public.kindergartens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;

-- 6. Create invitation_codes table
CREATE TABLE public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  kindergarten_id UUID REFERENCES public.kindergartens(id) ON DELETE CASCADE NOT NULL,
  created_by UUID NOT NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- 7. Add kindergarten_id to profiles and students FIRST
ALTER TABLE public.profiles ADD COLUMN kindergarten_id UUID REFERENCES public.kindergartens(id) ON DELETE SET NULL;
ALTER TABLE public.students ADD COLUMN kindergarten_id UUID REFERENCES public.kindergartens(id) ON DELETE SET NULL;

-- 8. NOW add policies that reference kindergarten_id
CREATE POLICY "Admins can manage kindergartens" ON public.kindergartens
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view own kindergarten" ON public.kindergartens
  FOR SELECT TO authenticated
  USING (id = (SELECT kindergarten_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage invitation codes" ON public.invitation_codes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 9. Function to redeem invite code
CREATE OR REPLACE FUNCTION public.redeem_invite_code(_code TEXT, _user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _kindergarten_id UUID;
BEGIN
  SELECT kindergarten_id INTO _kindergarten_id
  FROM public.invitation_codes
  WHERE code = _code AND is_used = false;

  IF _kindergarten_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or already used invitation code';
  END IF;

  UPDATE public.invitation_codes SET is_used = true, used_by = _user_id WHERE code = _code;
  UPDATE public.profiles SET kindergarten_id = _kindergarten_id WHERE id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'teacher') ON CONFLICT DO NOTHING;

  RETURN _kindergarten_id;
END;
$$;
