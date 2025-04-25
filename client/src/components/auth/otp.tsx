import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Shield, ArrowRight } from 'lucide-react';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useResendOTPMutation, useVerifyOTPMutation } from '../../store/api';

export const OtpVerification = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOTP] = useVerifyOTPMutation()
  const [resendOTP] = useResendOTPMutation()
  const email = location.state?.email;

  // Redirect to sign-in if email is not provided in location.state
  if (!email) {
    navigate('/signup');
    return null;
  }

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
      const response = await verifyOTP({ email: email, otp: values.otp }).unwrap();
      if(response.success){
        navigate('/user-details', {state: {email: response.data.email}});
      }
      
    } catch (err: any) {
      setErrors({ otp: 'Invalid OTP. Please try again.' });
    }
    setSubmitting(false);
  };

  const handleResend = async () => {
    const response = await resendOTP({ email: email}).unwrap();
  }

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
        } backdrop-blur-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="text-center space-y-4">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-primary/20' : 'bg-primary/10'
            }`}
          >
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Verify Your Account</h2>
          {email && (
            <p className="text-gray-500 dark:text-gray-400">
              We've sent a verification code to<br />
              <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium">
                  Enter 6-Digit Code
                </label>
                <Field
                  type="text"
                  name="otp"
                  maxLength={6}
                  className={`mt-1 block w-full px-4 py-3 rounded-lg transition-colors text-center tracking-widest text-2xl ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="••••••"
                />
                <ErrorMessage name="otp" component="p" className="mt-1 text-sm text-red-400" />
              </div>

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
                  'Verifying...'
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-secondary transition-colors"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};