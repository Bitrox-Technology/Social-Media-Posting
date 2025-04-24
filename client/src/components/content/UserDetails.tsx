import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';

const UserDetail = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    username: '',
    email: '',
    companyName: '',
    avatar: null as File | null,
    logo: null as File | null,
    productCategories: [''],
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
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    companyName: Yup.string().required('Company name is required'),
    targetMarket: Yup.string().required('Target market is required'),
    websiteUrl: Yup.string().url('Invalid URL').required('Website URL is required'),
    productCategories: Yup.array()
      .of(Yup.string().required('Category is required'))
      .min(1, 'At least one category is required'),
    keyProducts: Yup.array()
      .of(Yup.string().required('Product is required'))
      .min(1, 'At least one product is required'),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    const formDataToSend = new FormData();
    formDataToSend.append('username', values.username);
    formDataToSend.append('email', values.email);
    formDataToSend.append('companyName', values.companyName);
    if (values.avatar) formDataToSend.append('avatar', values.avatar);
    if (values.logo) formDataToSend.append('logo', values.logo);
    formDataToSend.append('productCategories', JSON.stringify(values.productCategories.filter((item) => item)));
    formDataToSend.append('keyProducts', JSON.stringify(values.keyProducts.filter((item) => item)));
    formDataToSend.append('targetMarket', values.targetMarket);
    formDataToSend.append('websiteUrl', values.websiteUrl);

    try {
      const response = await fetch('http://localhost:3000/api/user-details', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User details saved:', data);
        localStorage.setItem('userDetails', JSON.stringify(values));
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Failed to save user details');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'An unknown error occurred' });
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-semibold mb-8 text-center text-yellow-600 dark:text-yellow-500">Manage Your Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                  placeholder="Enter your username"
                />
                <ErrorMessage name="username" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="companyName" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <Field
                  type="text"
                  id="companyName"
                  name="companyName"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                  placeholder="Enter your company name"
                />
                <ErrorMessage name="companyName" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setFieldValue('avatar', e.target.files[0]);
                    }
                  }}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="logo" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setFieldValue('logo', e.target.files[0]);
                    }
                  }}
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Product Categories</label>
                <FieldArray name="productCategories">
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      {values.productCategories.map((category, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Field
                            type="text"
                            name={`productCategories[${index}]`}
                            className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                            placeholder="e.g., Electronics"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                            disabled={values.productCategories.length === 1}
                          >
                            <Trash2 size={20} />
                          </button>
                          <ErrorMessage
                            name={`productCategories[${index}]`}
                            component="p"
                            className="text-red-500 dark:text-red-400 text-sm"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push('')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
                      >
                        <Plus size={18} /> Add Category
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage name="productCategories" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Key Products</label>
                <FieldArray name="keyProducts">
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      {values.keyProducts.map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Field
                            type="text"
                            name={`keyProducts[${index}]`}
                            className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                            placeholder="e.g., Smartphones"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                            disabled={values.keyProducts.length === 1}
                          >
                            <Trash2 size={20} />
                          </button>
                          <ErrorMessage
                            name={`keyProducts[${index}]`}
                            component="p"
                            className="text-red-500 dark:text-red-400 text-sm"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push('')}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
                      >
                        <Plus size={18} /> Add Product
                      </button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage name="keyProducts" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="targetMarket" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Target Market
                </label>
                <Field
                  type="text"
                  id="targetMarket"
                  name="targetMarket"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                  placeholder="e.g., Young professionals"
                />
                <ErrorMessage name="targetMarket" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="websiteUrl" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Website URL
                </label>
                <Field
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white"
                  placeholder="e.g., https://yourcompany.com"
                />
                <ErrorMessage name="websiteUrl" component="p" className="text-red-500 dark:text-red-400 text-sm mt-1" />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-yellow-600 dark:bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors disabled:bg-yellow-800 dark:disabled:bg-yellow-700 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </button>
            <ErrorMessage name="submit" component="p" className="text-red-500 dark:text-red-400 text-sm text-center mt-2" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserDetail;