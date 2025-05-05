import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Upload,
  Building2,
  Globe,
  Target,
  Box,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserDetailsMutation } from '../../store/api';

const UserDetail = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [userDetails] = useUserDetailsMutation();

  // Predefined country codes and locations
  const countryCodes = [
    { code: '+1', name: 'United States' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+86', name: 'China' },
    { code: '+81', name: 'Japan' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+61', name: 'Australia' },
  ];

  const locations = [
    'India',
    'United States',
    'United Kingdom',
    'China',
    'Japan',
    'Germany',
    'France',
    'Australia',
  ];

  const [initialValues, setInitialValues] = useState({
    userName: '',
    email: email || '',
    countryCode: '',
    phone: '',
    location: '',
    logo: null as File | null,
    companyName: '',
    productCategories: [{ category: '', productName: '', image: null as File | null }],
    services: [''],
    keyProducts: [''],
    targetMarket: '',
    websiteUrl: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userDetails');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Ensure productCategories includes image field
      parsedData.productCategories = parsedData.productCategories.map((item: any) => ({
        ...item,
        image: null, // Images can't be persisted in localStorage, reset to null
      }));
      setInitialValues(parsedData);
    }
  }, []);

  const validationSchema = Yup.object({
    userName: Yup.string().trim().required('Username is required'),
    email: Yup.string()
      .email('Invalid email')
      .trim()
      .lowercase()
      .required('Email is required'),
    countryCode: Yup.string().trim().required('Country code is required'),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9]{6,15}$/, 'Phone number must be 6-15 digits')
      .required('Phone number is required'),
    location: Yup.string().trim().required('Location is required'),
    companyName: Yup.string().trim().required('Company name is required'),
    productCategories: Yup.array()
      .of(
        Yup.object({
          category: Yup.string().trim().required('Category is required'),
          productName: Yup.string().trim().required('Product name is required'),
          image: Yup.mixed().nullable(), // Image is optional
        })
      )
      .min(1, 'At least one product category is required'),
    services: Yup.array()
      .of(Yup.string().trim().required('Service is required'))
      .min(1, 'At least one service is required'),
    keyProducts: Yup.array()
      .of(Yup.string().trim().required('Product is required'))
      .min(1, 'At least one key product is required'),
    targetMarket: Yup.string().trim().required('Target market is required'),
    websiteUrl: Yup.string()
      .url('Invalid URL')
      .trim()
      .required('Website URL is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      const cleanedValues = {
        ...values,
        userName: values.userName.trim(),
        email: values.email.trim().toLowerCase(),
        countryCode: values.countryCode.trim(),
        phone: values.phone.trim(),
        location: values.location.trim(),
        companyName: values.companyName.trim(),
        productCategories: values.productCategories
          .map((item) => ({
            category: item.category.trim(),
            productName: item.productName.trim(),
            image: item.image, // Keep the file object
          }))
          .filter((item) => item.category && item.productName),
        services: values.services.map((service) => service.trim()).filter(Boolean),
        keyProducts: values.keyProducts.map((product) => product.trim()).filter(Boolean),
        targetMarket: values.targetMarket.trim(),
        websiteUrl: values.websiteUrl.trim(),
      };

      console.log('Cleaned values:', cleanedValues);
      const formData = new FormData();

      // Append simple fields
      formData.append('userName', cleanedValues.userName);
      formData.append('email', cleanedValues.email);
      formData.append('countryCode', cleanedValues.countryCode);
      formData.append('phone', cleanedValues.phone);
      formData.append('location', cleanedValues.location);
      formData.append('companyName', cleanedValues.companyName);
      formData.append('targetMarket', cleanedValues.targetMarket);
      formData.append('websiteUrl', cleanedValues.websiteUrl);

      // Append productCategories with images
      cleanedValues.productCategories.forEach((item, index) => {
        formData.append(`productCategories[${index}][category]`, item.category);
        formData.append(`productCategories[${index}][productName]`, item.productName);
        if (item.image) {
          formData.append(`productCategories[${index}][image]`, item.image);
        }
      });

      // Append services as individual array elements
      cleanedValues.services.forEach((service, index) => {
        formData.append(`services[${index}]`, service);
      });

      // Append keyProducts as individual array elements
      cleanedValues.keyProducts.forEach((product, index) => {
        formData.append(`keyProducts[${index}]`, product);
      });

      // Append logo file if present
      if (cleanedValues.logo) {
        formData.append('logo', cleanedValues.logo);
      }

      // Log FormData for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await userDetails(formData).unwrap();
      console.log('API response:', response);

      // if (!response.success) {
      //   throw new Error(response.message || 'Failed to save profile');
      // }

      // toast.success(response.message || 'Profile saved successfully!', {
      //   position: 'bottom-right',
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
      // setTimeout(() => {
      //   navigate('/profile');
      // }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setSubmitting(false);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 dark:to-gray-800'
          : 'bg-gradient-to-br from-purple-50 to-indigo-50'
      }`}
    >
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div
            className={`${
              theme === 'dark'
                ? 'bg-gradient-to-r from-gray-800 to-gray-900'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600'
            } px-6 py-8 sm:px-10`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Complete Your Profile</h2>
            <p className="mt-2 text-indigo-100 dark:text-gray-300 text-center max-w-2xl mx-auto">
              Help us understand your business better by providing detailed information
            </p>
          </div>

          <div className="px-6 py-8 sm:px-10">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-8">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Username
                        </label>
                        <Field
                          type="text"
                          name="userName"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="Enter your username"
                        />
                        <ErrorMessage
                          name="userName"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="Enter your email"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Company Information
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Building2 className="inline-block w-4 h-4 mr-2" />
                            Company Name
                          </label>
                          <Field
                            type="text"
                            name="companyName"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                            placeholder="Enter company name"
                          />
                          <ErrorMessage
                            name="companyName"
                            component="p"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <MapPin className="inline-block w-4 h-4 mr-2" />
                            Location
                          </label>
                          <Field
                            as="select"
                            name="location"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors appearance-none"
                          >
                            <option value="">Select a location</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="location"
                            component="p"
                            className="mt-1 text-sm text-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Upload className="inline-block w-4 h-4 mr-2" />
                          Company Logo
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFieldValue('logo', file);
                          }}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-colors"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="inline-block w-4 h-4 mr-2" />
                          Country Code
                        </label>
                        <Field
                          as="select"
                          name="countryCode"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors appearance-none"
                        >
                          <option value="">Select country code</option>
                          {countryCodes.map((code) => (
                            <option key={code.code} value={code.code}>
                              {code.code} ({code.name})
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="countryCode"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="Enter phone number"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      <Box className="inline-block w-5 h-5 mr-2" />
                      Product Categories
                    </h3>
                    <FieldArray name="productCategories">
                      {({ remove, push }) => (
                        <div className="space-y-6">
                          {values.productCategories.map((category, index) => (
                            <div key={index} className="space-y-4">
                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <Field
                                    name={`productCategories.${index}.category`}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                    placeholder="Category name"
                                  />
                                  <ErrorMessage
                                    name={`productCategories.${index}.category`}
                                    component="p"
                                    className="mt-1 text-sm text-red-500"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Field
                                    name={`productCategories.${index}.productName`}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                    placeholder="Product name"
                                  />
                                  <ErrorMessage
                                    name={`productCategories.${index}.productName`}
                                    component="p"
                                    className="mt-1 text-sm text-red-500"
                                  />
                                </div>
                                <motion.button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={values.productCategories.length === 1}
                                >
                                  <Trash2 size={20} />
                                </motion.button>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <Upload className="inline-block w-4 h-4 mr-2" />
                                  Product Image
                                </label>
                                <input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setFieldValue(`productCategories.${index}.image`, file);
                                    }
                                  }}
                                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-colors"
                                  accept="image/*"
                                />
                                {values.productCategories[index].image && (
                                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Selected: {values.productCategories[index].image!.name}
                                  </p>
                                )}
                                <ErrorMessage
                                  name={`productCategories.${index}.image`}
                                  component="p"
                                  className="mt-1 text-sm text-red-500"
                                />
                              </div>
                            </div>
                          ))}
                          <motion.button
                            type="button"
                            onClick={() => push({ category: '', productName: '', image: null })}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={20} className="mr-2" />
                            Add Category
                          </motion.button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      <FileText className="inline-block w-5 h-5 mr-2" />
                      Services
                    </h3>
                    <FieldArray name="services">
                      {({ remove, push }) => (
                        <div className="space-y-4">
                          {values.services.map((_, index) => (
                            <div key={index} className="flex gap-4">
                              <Field
                                name={`services.${index}`}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                placeholder="Enter a service"
                              />
                              <motion.button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={values.services.length === 1}
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          ))}
                          <motion.button
                            type="button"
                            onClick={() => push('')}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={20} className="mr-2" />
                            Add Service
                          </motion.button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      <Box className="inline-block w-5 h-5 mr-2" />
                      Key Products
                    </h3>
                    <FieldArray name="keyProducts">
                      {({ remove, push }) => (
                        <div className="space-y-4">
                          {values.keyProducts.map((_, index) => (
                            <div key={index} className="flex gap-4">
                              <Field
                                name={`keyProducts.${index}`}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                placeholder="Enter a key product"
                              />
                              <motion.button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={values.keyProducts.length === 1}
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          ))}
                          <motion.button
                            type="button"
                            onClick={() => push('')}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus size={20} className="mr-2" />
                            Add Key Product
                          </motion.button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Market Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Target className="inline-block w-4 h-4 mr-2" />
                          Target Market
                        </label>
                        <Field
                          type="text"
                          name="targetMarket"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="e.g., Young professionals"
                        />
                        <ErrorMessage
                          name="targetMarket"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Globe className="inline-block w-4 h-4 mr-2" />
                          Website URL
                        </label>
                        <Field
                          type="url"
                          name="websiteUrl"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="https://yourcompany.com"
                        />
                        <ErrorMessage
                          name="websiteUrl"
                          component="p"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center px-6 py-3 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
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
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default UserDetail;