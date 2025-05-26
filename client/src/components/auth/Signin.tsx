// src/pages/SignIn.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignInMutation, useSignUpAndSigninByProviderMutation } from '../../store/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, LogIn, Apple, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithPopup } from 'firebase/auth';
import { appleProvider, auth, googleProvider } from '../../Utilities/firebase';
import { useDispatch } from 'react-redux';
import { setUser, setCsrfToken } from '../../store/appSlice';

export const SignIn = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [signIn] = useSignInMutation();
  const [signUpAndSigninByProvider] = useSignUpAndSigninByProviderMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      const response = await signIn({ email: values.email, password: values.password }).unwrap();
      if (response.success) {
        dispatch(setUser({
          email: response.data.email,
          expiresAt: response.data.user.sessionExpiry,
          role: response.data.user.role,
          authenticate: true,
        }));
        dispatch(setCsrfToken({
          token: response.data.csrfToken,
          expiresAt: response.data.expiresAt,
        }));
        toast.success('Signed in successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Invalid credentials';
      setErrors({ email: errorMessage });
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    if (isSocialLoading) return;
    setIsSocialLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const response = await signUpAndSigninByProvider({
        email: user.email ?? '',
        provider: 'google',
        uid: user.uid,
      }).unwrap();

      if (response.success) {
        dispatch(setUser({
          email: response.data.user.email,
          expiresAt: response.data.user.expiresAt,
          role: response.data.user.role,
          authenticate: true,
        }));
        dispatch(setCsrfToken({
          token: response.data.csrfToken,
          expiresAt: response.data.expiresAt,
        }));
        toast.success('Signed in successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/popup-closed-by-user'
        ? 'Sign-in cancelled. Please try again.'
        : error.message || 'Google sign-in failed.';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (isSocialLoading) return;
    setIsSocialLoading(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      const response = await signUpAndSigninByProvider({
        email: user.email ?? '',
        provider: 'apple',
        uid: user.uid,
      }).unwrap();

      if (response.success) {
        dispatch(setUser({
          email: response.data.user.email,
          expiresAt: response.data.user.expiresAt,
          role: response.data.user.role,
          authenticate: true,
        }));
        dispatch(setCsrfToken({
          token: response.data.csrfToken,
          expiresAt: response.data.expiresAt,
        }));
        toast.success('Signed in successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error: any) {
      const errorMessage = error.code === 'auth/popup-closed-by-user'
        ? 'Sign-in cancelled. Please try again.'
        : error.message || 'Apple sign-in failed.';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/80 text-white' : 'bg-white text-gray-900'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Sign in to continue your journey</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAppleSignIn}
            disabled={isSocialLoading}
            className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors ${theme === 'dark' ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-900'} disabled:opacity-50`}
          >
            <Apple className="w-5 h-5 mr-2" />
            Apple
          </button>
          <button
            onClick={handleGoogleSignIn}
            disabled={isSocialLoading}
            className={`flex items-center justify-center px-4 py-2 border rounded-lg transition-colors ${theme === 'dark' ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white' : 'border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-900'} disabled:opacity-50`}
          >
            <Mail className="w-5 h-5 mr-2" />
            Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`데이트px-2 ${theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'}`}>
              Or continue with
            </span>
          </div>
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className={`mt-1 block w-full px-4 py-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="you@example.com"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-400" />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`block w-full px-4 py-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-primary focus:border-transparent`}
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
                  <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className={`h-4 w-4 rounded focus:ring-primary ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-secondary">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center px-4 py-3 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'bg-gray-700 border border-primary hover:bg-gray-600 text-white focus:ring-offset-gray-800' : 'bg-gray-100 border border-primary hover:bg-gray-200 text-gray-900 focus:ring-offset-gray-100'} disabled:opacity-50`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Signing in...' : (
                  <>
                    Sign in
                    <LogIn className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-secondary">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default SignIn;