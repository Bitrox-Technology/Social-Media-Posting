import React from 'react';
import { Mail } from 'lucide-react';
import cn from 'classnames';

interface CookiePolicyProps {
  content?: {
    introduction?: string;
    whatAreCookies?: string;
    typesOfCookies?: string;
    thirdPartyCookies?: string;
    userChoices?: string;
  };
  contactEmail?: string;
  className?: string;
}

export const CookiePolicy: React.FC<CookiePolicyProps> = ({
  content = {
    introduction:
      'This Cookie Policy explains how [Your App Name] uses cookies and similar technologies to enhance your experience on our content creation platform. Last updated: May 28, 2025.',
    whatAreCookies:
      'Cookies are small text files stored on your device when you visit our app. They help us improve functionality, track usage, and provide personalized experiences.',
    typesOfCookies:
      'We use the following cookies: (1) Essential Cookies for login and session management (e.g., authentication cookies, 1-year duration); (2) Analytics Cookies to track usage (e.g., Google Analytics _ga cookie, 2-year duration); (3) Functional Cookies to remember your preferences (e.g., theme settings, 6-month duration).',
    thirdPartyCookies:
      'We use cookies from third parties like Google Analytics for usage tracking and Cloudflare for security. These cookies help us understand how users interact with our platform and ensure a secure experience.',
    userChoices:
      'You can manage cookies through our consent banner, which appears on your first visit, or via your browser settings. Disabling essential cookies may affect app functionality. Learn more about managing cookies in your browser’s help section.',
  },
  contactEmail = 'privacy@yourapp.com',
  className,
}) => {
  return (
    <div className={cn('py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300', className)}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cookie Policy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Understand how we use cookies to improve your experience. Last updated: May 28, 2025.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Introduction
            </h3>
            <p>{content.introduction}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              What Are Cookies?
            </h3>
            <p>{content.whatAreCookies}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Types of Cookies We Use
            </h3>
            <p>{content.typesOfCookies}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Third-Party Cookies
            </h3>
            <p>{content.thirdPartyCookies}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your Choices
            </h3>
            <p>{content.userChoices}</p>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Have questions about our cookie usage? Get in touch!
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Mail className="w-5 h-5 mr-2" />
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};