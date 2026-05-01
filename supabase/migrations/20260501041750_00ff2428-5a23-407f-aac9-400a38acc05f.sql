
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  brand_name TEXT NOT NULL,
  brand_description TEXT,
  instagram TEXT,
  city TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  previous_vendor TEXT,
  business_category TEXT NOT NULL,
  sub_category TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create vendor application"
  ON public.vendor_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update vendor application"
  ON public.vendor_applications FOR UPDATE USING (true);

CREATE POLICY "Staff can read vendor applications"
  ON public.vendor_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'scanner'));

CREATE TABLE IF NOT EXISTS public.ticket_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  ticket_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create ticket purchase"
  ON public.ticket_purchases FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ticket purchase"
  ON public.ticket_purchases FOR UPDATE USING (true);

CREATE POLICY "Staff can read ticket purchases"
  ON public.ticket_purchases FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'scanner'));

CREATE TRIGGER update_vendor_applications_updated_at
  BEFORE UPDATE ON public.vendor_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_purchases_updated_at
  BEFORE UPDATE ON public.ticket_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
