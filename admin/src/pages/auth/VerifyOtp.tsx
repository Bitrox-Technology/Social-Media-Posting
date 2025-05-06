import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, BrainCircuit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useVerifyOTPMutation, useResendOTPMutation } from '../../store/authApi';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp: React.FC = () => {
  const [verifyOtp, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP] = useResendOTPMutation(); // Assuming resendOTP is the same mutation
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Get email from location.state
  const email = location.state?.email || '';

  // Yup validation schema
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
      .required('OTP is required'),
  });

  // Formik initial values
  const initialValues = {
    otp: '',
  };

  // Formik submit handler
  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      const response = await verifyOtp({ email, otp: values.otp }).unwrap();
      if (response.success) {
        toast.success('OTP verified successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? 'dark' : 'light',
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to verify OTP';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? 'dark' : 'light',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOTP({ email: email }).unwrap();
      if (response.success) {
        toast.success('OTP resent successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };


  // Redirect to signup if no email is provided
  if (!email) {
    navigate('/signup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-md">
            <BrainCircuit className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify your OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Enter the 6-digit OTP sent to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100 dark:border-gray-700">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ errors, touched }) => (
              <Form className="space-y-6">

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OTP
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    </div>
                    <Field
                      id="otp"
                      name="otp"
                      type="text"
                      autoComplete="off"
                      className={`appearance-none block w-full pl-10 px-3 py-2 border ${
                        touched.otp && errors.otp ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="123456"
                    />
                    <ErrorMessage name="otp" component="div" className="mt-1 text-sm text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Verifying OTP...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
                  Didn't receive the OTP?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleResend}
                className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
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
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default VerifyOtp;