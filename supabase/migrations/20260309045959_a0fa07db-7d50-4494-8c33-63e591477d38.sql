
-- Allow anyone to check if a code exists (for signup validation) - only SELECT, limited info
CREATE POLICY "Anyone can validate codes" ON public.invitation_codes
  FOR SELECT TO anon, authenticated
  USING (true);
