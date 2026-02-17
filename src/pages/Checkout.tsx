import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, Check, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/currency';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 99 : shippingMethod === 'overnight' ? 199 : 0;
  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; // GST 18%
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);

    const orderId = `BH-${Date.now().toString(36).toUpperCase()}`;
    
    clearCart();
    
    toast({
      title: "Order Placed Successfully!",
      description: `Your order #${orderId} has been confirmed.`,
    });

    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some books before checking out</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/books">Browse Books</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[
              { num: 1, label: 'Shipping', icon: MapPin },
              { num: 2, label: 'Delivery', icon: Truck },
              { num: 3, label: 'Payment', icon: CreditCard },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.num
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm mt-2">{s.label}</span>
                </div>
                {i < 2 && (
                  <div
                    className={`w-24 h-1 mx-2 rounded ${
                      step > s.num ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Address */}
                {step === 1 && (
                  <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                    <h2 className="text-xl font-display font-bold mb-4">Shipping Address</h2>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required placeholder="Rahul" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required placeholder="Sharma" className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required placeholder="rahul@example.com" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" required placeholder="+91 98765 43210" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" required placeholder="123 MG Road" className="mt-1" />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required placeholder="Mumbai" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" required placeholder="Maharashtra" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="zip">PIN Code</Label>
                        <Input id="zip" required placeholder="400001" className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Delivery Method */}
                {step === 2 && (
                  <div className="bg-card rounded-lg border border-border p-6">
                    <h2 className="text-xl font-display font-bold mb-4">Delivery Method</h2>
                    
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      {[
                        { id: 'standard', label: 'Standard Shipping', desc: '5-7 business days', price: 'Free' },
                        { id: 'express', label: 'Express Shipping', desc: '2-3 business days', price: '₹99' },
                        { id: 'overnight', label: 'Overnight Shipping', desc: 'Next business day', price: '₹199' },
                      ].map((method) => (
                        <Label
                          key={method.id}
                          htmlFor={method.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div>
                              <p className="font-medium">{method.label}</p>
                              <p className="text-sm text-muted-foreground">{method.desc}</p>
                            </div>
                          </div>
                          <span className="font-semibold">{method.price}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                    <h2 className="text-xl font-display font-bold mb-4">Payment Details</h2>
                    
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" required placeholder="Rahul Sharma" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        required 
                        placeholder="1234 5678 9012 3456" 
                        className="mt-1"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" required placeholder="MM/YY" className="mt-1" maxLength={5} />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" required placeholder="123" className="mt-1" maxLength={4} />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                      This is a demo checkout. No real payment will be processed.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : step === 3 ? `Pay ${formatPrice(total)}` : 'Continue'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-xl font-display font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map(({ book, quantity }) => (
                    <div key={book.id} className="flex gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(book.price * quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
