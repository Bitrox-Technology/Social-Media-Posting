import React from 'react';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-secondary-500 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-400 mb-4">About Us</h3>
            <p className="text-gray-400 mb-4">
              Bitrox SocialAI leverages AI to simplify and enhance your social media presence with automated content generation and optimization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-secondary-400 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-400 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-secondary-400 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-secondary-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 AI Street, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-secondary-400 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-secondary-400 mr-2" />
                <span className="text-gray-400">contact@bitroxsocial.ai</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-sm text-gray-400">© 2025 Bitrox SocialAI. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-secondary-400 hover:text-secondary-300 transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;