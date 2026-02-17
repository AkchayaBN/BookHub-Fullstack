import React, { useState } from 'react';
import { BookOpen, Check, CreditCard, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/types/book';
import { RENTAL_PLANS, RentalDuration, formatPrice } from '@/lib/currency';
import { useRentBook } from '@/hooks/useRentals';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface RentalModalProps {
  book: Book;
  open: boolean;
  onClose: () => void;
}

const RentalModal: React.FC<RentalModalProps> = ({ book, open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<RentalDuration>('1_year');
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [isProcessing, setIsProcessing] = useState(false);
  const rentBook = useRentBook();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plan = RENTAL_PLANS.find(p => p.id === selectedPlan)!;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      onClose();
      return;
    }

    setIsProcessing(true);
    // Mock payment delay
    await new Promise(r => setTimeout(r, 2000));

    await rentBook.mutateAsync({ bookId: book.id, duration: selectedPlan });
    setIsProcessing(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('plan');
    setSelectedPlan('1_year');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {step === 'success' ? 'Rental Confirmed!' : 'Rent This Book'}
          </DialogTitle>
        </DialogHeader>

        {step === 'success' ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h3 className="font-display font-bold text-lg">{book.title}</h3>
            <p className="text-muted-foreground">
              You have rented this book for {plan.label}. Enjoy reading!
            </p>
            <Button onClick={handleClose} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Done
            </Button>
          </div>
        ) : step === 'payment' ? (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 flex gap-3">
              <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded" />
              <div>
                <p className="font-medium text-sm">{book.title}</p>
                <p className="text-xs text-muted-foreground">{plan.label} rental</p>
                <p className="font-bold text-primary mt-1">{formatPrice(plan.price)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="r-cardName">Name on Card</Label>
              <Input id="r-cardName" required placeholder="Name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="r-cardNumber">Card Number</Label>
              <Input id="r-cardNumber" required placeholder="1234 5678 9012 3456" className="mt-1" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="r-expiry">Expiry</Label>
                <Input id="r-expiry" required placeholder="MM/YY" className="mt-1" maxLength={5} />
              </div>
              <div>
                <Label htmlFor="r-cvv">CVV</Label>
                <Input id="r-cvv" required placeholder="123" className="mt-1" maxLength={4} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This is a demo. No real payment will be processed.
            </p>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep('plan')} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={isProcessing} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                {isProcessing ? 'Processing...' : `Pay ${formatPrice(plan.price)}`}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3 items-center">
              <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded-md shadow-sm" />
              <div>
                <h3 className="font-display font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>

            <Separator />

            <p className="text-sm font-medium">Choose a rental plan:</p>

            <div className="space-y-3">
              {RENTAL_PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left",
                    selectedPlan === p.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.label}</span>
                      {'popular' in p && p.popular && (
                        <Badge className="bg-accent text-accent-foreground text-xs">Best Value</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{p.description}</span>
                  </div>
                  <span className="text-lg font-bold text-primary">{formatPrice(p.price)}</span>
                </button>
              ))}
            </div>

            <Button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  handleClose();
                  return;
                }
                setStep('payment');
              }}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue to Payment — {formatPrice(plan.price)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RentalModal;
