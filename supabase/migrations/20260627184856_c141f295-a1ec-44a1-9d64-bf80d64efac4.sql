ALTER TABLE public.payment_intents
  ADD COLUMN IF NOT EXISTS buyer_phone text,
  ADD COLUMN IF NOT EXISTS attendee_type text;