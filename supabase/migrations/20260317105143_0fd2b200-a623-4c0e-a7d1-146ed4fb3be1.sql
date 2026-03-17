
-- Tighten parents INSERT: only allow if user is admin or owns at least one student
DROP POLICY IF EXISTS "Authenticated users can insert parents" ON public.parents;
CREATE POLICY "Teachers and admins can insert parents"
  ON public.parents FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    EXISTS (SELECT 1 FROM students WHERE teacher_id = auth.uid())
  );
