import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Upload, Building2, Globe, Target, Box, Phone, MapPin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const UserDetail = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    userName: '',
    email: '',
    countryCode: '',
    phone: '',
    location: '',
    logo: null as File | null,
    companyName: '',
    productCategories: [{ category: '', productName: '' }],
    services: [''],
    keyProducts: [''],
    targetMarket: '',
    websiteUrl: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userDetails');
    if (savedData) {
      setInitialValues(JSON.parse(savedData));
    }
  }, []);

  const validationSchema = Yup.object({
    userName: Yup.string().trim().required('Username is required'),
    email: Yup.string()
      .email('Invalid email')
      .trim()
      .lowercase()
      .required('Email is required'),
    countryCode: Yup.string().trim(),
    phone: Yup.string().trim(),
    location: Yup.string().trim(),
    companyName: Yup.string().trim().required('Company name is required'),
    productCategories: Yup.array()
      .of(
        Yup.object({
          category: Yup.string().trim().required('Category is required'),
          productName: Yup.string().trim().required('Product name is required'),
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
        productCategories: values.productCategories.map((item) => ({
          category: item.category.trim(),
          productName: item.productName.trim(),
        })),
        services: values.services.map((service) => service.trim()).filter(Boolean),
        keyProducts: values.keyProducts.map((product) => product.trim()).filter(Boolean),
        targetMarket: values.targetMarket.trim(),
        websiteUrl: values.websiteUrl.trim(),
      };

      const formDataToSend = new FormData();
      Object.entries(cleanedValues).forEach(([key, value]) => {
        if (key === 'productCategories' || key === 'services' || key === 'keyProducts') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== '') {
          formDataToSend.append(key, value.toString());
        }
      });

      localStorage.setItem('userDetails', JSON.stringify(cleanedValues));
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 sm:px-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-indigo-100 text-center max-w-2xl mx-auto">
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
                  {/* Basic Information Section */}
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

                  {/* Company Information Section */}
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
                            type="text"
                            name="location"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                            placeholder="Enter location"
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

                  {/* Contact Information */}
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
                          type="text"
                          name="countryCode"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                          placeholder="+91"
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
                      </div>
                    </div>
                  </div>

                  {/* Product Categories Section */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      <Box className="inline-block w-5 h-5 mr-2" />
                      Product Categories
                    </h3>
                    <FieldArray name="productCategories">
                      {({ remove, push }) => (
                        <div className="space-y-4">
                          {values.productCategories.map((_, index) => (
                            <div key={index} className="flex gap-4">
                              <Field
                                name={`productCategories.${index}.category`}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                placeholder="Category name"
                              />
                              <Field
                                name={`productCategories.${index}.productName`}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                                placeholder="Product name"
                              />
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
                          ))}
                          <motion.button
                            type="button"
                            onClick={() => push({ category: '', productName: '' })}
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

                  {/* Services Section */}
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

                  {/* Key Products Section */}
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

                  {/* Market Information */}
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

                  {/* Submit Button */}
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
    </div>
  );
};

export default UserDetail;