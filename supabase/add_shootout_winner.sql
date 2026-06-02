ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS shootout_winner text
  CHECK (shootout_winner IN ('home','away'));
