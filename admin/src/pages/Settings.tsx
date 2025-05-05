import React, { useState } from 'react';
import { Save, UserPlus, Shield, Bell, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'billing'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Billing
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Admin Portal Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your admin portal preferences and settings.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="app-name" className="block text-sm font-medium text-gray-700">
                    Application Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="app-name"
                      id="app-name"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      defaultValue="Admin Panel"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <div className="mt-1">
                    <select
                      id="language"
                      name="language"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Japanese</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <div className="mt-1">
                    <select
                      id="timezone"
                      name="timezone"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>Pacific Time (US & Canada)</option>
                      <option>Mountain Time (US & Canada)</option>
                      <option>Central Time (US & Canada)</option>
                      <option>Eastern Time (US & Canada)</option>
                      <option>UTC</option>
                      <option>London</option>
                      <option>Paris</option>
                      <option>Tokyo</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <div className="mt-1">
                    <select
                      id="theme"
                      name="theme"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn-secondary mr-3">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">User Management Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how users are managed in your application.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="auto-approve"
                      name="auto-approve"
                      type="checkbox"
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="auto-approve" className="font-medium text-gray-700">
                      Auto-approve new users
                    </label>
                    <p className="text-gray-500">Automatically approve new user registrations.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email-verification"
                      name="email-verification"
                      type="checkbox"
                      checked
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email-verification" className="font-medium text-gray-700">
                      Require email verification
                    </label>
                    <p className="text-gray-500">Users must verify their email before they can log in.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="subscription-required"
                      name="subscription-required"
                      type="checkbox"
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="subscription-required" className="font-medium text-gray-700">
                      Require subscription for posting
                    </label>
                    <p className="text-gray-500">Users must have an active subscription to create posts.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="default-role" className="block text-sm font-medium text-gray-700">
                  Default User Role
                </label>
                <div className="mt-1">
                  <select
                    id="default-role"
                    name="default-role"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>User</option>
                    <option>Subscriber</option>
                    <option>Contributor</option>
                    <option>Editor</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn-secondary mr-3">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure security settings for your application.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="two-factor"
                      name="two-factor"
                      type="checkbox"
                      checked
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="two-factor" className="font-medium text-gray-700">
                      Require two-factor authentication for admins
                    </label>
                    <p className="text-gray-500">All admin users must set up 2FA to access the admin panel.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="session-timeout"
                      name="session-timeout"
                      type="checkbox"
                      checked
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="session-timeout" className="font-medium text-gray-700">
                      Enable session timeout
                    </label>
                    <p className="text-gray-500">Automatically log out users after period of inactivity.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="session-length" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="session-length"
                    id="session-length"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue="30"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="password-policy" className="block text-sm font-medium text-gray-700">
                  Password Policy
                </label>
                <div className="mt-1">
                  <select
                    id="password-policy"
                    name="password-policy"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>Standard (8+ chars, 1 uppercase, 1 number)</option>
                    <option>Strong (10+ chars, uppercase, number, special char)</option>
                    <option>Very Strong (12+ chars, uppercase, number, special char)</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn-secondary mr-3">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage when and how you receive notifications.
                </p>
              </div>

              <div className="mt-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">Admin Notifications</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-user"
                          name="new-user"
                          type="checkbox"
                          checked
                          className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-user" className="font-medium text-gray-700">
                          New user registrations
                        </label>
                        <p className="text-gray-500">Receive notifications when new users register.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-post"
                          name="new-post"
                          type="checkbox"
                          checked
                          className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-post" className="font-medium text-gray-700">
                          New post created
                        </label>
                        <p className="text-gray-500">Receive notifications when users create new posts.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-subscription"
                          name="new-subscription"
                          type="checkbox"
                          checked
                          className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-subscription" className="font-medium text-gray-700">
                          New subscriptions
                        </label>
                        <p className="text-gray-500">Receive notifications when users subscribe.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="user-request"
                          name="user-request"
                          type="checkbox"
                          checked
                          className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="user-request" className="font-medium text-gray-700">
                          User requests
                        </label>
                        <p className="text-gray-500">Receive notifications for user requests that need approval.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="mt-6">
                <label htmlFor="notification-method" className="block text-sm font-medium text-gray-700">
                  Primary Notification Method
                </label>
                <div className="mt-1">
                  <select
                    id="notification-method"
                    name="notification-method"
                    className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option>Email</option>
                    <option>In-app only</option>
                    <option>Email + In-app</option>
                    <option>SMS</option>
                    <option>All methods</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn-secondary mr-3">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Billing Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage subscription plans and payment settings.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Available Subscription Plans</h4>
                  <div className="mt-4 border border-gray-200 rounded-md divide-y divide-gray-200">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium">Free</h5>
                        <p className="text-xs text-gray-500">Limited features, no cost</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 mr-4">$0/month</p>
                        <div className="relative inline-block h-6 w-11 flex-shrink-0">
                          <input type="checkbox" checked className="sr-only peer" />
                          <span className="bg-gray-200 peer-checked:bg-purple-600 block w-11 h-6 rounded-full transition-colors duration-200"></span>
                          <span className="transform translate-x-0 peer-checked:translate-x-5 absolute left-0.5 top-0.5 bg-white border-2 border-gray-200 rounded-full h-5 w-5 transition duration-200"></span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium">Basic</h5>
                        <p className="text-xs text-gray-500">Standard features for individuals</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 mr-4">$9.99/month</p>
                        <div className="relative inline-block h-6 w-11 flex-shrink-0">
                          <input type="checkbox" checked className="sr-only peer" />
                          <span className="bg-gray-200 peer-checked:bg-purple-600 block w-11 h-6 rounded-full transition-colors duration-200"></span>
                          <span className="transform translate-x-0 peer-checked:translate-x-5 absolute left-0.5 top-0.5 bg-white border-2 border-gray-200 rounded-full h-5 w-5 transition duration-200"></span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium">Premium</h5>
                        <p className="text-xs text-gray-500">Advanced features for power users</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 mr-4">$19.99/month</p>
                        <div className="relative inline-block h-6 w-11 flex-shrink-0">
                          <input type="checkbox" checked className="sr-only peer" />
                          <span className="bg-gray-200 peer-checked:bg-purple-600 block w-11 h-6 rounded-full transition-colors duration-200"></span>
                          <span className="transform translate-x-0 peer-checked:translate-x-5 absolute left-0.5 top-0.5 bg-white border-2 border-gray-200 rounded-full h-5 w-5 transition duration-200"></span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-medium">Enterprise</h5>
                        <p className="text-xs text-gray-500">Full features for organizations</p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 mr-4">$49.99/month</p>
                        <div className="relative inline-block h-6 w-11 flex-shrink-0">
                          <input type="checkbox" checked className="sr-only peer" />
                          <span className="bg-gray-200 peer-checked:bg-purple-600 block w-11 h-6 rounded-full transition-colors duration-200"></span>
                          <span className="transform translate-x-0 peer-checked:translate-x-5 absolute left-0.5 top-0.5 bg-white border-2 border-gray-200 rounded-full h-5 w-5 transition duration-200"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium text-gray-900">Payment Processing</h4>
                  <div className="mt-2">
                    <select
                      id="payment-processor"
                      name="payment-processor"
                      className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option>Stripe</option>
                      <option>PayPal</option>
                      <option>Square</option>
                      <option>Multiple Providers</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="auto-renew"
                      name="auto-renew"
                      type="checkbox"
                      checked
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="auto-renew" className="font-medium text-gray-700">
                      Enable auto-renewal for subscriptions
                    </label>
                    <p className="text-gray-500">Automatically renew subscriptions before they expire.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" className="btn-secondary mr-3">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;