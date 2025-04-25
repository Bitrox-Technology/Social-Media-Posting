import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const ForgotPassword = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    newPassword: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one number, and one special character'
      )
      .required('New password is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      // Simulate an API call to reset the password
      console.log('Resetting password for:', values.email, 'with new password:', values.newPassword);
      
      // In a real application, you would call an API here, e.g.:
      // await resetPassword({ email: values.email, newPassword: values.newPassword }).unwrap();

      // On success, navigate to the sign-in page
      navigate('/signin');
    } catch (err: any) {
      setErrors({ email: err?.data?.message || 'Password reset failed. Please try again.' });
    }
    setSubmitting(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-lg ${
          theme === 'dark' ? 'bg-gray-800/80 text-white' : 'bg-white text-gray-900'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Enter your email and new password to reset
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <Field
                      type="email"
                      name="email"
                      className={`block w-full px-4 py-3 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="you@example.com"
                    />
                    <Mail
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                      size={20}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-400"
                  />
                </div>

                {/* New Password Field */}
                <div className="relative">
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      className={`block w-full px-4 py-3 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-primary focus:border-transparent`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="p"
                    className="mt-1 text-sm text-red-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-4 py-3 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border border-primary hover:bg-gray-600 text-white focus:ring-offset-gray-800'
                    : 'bg-gray-100 border border-primary hover:bg-gray-200 text-gray-900 focus:ring-offset-gray-100'
                } disabled:opacity-50`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  'Resetting...'
                ) : (
                  <>
                    Reset Password
                    <Lock className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remember your password?{' '}
            <Link to="/signin" className="font-medium text-primary hover:text-secondary">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;