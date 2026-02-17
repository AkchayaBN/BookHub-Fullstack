import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Clock, Globe, Package } from 'lucide-react';

const ShippingInfo: React.FC = () => {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      time: '5-7 Business Days',
      price: 'Free on orders over $35',
      description: 'Our most economical option for non-urgent deliveries.',
    },
    {
      icon: Clock,
      title: 'Express Shipping',
      time: '2-3 Business Days',
      price: '$7.99',
      description: 'Faster delivery for when you need your books sooner.',
    },
    {
      icon: Package,
      title: 'Overnight Shipping',
      time: '1 Business Day',
      price: '$14.99',
      description: 'Get your books the very next business day.',
    },
    {
      icon: Globe,
      title: 'International Shipping',
      time: '10-21 Business Days',
      price: 'Starting at $19.99',
      description: 'We ship to over 100 countries worldwide.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Shipping Information</h1>
          <p className="text-muted-foreground mb-8">
            Learn about our shipping options and delivery times.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {shippingOptions.map((option) => (
              <Card key={option.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{option.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-primary font-semibold mb-2">{option.price}</p>
                  <p className="text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                All orders are processed within 1-2 business days. Orders placed after 2 PM EST will be processed the next business day.
              </p>
              <p>
                Once your order has shipped, you will receive a confirmation email with tracking information. You can also track your order in your account dashboard.
              </p>
              <p>
                Please note that delivery times are estimates and may vary during peak seasons or due to weather conditions.
              </p>
              <p>
                For any shipping-related questions, please contact our customer service team at shipping@bookhub.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingInfo;
