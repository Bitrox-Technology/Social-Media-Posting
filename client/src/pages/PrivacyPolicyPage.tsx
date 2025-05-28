import React from 'react';
import { Mail } from 'lucide-react';
import cn from 'classnames';

interface PrivacyPolicyProps {
  content?: {
    introduction?: string;
    dataCollection?: string;
    dataUsage?: string;
    dataSharing?: string;
    userRights?: string;
    security?: string;
    retention?: string;
  };
  contactEmail?: string;
  className?: string;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  content = {
    introduction:
      'At [Your App Name], we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our content creation platform. Last updated: May 28, 2025.',
    dataCollection:
      'We collect your email, username, and payment details when you sign up or upgrade your plan. We also collect usage data (e.g., content types created, such as Social Media Posts or Blog Articles) to improve our AI models.',
    dataUsage:
      'We use your data to provide services (e.g., generate content), send account updates, and analyze usage to enhance our platform. For example, we may use analytics to improve our AI’s content generation capabilities.',
    dataSharing:
      'We share payment data with secure third-party processors (e.g., Stripe) to process transactions. We do not sell your personal information to third parties. Data may be shared as required by law.',
    userRights:
      'Under the DPDP Act (India), GDPR (EU), and CCPA (California), you have the right to access, correct, or delete your data. You can also opt-out of certain data processing activities. Email us at privacy@yourapp.com to exercise your rights.',
    security:
      'We use SSL/TLS encryption to protect your data during transmission. All data is stored on secure AWS servers with strict access controls.',
    retention:
      'We retain your data for as long as your account is active, or as required by law. Inactive accounts are deleted after 2 years of inactivity.',
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
            Privacy Policy
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn how we handle your data. Last updated: May 28, 2025.
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
              What Data We Collect
            </h3>
            <p>{content.dataCollection}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              How We Use Your Data
            </h3>
            <p>{content.dataUsage}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Data Sharing
            </h3>
            <p>{content.dataSharing}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your Rights
            </h3>
            <p>{content.userRights}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Data Security
            </h3>
            <p>{content.security}</p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Data Retention
            </h3>
            <p>{content.retention}</p>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Have questions about your privacy? Reach out to us!
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