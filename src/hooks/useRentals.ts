import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const API_URL = "http://localhost:5000/api/rentals";

interface Rental {
  id: string;
  userId: string;
  bookId: string;
  planName: string;
  durationInDays: number;
  price: number;
  startsAt: string;
  expiresAt: string;
  status: string;
}

export const useUserRentals = () => {
  const { user, getToken } = useAuth();

  return useQuery({
    queryKey: ["rentals"],
    queryFn: async (): Promise<Rental[]> => {
      const token = await getToken();

      const response = await fetch(`${API_URL}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rentals");

      return response.json();
    },
    enabled: !!user,
  });
};

export const useActiveRental = (bookId: string) => {
  const { user, getToken } = useAuth();

  return useQuery({
    queryKey: ["rental", bookId],
    queryFn: async (): Promise<Rental | null> => {
      const token = await getToken();

      const response = await fetch(`${API_URL}/check/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      return response.json();
    },
    enabled: !!user && !!bookId,
  });
};

export const useRentBook = () => {
  const { user, getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      durationInDays,
      price,
      planName,
    }: {
      bookId: string;
      durationInDays: number;
      price: number;
      planName: string;
    }) => {
      if (!user) throw new Error("Please log in");

      const token = await getToken();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          durationInDays,
          price,
          planName,
        }),
      });

      if (!response.ok) {
        throw new Error("Rental failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      toast({
        title: "Book rented!",
        description: "You can now read this book.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rental failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
