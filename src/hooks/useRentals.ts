import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RentalDuration, RENTAL_PLANS } from '@/lib/currency';
import { toast } from '@/hooks/use-toast';

interface Rental {
  id: string;
  user_id: string;
  book_id: string;
  duration: string;
  price: number;
  starts_at: string;
  expires_at: string;
  status: string;
  created_at: string;
}

const getDurationDays = (duration: RentalDuration): number => {
  switch (duration) {
    case '1_month': return 30;
    case '6_months': return 180;
    case '1_year': return 365;
  }
};

export const useUserRentals = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['rentals', user?.id],
    queryFn: async (): Promise<Rental[]> => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Rental[];
    },
    enabled: !!user,
  });
};

export const useActiveRental = (bookId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['rental', bookId, user?.id],
    queryFn: async (): Promise<Rental | null> => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('book_id', bookId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();
      if (error) throw error;
      return data as Rental | null;
    },
    enabled: !!user && !!bookId,
  });
};

export const useRentBook = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, duration }: { bookId: string; duration: RentalDuration }) => {
      if (!user) throw new Error('Please log in to rent books');

      const plan = RENTAL_PLANS.find(p => p.id === duration);
      if (!plan) throw new Error('Invalid rental plan');

      const startsAt = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + getDurationDays(duration));

      const { data, error } = await supabase
        .from('rentals')
        .insert({
          user_id: user.id,
          book_id: bookId,
          duration,
          price: plan.price,
          starts_at: startsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rental'] });
      toast({ title: 'Book rented!', description: 'You can now read this book online.' });
    },
    onError: (error: any) => {
      toast({ title: 'Rental failed', description: error.message, variant: 'destructive' });
    },
  });
};
