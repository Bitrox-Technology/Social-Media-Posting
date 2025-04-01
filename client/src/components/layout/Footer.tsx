import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-yellow-500 py-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <span className="text-sm">© 2025 Bitrox SocialAI. All rights reserved.</span>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-yellow-500 hover:text-yellow-400 text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-yellow-500 hover:text-yellow-400 text-sm">
            Terms of Service
          </a>
          <a href="#" className="text-yellow-500 hover:text-yellow-400 text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;