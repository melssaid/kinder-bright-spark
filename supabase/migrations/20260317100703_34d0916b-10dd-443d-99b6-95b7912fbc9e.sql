-- Create a SECURITY DEFINER function to get user's kindergarten_id without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_kindergarten_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT kindergarten_id FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- Fix KG admins can view kindergarten profiles (self-referencing profiles causes recursion)
DROP POLICY IF EXISTS "KG admins can view kindergarten profiles" ON public.profiles;
CREATE POLICY "KG admins can view kindergarten profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'kg_admin'::app_role)
    AND kindergarten_id = get_user_kindergarten_id(auth.uid())
  );

-- Fix KG admins can view kindergarten students
DROP POLICY IF EXISTS "KG admins can view kindergarten students" ON public.students;
CREATE POLICY "KG admins can view kindergarten students" ON public.students
  FOR SELECT TO authenticated
  USING (
    kindergarten_id = get_user_kindergarten_id(auth.uid())
    AND has_role(auth.uid(), 'kg_admin'::app_role)
  );

-- Fix KG admins can view kindergarten attendance
DROP POLICY IF EXISTS "KG admins can view kindergarten attendance" ON public.attendance;
CREATE POLICY "KG admins can view kindergarten attendance" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'kg_admin'::app_role)
    AND student_id IN (
      SELECT id FROM public.students
      WHERE kindergarten_id = get_user_kindergarten_id(auth.uid())
    )
  );

-- Fix KG admins can view kindergarten surveys
DROP POLICY IF EXISTS "KG admins can view kindergarten surveys" ON public.surveys;
CREATE POLICY "KG admins can view kindergarten surveys" ON public.surveys
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'kg_admin'::app_role)
    AND student_id IN (
      SELECT id FROM public.students
      WHERE kindergarten_id = get_user_kindergarten_id(auth.uid())
    )
  );

-- Fix Teachers can view own kindergarten
DROP POLICY IF EXISTS "Teachers can view own kindergarten" ON public.kindergartens;
CREATE POLICY "Teachers can view own kindergarten" ON public.kindergartens
  FOR SELECT TO authenticated
  USING (id = get_user_kindergarten_id(auth.uid()));

-- Admin full access to profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin full access to students
DROP POLICY IF EXISTS "Admins can manage all students" ON public.students;
CREATE POLICY "Admins can manage all students" ON public.students
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));