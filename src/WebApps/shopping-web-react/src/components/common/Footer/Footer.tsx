import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Send,
} from 'lucide-react';
import './Footer.css';
import { toast } from '../../ui/Toast/Toast';
import { Button } from '../../ui';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/products' },
      { label: 'Featured', path: '/products?featured=true' },
      { label: 'New Arrivals', path: '/products?sort=newest' },
      { label: 'Best Sellers', path: '/products?sort=popular' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
      { label: 'Blog', path: '/blog' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Shipping Info', path: '/shipping' },
      { label: 'Returns', path: '/returns' },
      { label: 'Track Order', path: '/track' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Accessibility', path: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: Github, label: 'GitHub', url: 'https://github.com' },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Subscribe to our newsletter</h3>
              <p className="newsletter-description">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <Mail className="newsletter-icon" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                rightIcon={<Send />}
                isLoading={isSubmitting}
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="footer-logo-icon">
                  <ShoppingCart size={24} />
                </div>
                <span className="footer-logo-text">ShopHub</span>
              </Link>
              <p className="footer-brand-description">
                Your trusted destination for quality products and exceptional service.
                Shop with confidence.
              </p>
              
              {/* Contact Info */}
              <div className="footer-contact">
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>123 Commerce St, New York, NY 10001</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>support@shophub.com</span>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="footer-links">
              <h4 className="footer-links-title">Shop</h4>
              <ul className="footer-links-list">
                {footerLinks.shop.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-links">
              <h4 className="footer-links-title">Company</h4>
              <ul className="footer-links-list">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-links">
              <h4 className="footer-links-title">Support</h4>
              <ul className="footer-links-list">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="footer-links">
              <h4 className="footer-links-title">Legal</h4>
              <ul className="footer-links-list">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} ShopHub. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="footer-social">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="footer-payment">
              <span className="payment-text">We accept</span>
              <div className="payment-icons">
                <div className="payment-icon">💳</div>
                <div className="payment-icon">💰</div>
                <div className="payment-icon">🏦</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
