import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

          <Card>
            <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using BookHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials on BookHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Account</h2>
                <p className="text-muted-foreground">
                  To access certain features of our website, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Product Information</h2>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Prices are subject to change without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Order Acceptance</h2>
                <p className="text-muted-foreground">
                  Your receipt of an electronic order confirmation does not signify our acceptance of your order. We reserve the right to accept or decline your order for any reason at any time after receipt of your order.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  BookHub shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Contact Information</h2>
                <p className="text-muted-foreground">
                  Questions about the Terms of Service should be sent to us at legal@bookhub.com.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
