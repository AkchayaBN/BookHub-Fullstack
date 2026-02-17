import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">BookHub</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your trusted destination for books that inspire, educate, and entertain. 
              Discover your next favorite read with us.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Home</Link></li>
              <li><Link to="/books" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Books</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Categories</Link></li>
              <li><Link to="/bestsellers" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Bestsellers</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors text-sm">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/my-account" className="text-muted-foreground hover:text-foreground transition-colors text-sm">My Account</Link></li>
              <li><Link to="/order-tracking" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Order Tracking</Link></li>
              <li><Link to="/shipping-info" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Shipping Info</Link></li>
              <li><Link to="/returns-refunds" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Returns & Refunds</Link></li>
              <li><Link to="/faqs" className="text-muted-foreground hover:text-foreground transition-colors text-sm">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Book Street, Literary Lane, Reading City, RC 12345
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">hello@bookhub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} BookHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
