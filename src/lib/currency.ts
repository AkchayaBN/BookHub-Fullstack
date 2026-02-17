// Format price in Indian Rupee format
export const formatPrice = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Rental pricing in INR
export const RENTAL_PLANS = [
  { id: '1_month' as const, label: '1 Month', price: 99, description: '30 days access' },
  { id: '6_months' as const, label: '6 Months', price: 399, description: '180 days access' },
  { id: '1_year' as const, label: '1 Year', price: 599, description: '365 days access', popular: true },
] as const;

export type RentalDuration = typeof RENTAL_PLANS[number]['id'];
