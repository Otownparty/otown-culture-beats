
-- 1) Add edition columns with default = current edition
ALTER TABLE public.ticket_purchases
  ADD COLUMN IF NOT EXISTS edition text NOT NULL DEFAULT 'Otown Party 12.0 - Iseyin Edition';

ALTER TABLE public.payment_intents
  ADD COLUMN IF NOT EXISTS edition text NOT NULL DEFAULT 'Otown Party 12.0 - Iseyin Edition';

ALTER TABLE public.vendor_applications
  ADD COLUMN IF NOT EXISTS edition text NOT NULL DEFAULT 'Otown Party 12.0 - Iseyin Edition';

-- 2) Backfill ticket_purchases from tickets (by payment_reference)
UPDATE public.ticket_purchases tp
SET edition = t.edition
FROM public.tickets t
WHERE t.payment_reference = tp.reference
  AND t.edition IS NOT NULL
  AND t.edition <> '';

-- Anything else with no matching ticket → assume previous edition
UPDATE public.ticket_purchases
SET edition = 'Otown Party 11.0 - Glow in the 90s'
WHERE edition = 'Otown Party 12.0 - Iseyin Edition'
  AND reference NOT IN (
    SELECT payment_reference FROM public.tickets
    WHERE edition = 'Otown Party 12.0 - Iseyin Edition'
  )
  AND created_at < '2026-06-17';

-- 3) Backfill payment_intents the same way
UPDATE public.payment_intents pi
SET edition = t.edition
FROM public.tickets t
WHERE t.payment_reference = pi.reference
  AND t.edition IS NOT NULL
  AND t.edition <> '';

UPDATE public.payment_intents
SET edition = 'Otown Party 11.0 - Glow in the 90s'
WHERE edition = 'Otown Party 12.0 - Iseyin Edition'
  AND reference NOT IN (
    SELECT payment_reference FROM public.tickets
    WHERE edition = 'Otown Party 12.0 - Iseyin Edition'
  )
  AND created_at < '2026-06-17';

-- 4) Backfill vendor_applications by date cutoff
UPDATE public.vendor_applications
SET edition = 'Otown Party 11.0 - Glow in the 90s'
WHERE created_at < '2026-06-01';
