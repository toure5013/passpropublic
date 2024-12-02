import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-6 sm:mt-8 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <Logo className="h-6" />
          
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <Link to="/aide" className="hover:text-brand-red transition-colors">Aide</Link>
            <Link to="/contact" className="hover:text-brand-red transition-colors">Contact</Link>
            <Link to="/conditions" className="hover:text-brand-red transition-colors">CGV</Link>
            <Link to="/confidentialite" className="hover:text-brand-red transition-colors">Confidentialité</Link>
          </nav>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="tel:+2250759949494" className="hover:text-brand-red transition-colors">
              <Phone className="h-5 w-5" />
            </a>
            <a href="mailto:contact@passpro.app" className="hover:text-brand-red transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://facebook.com/passpro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/passpro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/passpro" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <p className="text-xs text-center text-gray-500">
            © 2024 PassPro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}