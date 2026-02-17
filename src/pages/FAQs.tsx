import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQs: React.FC = () => {
  const faqCategories = [
    {
      title: 'Orders & Shipping',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day.',
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free standard shipping on all orders over $35.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order in your account dashboard.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by location.',
        },
      ],
    },
    {
      title: 'Payment & Pricing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.',
        },
        {
          question: 'Do you offer price matching?',
          answer: 'We strive to offer competitive prices. If you find a lower price elsewhere, contact us and we\'ll do our best to match it.',
        },
      ],
    },
    {
      title: 'Account & Membership',
      faqs: [
        {
          question: 'Do I need an account to place an order?',
          answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save your wishlist, and checkout faster.',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password.',
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion by contacting our customer service team. Please note this action is permanent.',
        },
      ],
    },
    {
      title: 'Products & Availability',
      faqs: [
        {
          question: 'How do I know if a book is in stock?',
          answer: 'Stock availability is shown on each product page. If an item is out of stock, you can sign up to be notified when it\'s available.',
        },
        {
          question: 'Do you sell used books?',
          answer: 'Currently, we only sell new books. All our books are guaranteed to be in perfect condition.',
        },
        {
          question: 'Can I pre-order upcoming releases?',
          answer: 'Yes! Look for the "Pre-Order" button on upcoming titles. You\'ll be charged when the book ships.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about orders, shipping, payments, and more.
          </p>

          <div className="space-y-8">
            {faqCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.title}-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
