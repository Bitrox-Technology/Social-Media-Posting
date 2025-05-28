import React from 'react';
import { Mail, Phone } from 'lucide-react';
import cn from 'classnames';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs?: FAQItem[]; // Made optional to use default data
  contactEmail?: string;
  contactPhone?: string;
  className?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  faqs = [
    {
      question: 'What is this application, and what can I do with it?',
      answer:
        'Our application is an AI-powered content creation platform that helps you create engaging content for social media, blogs, and more. You can generate Social Media Posts, Blog Articles, Promotional/Sales Posts, Informative/Educational Posts, Engagement Posts, Brand Building Posts, Event-Related Posts, Customer Testimonials/Reviews, and Holidays/Festival Greetings.',
    },
    {
      question: 'How do I get started with creating content?',
      answer:
        'Sign up for a free account on our homepage, select your desired content type from the Content Type Selector, and follow the prompts to generate your content. It’s quick and easy, and you can start creating in under 2 minutes!',
    },
    {
      question: 'What types of content can I create?',
      answer:
        'You can create a wide variety of content, including Social Media Posts, Blog Articles, Promotional/Sales Posts, Informative/Educational Posts, Engagement Posts, Brand Building Posts, Event-Related Posts, Customer Testimonials/Reviews, and Holidays/Festival Greetings. Each type comes with customizable templates to suit your needs.',
    },
    {
      question: 'Is there a free plan available?',
      answer:
        'Yes, we offer a free plan with limited usage quotas, allowing you to explore our features at no cost. You can upgrade to a premium plan for higher quotas and access to advanced features. Visit our pricing page for more details.',
    },
    {
      question: 'How can I upgrade my plan?',
      answer:
        'Log in to your account, navigate to "Account Settings" > "Subscription," and select the plan that best fits your needs. Follow the payment instructions to upgrade instantly. You’ll gain immediate access to premium features.',
    },
    {
      question: 'What if I encounter issues while using the app?',
      answer:
        'If you face any issues, try refreshing the page or clearing your browser cache. If the problem persists, reach out to our support team via email at support@yourapp.com or call us at +91-XXX-XXX-XXXX. We’re available Monday to Friday, 9 AM to 6 PM IST.',
    },
    {
      question: 'Is my data secure with your application?',
      answer:
        'Yes, we prioritize your security. We use SSL/TLS encryption to protect your data and comply with global privacy standards like GDPR and CCPA as of May 2025. Your personal information is never shared with third parties without your consent.',
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer:
        'Absolutely. You can cancel your subscription anytime by going to "Account Settings" > "Subscription" and clicking "Cancel Subscription." You’ll retain access until the end of your billing cycle, and no further charges will apply.',
    },
  ],
  contactEmail = 'support@yourapp.com',
  contactPhone = '+91-XXX-XXX-XXXX',
  className,
}) => {
  return (
    <div className={cn('py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300', className)}>
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our application. Updated as of May 28, 2025.
          </p>
        </div>

        {/* FAQ Items (Accordion) */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-all duration-300"
            >
              <summary className="flex justify-between items-center p-6 cursor-pointer text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl">
                <span className="text-lg font-semibold">{faq.question}</span>
                <span className="transform transition-transform duration-300 group-open:rotate-180">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Still have questions? We’re here to help!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <a
              href={`tel:${contactPhone}`}
              className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};