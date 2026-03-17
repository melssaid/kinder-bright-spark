
-- Admin can manage all surveys
DROP POLICY IF EXISTS "Admins can manage all surveys" ON public.surveys;
CREATE POLICY "Admins can manage all surveys"
  ON public.surveys FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage all attendance
DROP POLICY IF EXISTS "Admins can manage all attendance" ON public.attendance;
CREATE POLICY "Admins can manage all attendance"
  ON public.attendance FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage all parent_reports
DROP POLICY IF EXISTS "Admins can manage all parent_reports" ON public.parent_reports;
CREATE POLICY "Admins can manage all parent_reports"
  ON public.parent_reports FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage all message_deliveries
DROP POLICY IF EXISTS "Admins can manage all deliveries" ON public.message_deliveries;
CREATE POLICY "Admins can manage all deliveries"
  ON public.message_deliveries FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage all student_guardians (already exists but let's be sure)
DROP POLICY IF EXISTS "Admins can manage guardians" ON public.student_guardians;
CREATE POLICY "Admins can manage guardians"
  ON public.student_guardians FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
