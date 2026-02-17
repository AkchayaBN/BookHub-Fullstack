import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RotateCcw, Clock, CreditCard, AlertCircle } from 'lucide-react';

const ReturnsRefunds: React.FC = () => {
  const policies = [
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Return any book within 30 days of delivery for a full refund.',
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Refunds are processed within 5-7 business days of receiving the return.',
    },
    {
      icon: CreditCard,
      title: 'Original Payment',
      description: 'Refunds are credited to your original payment method.',
    },
    {
      icon: AlertCircle,
      title: 'Condition Required',
      description: 'Books must be in original condition with no damage or markings.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Returns & Refunds</h1>
          <p className="text-muted-foreground mb-8">
            We want you to be completely satisfied with your purchase.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {policies.map((policy) => (
              <Card key={policy.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <policy.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{policy.title}</h3>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How to Return an Item</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>Log in to your account and go to Order History</li>
                <li>Select the order containing the item you wish to return</li>
                <li>Click "Request Return" and follow the prompts</li>
                <li>Print the prepaid shipping label provided</li>
                <li>Pack the book securely and attach the label</li>
                <li>Drop off the package at any authorized shipping location</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Can I return eBooks or digital products?</AccordionTrigger>
                  <AccordionContent>
                    Digital products including eBooks are non-refundable once downloaded. However, if you experience technical issues, please contact our support team.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What if my book arrived damaged?</AccordionTrigger>
                  <AccordionContent>
                    If your book arrives damaged, please contact us within 48 hours with photos of the damage. We'll send a replacement at no additional cost.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How long does the refund take?</AccordionTrigger>
                  <AccordionContent>
                    Once we receive your return, refunds are processed within 5-7 business days. It may take an additional 3-5 days for the refund to appear on your statement.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I exchange a book instead of returning it?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You can exchange a book for a different title. Simply select "Exchange" instead of "Return" when initiating your request.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsRefunds;
