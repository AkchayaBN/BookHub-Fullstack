-- Drop existing SELECT policy on profiles and replace with more secure version
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create policy that explicitly requires authentication and user_id match
CREATE POLICY "Users can view own profile data"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add DELETE policy for order_items (fixing the warning too)
CREATE POLICY "Users can delete their own order items"
ON public.order_items
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));