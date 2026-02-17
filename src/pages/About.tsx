import React from 'react';
import { BookOpen, Heart, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="bg-hero-gradient text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">About BookHub</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Your ultimate destination for books that inspire, educate, and entertain.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to BookHub, your ultimate online bookstore! We are dedicated to bringing you 
                a vast collection of books across all genres. Our mission is to foster a love for 
                reading by providing easy access to literary treasures, from timeless classics to 
                the latest bestsellers. Explore our shelves and find your next great read!
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: 'Vast Collection',
                  description: 'Over 10,000 titles across every genre imaginable.',
                },
                {
                  icon: Heart,
                  title: 'Curated Selection',
                  description: 'Handpicked recommendations from our literary experts.',
                },
                {
                  icon: Users,
                  title: 'Community',
                  description: 'Join 50,000+ readers who trust us for their book needs.',
                },
                {
                  icon: Award,
                  title: 'Quality Service',
                  description: 'Fast shipping, easy returns, and dedicated support.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-card shadow-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-center mb-8">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  BookHub was founded in 2020 by a group of passionate book lovers who believed 
                  that everyone deserves access to great literature. What started as a small 
                  online store has grown into a thriving community of readers.
                </p>
                <p>
                  We believe that books have the power to change lives, spark imagination, and 
                  connect people across cultures and generations. That's why we work tirelessly 
                  to curate the best selection and provide an exceptional shopping experience.
                </p>
                <p>
                  Today, we serve readers worldwide, offering everything from rare first editions 
                  to the latest releases. Our team of bibliophiles is always here to help you 
                  discover your next favorite book.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
