import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Shield } from 'lucide-react';
import * as Yup from 'yup';

export const OtpVerification = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.app.user);

    const initialValues = {
        otp: '',
    };

    const validationSchema = Yup.object({
        otp: Yup.string()
            .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
            .required('OTP is required'),
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
        try {
            console.log('Verifying OTP:', values.otp);
            navigate('/user-details'); 
        } catch (err: any) {
            setErrors({ otp: 'Invalid OTP. Please try again.' });
        }
        setSubmitting(false);
    };

    return (

        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verify Your Account
            </h2>
            {user?.email && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                We've sent a verification code to<br />
                <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
              </p>
            )}
          </div>
  
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enter 6-Digit Code
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    maxLength={6}
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 text-center tracking-widest text-2xl"
                    placeholder="••••••"
                  />
                  <ErrorMessage name="otp" component="p" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                </div>
  
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
  
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      );
};
