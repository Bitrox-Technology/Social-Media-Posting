import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { NewProductTemplates, NewProductTemplate, Colors } from '../../templetes/Product/newProductTemplates';
import { useDropzone } from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface ProductInfo {
  name: string;
  description: string;
  images: File[]; // Array of File objects, max 3
  postTypes: ('discount' | 'flashSale')[]; // Array to store selected post types
  discount: {
    percentage: number;
    description: string;
  };
  flashSale: {
    offer: string;
    validUntil: string;
  };
  websiteUrl: string;
}

export const ProductPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isOpen, config, showAlert, closeAlert, handleConfirm } = useAlert();
  const [preview, setPreview] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'discount' | 'flashSale' | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<{
    discount: NewProductTemplate | null;
    flashSale: NewProductTemplate | null;
  }>({ discount: null, flashSale: null });

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Product description is required'),
    images: Yup.array()
      .of(Yup.mixed().required('Image is required'))
      .min(3, 'Three images are required')
      .max(3, 'Maximum 3 images allowed'),
    postTypes: Yup.array()
      .of(Yup.string().oneOf(['discount', 'flashSale']))
      .min(1, 'Select at least one post type (Discount or Flash Sale)'),
    discount: Yup.object().when('postTypes', {
      is: (postTypes: string[]) => postTypes.includes('discount'),
      then: (schema) =>
        schema.shape({
          percentage: Yup.number()
            .min(1, 'Discount percentage must be at least 1')
            .required('Discount percentage is required'),
          description: Yup.string().required('Discount description is required'),
        }),
      otherwise: (schema) => schema,
    }),
    flashSale: Yup.object().when('postTypes', {
      is: (postTypes: string[]) => postTypes.includes('flashSale'),
      then: (schema) =>
        schema.shape({
          offer: Yup.string().required('Flash sale offer is required'),
          validUntil: Yup.string().required('Flash sale validity date is required'),
        }),
      otherwise: (schema) => schema,
    }),
    websiteUrl: Yup.string()
      .url('Must be a valid URL')
      .required('Website URL is required'),
  });

  // Formik setup
  const formik = useFormik<ProductInfo>({
    initialValues: {
      name: '',
      description: '',
      images: [],
      postTypes: [],
      discount: { percentage: 0, description: '' },
      flashSale: { offer: '', validUntil: '' },
      websiteUrl: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Only trigger preview, do not log values here
      setPreview(true);
      setPreviewType(values.postTypes[0] || null);
    },
  });

  // Handle file drop for image upload (max 3 images)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = [...formik.values.images, ...acceptedFiles].slice(0, 3); // Limit to 3 images
    formik.setFieldValue('images', newImages);
  }, [formik]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 3 - formik.values.images.length, // Allow only remaining slots
  });

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue('images', newImages);
  };

  // Handle post type toggle
  const handlePostTypeToggle = useCallback((postType: 'discount' | 'flashSale') => {
    const postTypes = formik.values.postTypes.includes(postType)
      ? formik.values.postTypes.filter((type) => type !== postType)
      : [...formik.values.postTypes, postType];
    formik.setFieldValue('postTypes', postTypes);

    // Select a random template for the post type
    if (!selectedTemplates[postType]) {
      const templates = postType === 'discount' ? NewProductTemplates.slice(7, 12) : NewProductTemplates.slice(12, 17);
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setSelectedTemplates((prev) => ({ ...prev, [postType]: randomTemplate }));
    }
  }, [formik, selectedTemplates]);

  const handleBack = useCallback(() => {
    if (preview) {
      setPreview(false);
      setPreviewType(null);
    } else {
      navigate('/content-type');
    }
  }, [preview, navigate]);

  // Reinstated generateSlide function
  

  // Handle final "Generate Post" button click in preview
  const handleGeneratePost = useCallback(() => {
    console.log('Submitting product info:', formik.values);
   
  }, [formik.values, navigate]);

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Post Creator</h2>
            </div>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>


          <form onSubmit={formik.handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Product Information</h3>
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter product name..."
                    className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter product description..."
                    className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                  )}
                </div>

                {/* Product Images Upload (Max 3) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Images (Max 3)
                  </label>
                  <div
                    {...getRootProps()}
                    className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                      }`}
                  >
                    <input {...getInputProps()} />
                    {formik.values.images.length > 0 ? (
                      <div className="flex flex-wrap gap-4 justify-center">
                        {formik.values.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Uploaded ${index}`}
                              className="max-h-40 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag and drop up to 3 images here, or click to select.
                      </p>
                    )}
                  </div>
                  {formik.touched.images && formik.errors.images && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof formik.errors.images === 'string' ? formik.errors.images : 'Invalid images'}
                    </p>
                  )}
                </div>

                {/* Post Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Post Types
                  </label>
                  <div className="flex space-x-4">
                    <motion.button
                      type="button"
                      onClick={() => handlePostTypeToggle('discount')}
                      className={`px-6 py-4 rounded-xl font-semibold ${formik.values.postTypes.includes('discount')
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Discount Post
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handlePostTypeToggle('flashSale')}
                      className={`px-6 py-4 rounded-xl font-semibold ${formik.values.postTypes.includes('flashSale')
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Flash Sale Post
                    </motion.button>
                  </div>
                  {formik.touched.postTypes && formik.errors.postTypes && (
                    <p className="text-red-500 text-sm mt-1">
                      {typeof formik.errors.postTypes === 'string' ? formik.errors.postTypes : 'Select a post type'}
                    </p>
                  )}
                </div>

                {/* Discount Information */}
                {formik.values.postTypes.includes('discount') && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Discount Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        name="discount.percentage"
                        value={formik.values.discount.percentage}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount percentage..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.discount?.percentage && formik.errors.discount?.percentage && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.discount.percentage}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Description
                      </label>
                      <input
                        type="text"
                        name="discount.description"
                        value={formik.values.discount.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount description..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.discount?.description && formik.errors.discount?.description && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.discount.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Flash Sale Information */}
                {formik.values.postTypes.includes('flashSale') && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Flash Sale Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Flash Sale Offer
                      </label>
                      <input
                        type="text"
                        name="flashSale.offer"
                        value={formik.values.flashSale.offer}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., Buy 1 Get 1 Free..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.flashSale?.offer && formik.errors.flashSale?.offer && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.flashSale.offer}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Valid Until
                      </label>
                      <input
                        type="text"
                        name="flashSale.validUntil"
                        value={formik.values.flashSale.validUntil}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., 31 July 2025..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.flashSale?.validUntil && formik.errors.flashSale?.validUntil && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.flashSale.validUntil}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button (Preview) */}
              <motion.button
                type="submit"
                disabled={formik.isSubmitting}
                onClick={handleGeneratePost}
                className={`w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl ${formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {formik.isSubmitting ? 'Generating...' : 'Generate Post'}
              </motion.button>
            </div>
          </form>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Post Previews</h3>
            <div className="flex space-x-4 mb-4">
              {formik.values.postTypes.includes('discount') && (
                <motion.button
                  onClick={() => setPreviewType('discount')}
                  className={`px-4 py-2 rounded-xl font-semibold ${previewType === 'discount'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Discount Preview
                </motion.button>
              )}
              {formik.values.postTypes.includes('flashSale') && (
                <motion.button
                  onClick={() => setPreviewType('flashSale')}
                  className={`px-4 py-2 rounded-xl font-semibold ${previewType === 'flashSale'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Flash Sale Preview
                </motion.button>
              )}
            </div>
            <div className="flex justify-center">
            </div>
            <motion.button
              className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Preview Post
            </motion.button>
          </div>


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