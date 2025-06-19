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
import { useLazyGetProductContentQuery, useProductContentMutation, useSavePostsMutation, useUploadImageToCloudinaryMutation } from '../../store/api';
import { toast, ToastContainer } from 'react-toastify';
import { useAppDispatch } from '../../store/hooks';
import { setCsrfToken } from '../../store/appSlice';
import { generateProductPost } from '../../Utilities/functions';

interface ProductInfo {
  name: string;
  description: string;
  images: File[];
  postTypes: ('discount' | 'flashSale' | 'product')[];
  price: string;
  discount: {
    title: string;
    description: string;
    percentage: number;
  };
  flashSale: {
    title: string;
    offer: string;
    validUntil: string;
    description: string;
    pricesStartingAt: string;
  };
}

export const ProductPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { isOpen, config, showAlert, closeAlert, handleConfirm } = useAlert();
  const [preview, setPreview] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'discount' | 'flashSale' | 'product' | null>(null);
  const [post, setPost] = useState<any>(null); // Store the generated post data

  const [productContent] = useProductContentMutation();
  const [getProductContent] = useLazyGetProductContentQuery();
  const [savePosts] = useSavePostsMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Product name is required'),
    description: Yup.string().required('Product description is required'),
    images: Yup.array()
      .of(Yup.mixed().required('Image is required'))
      .min(3, 'Three images are required')
      .max(3, 'Maximum 3 images allowed'),
    postTypes: Yup.array()
      .of(Yup.string().oneOf(['discount', 'flashSale', 'product']))
      .min(1, 'Select at least one post type (Discount, Flash Sale, or Product)'),
    price: Yup.string().required('Price is required'),
    discount: Yup.object().when('postTypes', {
      is: (postTypes: string[]) => postTypes.includes('discount'),
      then: (schema) =>
        schema.shape({
          title: Yup.string().required('Discount title is required'),
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
          title: Yup.string().required('Flash sale title is required'),
          offer: Yup.string().required('Flash sale offer is required'),
          validUntil: Yup.string().required('Flash sale validity date is required'),
          description: Yup.string().required('Flash sale description is required'),
          pricesStartingAt: Yup.string().required('Flash sale starting price is required'),
        }),
      otherwise: (schema) => schema,
    }),
  });

  // Formik setup
  const formik = useFormik<ProductInfo>({
    initialValues: {
      name: '',
      description: '',
      images: [],
      postTypes: [],
      price: '',
      discount: {
        title: '',
        percentage: 0,
        description: '',
      },
      flashSale: {
        title: '',
        offer: '',
        validUntil: '',
        description: 'Steal the season’s hottest styles with our Buy 1 Get 2 offer—starting at just $399!',
        pricesStartingAt: '',
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Values: ', values);

      const cleanedValues = {
        ...values,
        name: values.name.trim(),
        description: values.description.trim(),
        price: values.price.trim(),
        postTypes: values.postTypes
          .map((type) => type.trim())
          .filter(Boolean),
        images: values.images.filter((image) => image),
        discount: values.discount
          ? {
              title: values.discount.title?.trim(),
              percentage: values.discount.percentage ? Number(values.discount.percentage) : undefined,
              description: values.discount.description?.trim(),
            }
          : undefined,
        flashSale: values.flashSale
          ? {
              title: values.flashSale.title?.trim(),
              offer: values.flashSale.offer?.trim(),
              validUntil: values.flashSale.validUntil?.trim(),
              description: values.flashSale.description?.trim(),
              pricesStartingAt: values.flashSale.pricesStartingAt?.trim(),
            }
          : undefined,
      };

      console.log('Clean Values: ', cleanedValues);
      const formData = new FormData();
      formData.append('productName', cleanedValues.name);
      formData.append('description', cleanedValues.description);
      cleanedValues.images.forEach((image) => {
        formData.append('imagesUrl', image);
      });

      cleanedValues.postTypes.forEach((type) => {
        formData.append('postTypes[]', type);
      });

      if (cleanedValues.price) {
        formData.append('price', cleanedValues.price);
      }

      if (cleanedValues.discount) {
        if (cleanedValues.discount.title) {
          formData.append('discount[title]', cleanedValues.discount.title);
        }
        if (cleanedValues.discount.percentage) {
          formData.append('discount[percentage]', cleanedValues.discount.percentage.toString());
        }
        if (cleanedValues.discount.description) {
          formData.append('discount[description]', cleanedValues.discount.description);
        }
      }

      if (cleanedValues.flashSale) {
        if (cleanedValues.flashSale.title) {
          formData.append('flashSale[title]', cleanedValues.flashSale.title);
        }
        if (cleanedValues.flashSale.offer) {
          formData.append('flashSale[offer]', cleanedValues.flashSale.offer);
        }
        if (cleanedValues.flashSale.validUntil) {
          formData.append('flashSale[validUntil]', cleanedValues.flashSale.validUntil);
        }
        if (cleanedValues.flashSale.description) {
          formData.append('flashSale[description]', cleanedValues.flashSale.description);
        }
        if (cleanedValues.flashSale.pricesStartingAt) {
          formData.append('flashSale[pricesStartingAt]', cleanedValues.flashSale.pricesStartingAt);
        }
      }

      let response;
      try {
        response = await productContent(formData).unwrap();
        console.log('Response save product: ', response);
        dispatch(setCsrfToken({ token: response.data.csrfToken, expiresAt: response.data.expiresAt }));
        toast.success(response.message || 'Profile saved successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        if (response?.statusCode === 201) {
          response = await getProductContent({ contentId: response.data.product._id }).unwrap();
          console.log('Get response', response.data);

          let newPost = await generateProductPost(
            'product',
            {
              savePosts,
              uploadImageToCloudinary,
            },
            dispatch,
            (token: { token: string; expiresAt: string }) =>
              dispatch(setCsrfToken({ token: token.token, expiresAt: Number(token.expiresAt) })),
            showAlert,
            response.data
          );

          console.log('New Post', newPost);
          setPost(newPost); // Store the generated post data
          setPreview(true);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('API Response Error:', (error as any).message || error);
        showAlert({
          type: 'error',
          title: 'Error',
          message: errorMessage || 'Failed to save product post.',
        });
      }
    },
  });

  // Handle file drop for image upload (max 3 images)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...formik.values.images, ...acceptedFiles].slice(0, 3);
      formik.setFieldValue('images', newImages);
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 3 - formik.values.images.length,
  });

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue('images', newImages);
  };

  // Handle post type toggle (uncomment if needed)
  const handlePostTypeToggle = useCallback(
    (postType: 'discount' | 'flashSale' | 'product') => {
      const postTypes = formik.values.postTypes.includes(postType)
        ? formik.values.postTypes.filter((type) => type !== postType)
        : [...formik.values.postTypes, postType];
      formik.setFieldValue('postTypes', postTypes);
    },
    [formik]
  );

  const handleBack = useCallback(() => {
    if (preview) {
      setPreview(false);
      setPreviewType(null);
    } else {
      navigate('/content-type');
    }
  }, [preview, navigate]);

  // Calculate time remaining for Flash Sale
  const currentDate = new Date('2025-06-17T12:01:00+05:30'); // Current date and time (IST)
  const endDate = new Date('2025-06-17T20:23:00+05:30'); // Flash sale end date (from newPost2)
  const timeDiff = endDate.getTime() - currentDate.getTime();
  const hoursRemaining = Math.floor(timeDiff / (1000 * 3600)); // Convert milliseconds to hours
  const minutesRemaining = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60)); // Remaining minutes

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
            <div className="w-24" />
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
                    className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                      isDragActive
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

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter price (e.g., Rs 299)..."
                    className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
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
                      className={`px-6 py-4 rounded-xl font-semibold ${
                        formik.values.postTypes.includes('discount')
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
                      className={`px-6 py-4 rounded-xl font-semibold ${
                        formik.values.postTypes.includes('flashSale')
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Flash Sale Post
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handlePostTypeToggle('product')}
                      className={`px-6 py-4 rounded-xl font-semibold ${
                        formik.values.postTypes.includes('product')
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Product Post
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
                        Discount Title
                      </label>
                      <input
                        type="text"
                        name="discount.title"
                        value={formik.values.discount.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount title (e.g., Special Offer)..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.discount?.title && formik.errors.discount?.title && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.discount.title}</p>
                      )}
                    </div>
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
                      <textarea
                        name="discount.description"
                        value={formik.values.discount.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount description..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
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
                        Flash Sale Title
                      </label>
                      <input
                        type="text"
                        name="flashSale.title"
                        value={formik.values.flashSale.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter flash sale title (e.g., WEEKEND FLASH SALE)..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.flashSale?.title && formik.errors.flashSale?.title && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.flashSale.title}</p>
                      )}
                    </div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Flash Sale Description
                      </label>
                      <textarea
                        name="flashSale.description"
                        value={formik.values.flashSale.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g., Steal the season’s hottest styles with our Buy 1 Get 2 offer—starting at just $399!..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      {formik.touched.flashSale?.description && formik.errors.flashSale?.description && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.flashSale.description}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prices Starting At
                      </label>
                      <input
                        type="text"
                        name="flashSale.pricesStartingAt"
                        value={formik.values.flashSale.pricesStartingAt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter flash sale starting price (e.g., Rs 199)..."
                        className="w-full px-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formik.touched.flashSale?.pricesStartingAt && formik.errors.flashSale?.pricesStartingAt && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.flashSale.pricesStartingAt}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl ${
                  formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {formik.isSubmitting ? 'Generating...' : 'Generate Post'}
              </motion.button>
            </div>
          </form>

          {preview && post && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Post Previews</h3>
               <motion.button
                    onClick={() => navigate(`/user-post/${post.newPost.postId}`)}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      previewType === 'flashSale'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Post
                  </motion.button>
              <div className="flex space-x-4 mb-4">
                {formik.values.postTypes.includes('product') && (
                  <motion.button
                    onClick={() => setPreviewType('product')}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      previewType === 'product'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Product Preview
                  </motion.button>
                )}
                {formik.values.postTypes.includes('discount') && (
                  <motion.button
                    onClick={() => setPreviewType('discount')}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      previewType === 'discount'
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
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      previewType === 'flashSale'
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
                {previewType === 'product' && post.newPost && (
                  <div className="w-full max-w-md space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Product Post Preview</h4>
                    <img
                      src={post.newPost.images[0].url}
                      alt="Product Post Preview"
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="text-gray-900 dark:text-gray-200 space-y-2">
                      <p><strong>Title:</strong> {post.newPost.content.title}</p>
                      <p><strong>Description:</strong> {post.newPost.content.description}</p>
                      <p><strong>Price:</strong> ₹{post.newPost.content.price}</p>
                      <p><strong>Website URL:</strong> <a href={post.newPost.content.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{post.newPost.content.websiteUrl}</a></p>
                      <p><strong>Footer:</strong> @{post.newPost.content.footer}</p>
                      <p><strong>Template:</strong> {post.newPost.templateId}</p>
                      <p><strong>Product Images:</strong></p>
                      <div className="flex flex-wrap gap-4">
                        {post.newPost1.content.imagesUrl.map((url: string, index: number) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            className="max-h-40 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {previewType === 'discount' && post.newPost1 && (
                  <div className="w-full max-w-md space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Discount Post Preview</h4>
                    <img
                      src={post.newPost.images[1].url}
                      alt="Discount Post Preview"
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="text-gray-900 dark:text-gray-200 space-y-2">
                      <p><strong>Title:</strong> {post.newPost1.content.title}</p>
                      <p><strong>Description:</strong> {post.newPost1.content.description}</p>
                      <p><strong>Discount:</strong> {post.newPost1.content.offer}% off</p>
                      <p><strong>Price After Discount:</strong> ₹{Math.round(Number(post.newPost.content.price) * (1 - post.newPost1.content.offer / 100))}</p>
                      <p><strong>Website URL:</strong> <a href={post.newPost1.content.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{post.newPost1.content.websiteUrl}</a></p>
                      <p><strong>Footer:</strong> @{post.newPost1.content.footer}</p>
                      <p><strong>Template:</strong> {post.newPost1.templateId}</p>
                      <p><strong>Product Images:</strong></p>
                      <div className="flex flex-wrap gap-4">
                        {post.newPost1.content.imagesUrl.map((url: string, index: number) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            className="max-h-40 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {previewType === 'flashSale' && post.newPost2 && (
                  <div className="w-full max-w-md space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Flash Sale Post Preview</h4>
                    <img
                      src={post.newPost.images[2].url}
                      alt="Flash Sale Post Preview"
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="text-gray-900 dark:text-gray-200 space-y-2">
                      <p><strong>Title:</strong> {post.newPost2.content.title}</p>
                      <p><strong>Description:</strong> {post.newPost2.content.description}</p>
                      <p><strong>Offer:</strong> {post.newPost2.content.offer}</p>
                      <p><strong>Prices Starting At:</strong> ₹{post.newPost2.content.pricesStartingAt.split('"')[1]}</p>
                      <p><strong>Valid Until:</strong> {post.newPost2.content.validUntil}</p>
                      <p><strong>Time Remaining:</strong> {hoursRemaining} hours, {minutesRemaining} minutes</p>
                      <p><strong>Website URL:</strong> <a href={post.newPost2.content.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{post.newPost2.content.websiteUrl}</a></p>
                      <p><strong>Footer:</strong> @{post.newPost2.content.footer}</p>
                      <p><strong>Template:</strong> {post.newPost2.templateId}</p>
                      <p><strong>Product Images:</strong></p>
                      <div className="flex flex-wrap gap-4">
                        {post.newPost2.content.imagesUrl.map((url: string, index: number) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Product Image ${index + 1}`}
                            className="max-h-40 rounded-lg"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
          />
        </motion.div>
      </div>
    </div>
  );
};