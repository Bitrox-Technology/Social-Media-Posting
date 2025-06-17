import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import { useFestivalContentMutation, useLazyGetFestivalContentQuery, useSavePostsMutation, useUploadImageToCloudinaryMutation } from '../../store/api';
import { generateFestivalPost } from '../../Utilities/functions';
import { useDispatch } from 'react-redux';
import { setCsrfToken } from '../../store/appSlice';

// Form values interface
interface FormValues {
  festivalName: string;
  description: string;
  festivalDate: string;
  imageUrl: string; // For preview
  imageFile: File | null; // For file upload
}

export const FestivalPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isOpen, config, showAlert, closeAlert, handleConfirm } = useAlert();
  const [preview, setPreview] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  
  const [newPost, setNewPost] = useState<any>(null);;
  const [festivalContent] = useFestivalContentMutation();
  const [getFestivalContent] = useLazyGetFestivalContentQuery();
  const [savePosts] = useSavePostsMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    festivalName: Yup.string().trim().min(1, 'Festival name is required').required('Festival name is required'),
    description: Yup.string()
      .trim()
      .min(1, 'Description is required')
      .max(300, 'Description must be 300 characters or less')
      .required('Description is required'),
    festivalDate: Yup.string().required('Festival date is required'),
    imageFile: Yup.mixed().required('Festival image is required'),
  });

  // Formik setup
  const formik = useFormik<FormValues>({
    initialValues: {
      festivalName: '',
      description: '',
      festivalDate: '',
      imageUrl: '',
      imageFile: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting festival info:', values);

      // Prepare FormData for API call
      const formData = new FormData();
      formData.append('festivalName', values.festivalName);
      formData.append('description', values.description);
      formData.append('festivalDate', values.festivalDate);
      formData.append('image', values.imageFile!); // Non-null assertion since validated

      try {
        const response = await festivalContent(formData).unwrap();

        console.log('API response:', response.data);

        toast.success(response.data.message || 'Festival post saved successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const getResponse = await getFestivalContent({ contentId: response.data.blog._id }).unwrap();
        console.log('Get response', getResponse.data);

        let generatePost = await generateFestivalPost(
          'festival',
          {
            savePosts,
            uploadImageToCloudinary,
          },
          dispatch,
          (token: { token: string; expiresAt: string }) =>
            dispatch(setCsrfToken({ token: token.token, expiresAt: Number(token.expiresAt) })),
          showAlert,
          getResponse.data
        );

        console.log('New Post', generatePost);
        setNewPost(generatePost)
        setImage(generatePost.images?.[0]?.url || '');
        setPreview(true);
      } catch (error: any) {
        console.error('API Response Error:', error.response?.data || error.message);
        showAlert({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.message || 'Failed to save festival post.',
        });
      }
    },
  });

  // Handle file drop for image upload
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        formik.setValues({
          ...formik.values,
          imageUrl,
          imageFile: file,
        });
      }
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleBack = useCallback(() => {
    if (preview) {
      setPreview(false);
    } else {
      navigate('/content-type');
    }
  }, [preview, navigate]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between mb-6 px-4">
            <motion.button
              onClick={handleBack}
              className="p-2 rounded-full bg-gray-800 dark:bg-gray-700 text-gray-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Festival Post Creator</h2>
            </div>
            <div className="w-24" />
          </div>

          {!preview ? (
            <form onSubmit={formik.handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Festival Information</h3>
                <div className="space-y-4">
                  {/* Festival Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Festival Name
                    </label>
                    <input
                      type="text"
                      name="festivalName"
                      value={formik.values.festivalName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., Diwali, Christmas..."
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.festivalName && formik.errors.festivalName ? 'border-red-500' : ''
                        }`}
                    />
                    {formik.touched.festivalName && formik.errors.festivalName && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.festivalName}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter festival description..."
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                        }`}
                      rows={4}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                    )}
                  </div>

                  {/* Festival Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Festival Date
                    </label>
                    <input
                      type="date"
                      name="festivalDate"
                      value={formik.values.festivalDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.festivalDate && formik.errors.festivalDate ? 'border-red-500' : ''
                        }`}
                    />
                    {formik.touched.festivalDate && formik.errors.festivalDate && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.festivalDate}</p>
                    )}
                  </div>

                  {/* Festival Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Festival Image
                    </label>
                    <div
                      {...getRootProps()}
                      className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                        } ${formik.touched.imageFile && formik.errors.imageFile ? 'border-red-500' : ''}`}
                    >
                      <input {...getInputProps()} />
                      {formik.values.imageUrl ? (
                        <div>
                          <img src={formik.values.imageUrl} alt="Uploaded" className="max-h-40 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Image uploaded. Drag or click to replace.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Drag and drop an image here, or click to select one.
                        </p>
                      )}
                    </div>
                    {formik.touched.imageFile && formik.errors.imageFile && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.imageFile}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className={`w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formik.isSubmitting ? 'Generating...' : 'Generate Post'}
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Post Preview</h3>
              {image ? (
                <div className="flex justify-center">
                  <img
                    src={image}
                    alt="Generated Festival Post"
                    className="max-w-full max-h-[600px] rounded-lg object-contain"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">No image available for preview.</p>
              )}
              <motion.button
                onClick={() => navigate(`/user-post/${newPost.postId}`)}
                className={`px-4 py-2 rounded-xl font-semibold bg-blue-500 text-white
                    bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200
                  `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Post
              </motion.button>
            </div>
          )}

          <Alert
            type={config.type}
            title={config.title}
            message={config.message}
            isOpen={isOpen}
            onClose={closeAlert}
            onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
          />
        </motion.div>
      </div>
    </div>
  );
};