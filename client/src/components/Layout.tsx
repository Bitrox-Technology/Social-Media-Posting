import React from 'react';
import { BrainCog } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black border-b border-yellow-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCog className="w-8 h-8 text-yellow-500" />
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-white">Bitrox</span>
                <span className="text-xl font-bold text-yellow-500 ml-1">SocialAI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}