CREATE POLICY "Users can delete their own pending orders"
ON public.orders
FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');