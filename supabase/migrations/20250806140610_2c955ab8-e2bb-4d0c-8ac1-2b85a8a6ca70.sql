-- Fix the profiles table to handle upserts properly by adding ON CONFLICT handling
-- Also add a trigger to handle new user profile creation

-- First, let's make sure we have the handle_new_user trigger set up properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username')
  ON CONFLICT (user_id) DO UPDATE SET
    username = EXCLUDED.username,
    updated_at = now();
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();