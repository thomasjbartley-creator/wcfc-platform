-- ============================================================
-- WCFC Referral Points Trigger
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- When a user upgrades from 'free' to any paid tier, this trigger:
--   1. Looks up who referred them (via their referred_by referral code)
--   2. Adds +5 to the referrer's points_total and referral_points_earned
--   3. Increments the referrer's referral_count by 1
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_referral_conversion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only fire when tier changes FROM 'free' TO something non-free
  IF OLD.tier = 'free' AND NEW.tier <> 'free' THEN
    -- Only award points if this user was referred by someone
    IF NEW.referred_by IS NOT NULL THEN
      UPDATE public.profiles
      SET
        referral_count          = referral_count + 1,
        referral_points_earned  = referral_points_earned + 5,
        points_total            = points_total + 5
      WHERE referral_code = NEW.referred_by;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists, then recreate it
DROP TRIGGER IF EXISTS on_tier_upgrade ON public.profiles;

CREATE TRIGGER on_tier_upgrade
  AFTER UPDATE OF tier ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_conversion();
