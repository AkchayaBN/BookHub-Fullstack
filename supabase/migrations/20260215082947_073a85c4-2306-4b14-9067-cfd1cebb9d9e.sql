
-- Create rentals table for tracking book rentals
CREATE TABLE public.rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES public.books(id),
  duration TEXT NOT NULL CHECK (duration IN ('1_month', '6_months', '1_year')),
  price NUMERIC NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Users can view their own rentals
CREATE POLICY "Users can view their own rentals"
ON public.rentals FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own rentals
CREATE POLICY "Users can create their own rentals"
ON public.rentals FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_rentals_updated_at
BEFORE UPDATE ON public.rentals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
