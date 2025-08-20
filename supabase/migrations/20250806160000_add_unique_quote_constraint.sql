-- Migration: Add unique constraint for duplicate quote prevention

-- Add unique constraint to prevent duplicate quotes
ALTER TABLE public.quotes
ADD CONSTRAINT unique_quote_constraint UNIQUE (user_id, content);

-- Create index for better performance
CREATE INDEX idx_quotes_user_content ON public.quotes (user_id, content);
