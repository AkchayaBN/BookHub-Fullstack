import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

          <Card>
            <CardContent className="prose prose-sm max-w-none p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">What Are Cookies</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
                <p className="text-muted-foreground">We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li><strong>Essential cookies:</strong> Required for the operation of our website, including shopping cart functionality</li>
                  <li><strong>Analytical cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Targeting cookies:</strong> Record your visit to our website and the pages you visit</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Session Cookies</h3>
                    <p className="text-muted-foreground">These are temporary cookies that expire when you close your browser. We use session cookies to maintain your shopping cart.</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Persistent Cookies</h3>
                    <p className="text-muted-foreground">These cookies remain on your device until they expire or you delete them. We use persistent cookies to remember your preferences.</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Third-Party Cookies</h3>
                    <p className="text-muted-foreground">We may use third-party services that also set cookies on our website for analytics and advertising purposes.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
                <p className="text-muted-foreground">
                  Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, if you block or delete cookies, some features of our website may not function properly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about our Cookie Policy, please contact us at privacy@bookhub.com.
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

export default CookiePolicy;
