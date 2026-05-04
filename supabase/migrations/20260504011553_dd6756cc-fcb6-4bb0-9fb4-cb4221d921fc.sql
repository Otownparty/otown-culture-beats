-- Track vendor QR scans
ALTER TABLE public.vendor_applications
  ADD COLUMN IF NOT EXISTS scanned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scanned_at timestamptz,
  ADD COLUMN IF NOT EXISTS scanned_by text;

-- Allow staff (admin/scanner) to update vendor scan status
DROP POLICY IF EXISTS "Staff can update vendor scan status" ON public.vendor_applications;
CREATE POLICY "Staff can update vendor scan status"
ON public.vendor_applications
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'scanner'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'scanner'::app_role));

-- Allow admins to clear records
DROP POLICY IF EXISTS "Admins can delete ticket purchases" ON public.ticket_purchases;
CREATE POLICY "Admins can delete ticket purchases"
ON public.ticket_purchases FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;
CREATE POLICY "Admins can delete tickets"
ON public.tickets FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete vendor applications" ON public.vendor_applications;
CREATE POLICY "Admins can delete vendor applications"
ON public.vendor_applications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete payment intents" ON public.payment_intents;
CREATE POLICY "Admins can delete payment intents"
ON public.payment_intents FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));