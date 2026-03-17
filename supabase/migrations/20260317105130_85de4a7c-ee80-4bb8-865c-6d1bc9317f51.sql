
-- Fix parents INSERT policy: allow any authenticated user (admins included)
DROP POLICY IF EXISTS "Teachers can insert parents" ON public.parents;
CREATE POLICY "Authenticated users can insert parents"
  ON public.parents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add admin access to parents
DROP POLICY IF EXISTS "Admins can manage parents" ON public.parents;
CREATE POLICY "Admins can manage parents"
  ON public.parents FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin access to student_guardians
DROP POLICY IF EXISTS "Admins can manage guardians" ON public.student_guardians;
CREATE POLICY "Admins can manage guardians"
  ON public.student_guardians FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add kg_admin read access to parents (via their kindergarten students)
DROP POLICY IF EXISTS "KG admins can view parents" ON public.parents;
CREATE POLICY "KG admins can view parents"
  ON public.parents FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'kg_admin'::app_role) AND
    id IN (
      SELECT sg.parent_id FROM student_guardians sg
      JOIN students s ON s.id = sg.student_id
      WHERE s.kindergarten_id = get_user_kindergarten_id(auth.uid())
    )
  );

-- Add kg_admin read access to student_guardians
DROP POLICY IF EXISTS "KG admins can view guardians" ON public.student_guardians;
CREATE POLICY "KG admins can view guardians"
  ON public.student_guardians FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'kg_admin'::app_role) AND
    student_id IN (
      SELECT id FROM students
      WHERE kindergarten_id = get_user_kindergarten_id(auth.uid())
    )
  );
