
-- Update has_role function to work with new enum value
-- (it already works generically, no change needed)

-- KG admins can view kindergarten students
CREATE POLICY "KG admins can view kindergarten students"
ON public.students
FOR SELECT
TO authenticated
USING (
  kindergarten_id = (SELECT kindergarten_id FROM public.profiles WHERE id = auth.uid())
  AND public.has_role(auth.uid(), 'kg_admin')
);

-- KG admins can view kindergarten surveys
CREATE POLICY "KG admins can view kindergarten surveys"
ON public.surveys
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'kg_admin')
  AND student_id IN (
    SELECT id FROM public.students 
    WHERE kindergarten_id = (SELECT kindergarten_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- KG admins can view kindergarten attendance
CREATE POLICY "KG admins can view kindergarten attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'kg_admin')
  AND student_id IN (
    SELECT id FROM public.students 
    WHERE kindergarten_id = (SELECT kindergarten_id FROM public.profiles WHERE id = auth.uid())
  )
);

-- KG admins can view kindergarten profiles
CREATE POLICY "KG admins can view kindergarten profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'kg_admin')
  AND kindergarten_id = (SELECT kindergarten_id FROM public.profiles WHERE id = auth.uid())
);
