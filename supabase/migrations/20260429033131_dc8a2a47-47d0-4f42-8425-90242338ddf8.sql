-- Tickets table: one row per individual ticket (so each gets a unique QR)
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_reference TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  amount_paid INTEGER NOT NULL, -- in kobo (NGN smallest unit)
  quantity INTEGER NOT NULL DEFAULT 1, -- total tickets in this purchase
  ticket_index INTEGER NOT NULL DEFAULT 1, -- 1 of N
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  edition TEXT NOT NULL DEFAULT 'Otown Party 11.0 - Glow in the 90s',
  qr_signature TEXT NOT NULL, -- HMAC signature for tamper protection
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  used_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tickets_reference ON public.tickets(payment_reference);
CREATE INDEX idx_tickets_email ON public.tickets(buyer_email);

-- Payment intents: track payments before tickets are claimed
CREATE TABLE public.payment_intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  ticket_type TEXT NOT NULL,
  unit_price INTEGER NOT NULL, -- kobo
  quantity INTEGER NOT NULL,
  total_amount INTEGER NOT NULL, -- kobo
  status TEXT NOT NULL DEFAULT 'pending', -- pending | verified | claimed | failed
  buyer_name TEXT,
  buyer_email TEXT,
  verified_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_intents_status ON public.payment_intents(status);

-- Admin/scanner role
CREATE TYPE public.app_role AS ENUM ('admin', 'scanner');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Tickets: only admins/scanners can read; writes only via edge functions (service role bypasses RLS)
CREATE POLICY "Admins and scanners can view tickets"
ON public.tickets FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'scanner'));

CREATE POLICY "Admins and scanners can mark tickets used"
ON public.tickets FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'scanner'));

-- Payment intents: only admins can read (edge functions use service role)
CREATE POLICY "Admins can view payment intents"
ON public.payment_intents FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins manage
CREATE POLICY "Admins can view roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);