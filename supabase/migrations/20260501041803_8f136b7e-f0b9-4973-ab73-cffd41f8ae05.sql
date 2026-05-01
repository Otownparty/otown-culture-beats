
DROP POLICY IF EXISTS "Anyone can update vendor application" ON public.vendor_applications;
CREATE POLICY "Anyone can update pending vendor application"
  ON public.vendor_applications FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update ticket purchase" ON public.ticket_purchases;
CREATE POLICY "Anyone can update pending ticket purchase"
  ON public.ticket_purchases FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (true);
