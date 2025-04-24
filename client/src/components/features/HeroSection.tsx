import React from 'react';
import { ArrowRight, Bot, TrendingUp, Zap, Shield } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideIn">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Transform Your <span className="text-primary-600 dark:text-primary-400">Social Media</span> with AI-Powered Content
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Effortlessly create engaging, personalized content for all your social platforms with our AI assistant. Save time, increase engagement, and grow your audience.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#features" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
                Explore Features <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#pricing" className="px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 font-medium rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center">
                View Pricing
              </a>
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-secondary-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Boost Engagement</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-secondary-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Save Time</span>
              </div>
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-secondary-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">AI-Powered</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-secondary-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Secure Platform</span>
              </div>
            </div>
          </div>
          
          <div className="relative lg:pl-12 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-300">
              <div className="p-2 bg-primary-500 text-white rounded-lg inline-block mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Generator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create engaging posts in seconds with our AI assistant.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mt-2 animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded mt-2 animate-pulse"></div>
              </div>
              <button className="w-full py-2 px-4 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg transition-colors duration-200">
                <a href='/signup'> Generate Now</a>
              </button>
            </div>
            
            <div className="absolute top-12 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform -rotate-2 hover:rotate-0 transition-all duration-300 z-10">
              <div className="p-2 bg-accent-500 text-white rounded-lg inline-block mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h3>
              <div className="space-y-3">
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-500 w-3/4 rounded-full"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-1/2 rounded-full"></div>
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-500 w-2/3 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-70">
            <div className="text-gray-400 dark:text-gray-600 font-medium">Trusted by innovative companies</div>
            <div className="text-gray-500 dark:text-gray-500 text-xl font-bold">COMPANY</div>
            <div className="text-gray-500 dark:text-gray-500 text-xl font-bold">ENTERPRISE</div>
            <div className="text-gray-500 dark:text-gray-500 text-xl font-bold">STARTUP</div>
            <div className="text-gray-500 dark:text-gray-500 text-xl font-bold">TECH CO</div>
            <div className="text-gray-500 dark:text-gray-500 text-xl font-bold">BRAND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;