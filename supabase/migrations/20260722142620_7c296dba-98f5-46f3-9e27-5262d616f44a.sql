ALTER TABLE public.payment_intents ALTER COLUMN edition SET DEFAULT 'Otown Party 13.0 - Faaji Extra';
ALTER TABLE public.tickets ALTER COLUMN edition SET DEFAULT 'Otown Party 13.0 - Faaji Extra';
ALTER TABLE public.vendor_applications ALTER COLUMN edition SET DEFAULT 'Otown Party 13.0 - Faaji Extra';
ALTER TABLE public.ticket_purchases ALTER COLUMN edition SET DEFAULT 'Otown Party 13.0 - Faaji Extra';

-- Backfill: any rows created on/after Jul 20, 2026 belong to edition 13.0 (Iseyin ended June 2026)
UPDATE public.payment_intents SET edition = 'Otown Party 13.0 - Faaji Extra'
  WHERE created_at >= '2026-07-15' AND edition = 'Otown Party 12.0 - Iseyin Edition';
UPDATE public.tickets SET edition = 'Otown Party 13.0 - Faaji Extra'
  WHERE created_at >= '2026-07-15' AND edition = 'Otown Party 12.0 - Iseyin Edition';
UPDATE public.vendor_applications SET edition = 'Otown Party 13.0 - Faaji Extra'
  WHERE created_at >= '2026-07-15' AND edition = 'Otown Party 12.0 - Iseyin Edition';
UPDATE public.ticket_purchases SET edition = 'Otown Party 13.0 - Faaji Extra'
  WHERE created_at >= '2026-07-15' AND edition = 'Otown Party 12.0 - Iseyin Edition';