import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Camera, Save } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useUpdateAdminProfileMutation, useLazyGetAdminProfileQuery } from '../../store/authApi';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  countryCode: Yup.string()
    .matches(/^\+\d{1,4}$/, 'Invalid country code')
    .required('Country code is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  location: Yup.string().required('Location is required'),
  bio: Yup.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must not exceed 500 characters'),
  website: Yup.string().url('Invalid URL format'),
  twitter: Yup.string().matches(/^@?(\w){1,15}$/, 'Invalid Twitter handle'),
  linkedin: Yup.string().url('Invalid LinkedIn URL'),
  profileImage: Yup.mixed().test(
    'fileType',
    'Only JPG, JPEG, PNG, or GIF files are allowed',
    (value) => !value || (value instanceof File && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type))
  ).test(
    'fileSize',
    'Image size must be less than 1MB',
    (value) => !value || (value instanceof File && value.size <= 1024 * 1024)
  ),
});

const countryCodes = [
  { value: '+1', label: '+1 (USA)' },
  { value: '+91', label: '+91 (India)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+81', label: '+81 (Japan)' },
  { value: '+86', label: '+86 (China)' },
];

const locations = [
  { value: 'New York, USA', label: 'New York, USA' },
  { value: 'London, UK', label: 'London, UK' },
  { value: 'Tokyo, Japan', label: 'Tokyo, Japan' },
  { value: 'Mumbai, India', label: 'Mumbai, India' },
  { value: 'Beijing, China', label: 'Beijing, China' },
];

const defaultProfileImage =
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150';

const AdminDetails: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();
  const [adminData, setAdminData] = useState<any>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  // Initial values from fetched data or defaults
  const initialValues = {
    username: adminData?.username || '',
    email: adminData?.email || '',
    countryCode: adminData?.countryCode || '',
    phone: adminData?.phone || '',
    location: adminData?.location || '',
    bio: adminData?.bio || '',
    website: adminData?.website || '',
    twitter: adminData?.twitter || '',
    linkedin: adminData?.linkedin || '',
    profileImage: null as File | null,
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a JPG, JPEG, PNG, or GIF file', {
          theme: isDarkMode ? 'dark' : 'light',
        });
        return;
      }

      // Validate file size
      if (file.size > 1024 * 1024) {
        toast.error('Image size must be less than 1MB', {
          theme: isDarkMode ? 'dark' : 'light',
        });
        return;
      }

      // Revoke previous preview URL if exists
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }

      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      setFieldValue('profileImage', file);
      setProfileImagePreview(previewUrl);
      console.log('Selected file:', file.name, 'Preview URL:', previewUrl);
    } else {
      console.log('No file selected');
      setFieldValue('profileImage', null);
      setProfileImagePreview(null);
    }
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setErrors }: any) => {
    try {
      const formData = new FormData();

      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('countryCode', values.countryCode);
      formData.append('phone', values.phone);
      formData.append('location', values.location);
      formData.append('bio', values.bio);
      formData.append('website', values.website);
      formData.append('twitter', values.twitter);
      formData.append('linkedin', values.linkedin);

      if (values.profileImage) {
        formData.append('profileImage', values.profileImage);
      }

      // Log form data for debugging
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }


      const response = await updateProfile(formData).unwrap();
      if (response.success) {
        setAdminData(response.data);
        toast.success('Profile updated successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          theme: isDarkMode ? 'dark' : 'light',
        });
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update profile';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: isDarkMode ? 'dark' : 'light',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your profile information
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, setFieldValue }) => (
            <Form className="p-6">
              <div className="space-y-8">
                {/* Profile Image Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={profileImagePreview || adminData?.profileImage || defaultProfileImage}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        e.currentTarget.src = defaultProfileImage;
                      }}
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-purple-600 dark:bg-purple-500 p-2 rounded-full text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors cursor-pointer"
                    >
                      <Camera size={16} />
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Upload a new profile photo. JPG, JPEG, PNG, or GIF. Max size of 1MB.
                    </p>
                    {errors.profileImage && touched.profileImage && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.profileImage === 'string' ? errors.profileImage : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      className={`mt-1 block w-full rounded-md border ${errors.username && touched.username
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.username && touched.username && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.username === 'string' ? errors.username : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className={`mt-1 block w-full rounded-md border ${errors.email && touched.email
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.email && touched.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.email === 'string' ? errors.email : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="countryCode"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Country Code
                    </label>
                    <Field
                      as="select"
                      name="countryCode"
                      className={`mt-1 block w-full rounded-md border ${errors.countryCode && touched.countryCode
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    >
                      <option value="" disabled>
                        Select country code
                      </option>
                      {countryCodes.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label}
                        </option>
                      ))}
                    </Field>
                    {errors.countryCode && touched.countryCode && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.countryCode === 'string' ? errors.countryCode : ''}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      className={`mt-1 block w-full rounded-md border ${errors.phone && touched.phone
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.phone && touched.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.phone === 'string' ? errors.phone : ''}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Location
                    </label>
                    <Field
                      as="select"
                      name="location"
                      className={`mt-1 block w-full rounded-md border ${errors.location && touched.location
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    >
                      <option value="" disabled>
                        Select location
                      </option>
                      {locations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </Field>
                    {errors.location && touched.location && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.location === 'string' ? errors.location : ''}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Bio
                    </label>
                    <Field
                      as="textarea"
                      name="bio"
                      rows={4}
                      placeholder="Tell us about yourself"
                      className={`mt-1 block w-full rounded-md border ${errors.bio && touched.bio
                          ? 'border-red-300'
                          : 'border-gray-300 dark:border-gray-600'
                        } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.bio && touched.bio && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {typeof errors.bio === 'string' ? errors.bio : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Website
                      </label>
                      <Field
                        type="text"
                        name="website"
                        placeholder="https://yourwebsite.com"
                        className={`mt-1 block w-full rounded-md border ${errors.website && touched.website
                            ? 'border-red-300'
                            : 'border-gray-300 dark:border-gray-600'
                          } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.website && touched.website && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {typeof errors.website === 'string' ? errors.website : ''}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="twitter"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Twitter
                      </label>
                      <Field
                        type="text"
                        name="twitter"
                        placeholder="@yourhandle"
                        className={`mt-1 block w-full rounded-md border ${errors.twitter && touched.twitter
                            ? 'border-red-300'
                            : 'border-gray-300 dark:border-gray-600'
                          } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.twitter && touched.twitter && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {typeof errors.twitter === 'string' ? errors.twitter : ''}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        LinkedIn
                      </label>
                      <Field
                        type="text"
                        name="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={`mt-1 block w-full rounded-md border ${errors.linkedin && touched.linkedin
                            ? 'border-red-300'
                            : 'border-gray-300 dark:border-gray-600'
                          } px-3 py-2 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-purple-500 dark:focus:ring-purple-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      />
                      {errors.linkedin && touched.linkedin && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {typeof errors.linkedin === 'string' ? errors.linkedin : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUpdating}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors duration-200 ${(isSubmitting || isUpdating) && 'opacity-50 cursor-not-allowed'
                      }`}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting || isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
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

export default AdminDetails;