import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { useSignUpMutation } from '../../store/api';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, UserPlus } from 'lucide-react';


export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        'Password must contain at least one uppercase letter, one number, and one special character'
      )
      .required('Password is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      const signUpResponse = await signUp({ email: values.email, password: values.password }).unwrap();
      if (signUpResponse.success) {
        navigate('/otp-verification'); 
      }
    } catch (err: any) {
      setErrors({ email: err?.data?.message || 'Signup failed. Please try again.' });
    }
    setSubmitting(false);
  };

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
    <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Join us and start managing your social media presence
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
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
              </div>


              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    name="acceptTerms"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                    I accept the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Terms and Conditions
                    </a>
                  </label>
                  <ErrorMessage name="acceptTerms" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <UserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};
