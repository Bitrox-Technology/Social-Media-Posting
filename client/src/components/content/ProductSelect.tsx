import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { NewProductTemplates, NewProductTemplate, Colors } from '../../templetes/Product/newProductTemplates';
import { useDropzone } from 'react-dropzone';

interface ProductInfo {
  name: string;
  imageUrl: string;
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

interface Schedule {
  fromDate: string; // e.g., "2025-06-03"
  toDate: string;   // e.g., "2025-06-10"
  time: string;     // e.g., "14:00" (2:00 PM)
}

export const ProductPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isOpen, config, showAlert, closeAlert, handleConfirm } = useAlert();
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    imageUrl: '',
    postTypes: [],
    discount: { percentage: 0, description: '' },
    flashSale: { offer: '', validUntil: '' },
    websiteUrl: '',
  });
  const [schedule, setSchedule] = useState<Schedule>({
    fromDate: '',
    toDate: '',
    time: '',
  });
  const [preview, setPreview] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'discount' | 'flashSale' | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<{
    discount: NewProductTemplate | null;
    flashSale: NewProductTemplate | null;
  }>({ discount: null, flashSale: null });

  // Handle file drop for image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProductInfo((prev) => ({ ...prev, imageUrl }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1,
  });

  const handleInputChange = useCallback(
    (
      field: keyof ProductInfo,
      value: string | { percentage: number; description: string } | { offer: string; validUntil: string }
    ) => {
      setProductInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleScheduleChange = useCallback(
    (field: keyof Schedule, value: string) => {
      setSchedule((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handlePostTypeToggle = useCallback((postType: 'discount' | 'flashSale') => {
    setProductInfo((prev) => {
      const postTypes = prev.postTypes.includes(postType)
        ? prev.postTypes.filter((type) => type !== postType)
        : [...prev.postTypes, postType];
      return { ...prev, postTypes };
    });

    // Select a random template for the post type
    if (!selectedTemplates[postType]) {
      const templates = postType === 'discount' ? NewProductTemplates.slice(7, 12) : NewProductTemplates.slice(12, 17);
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setSelectedTemplates((prev) => ({ ...prev, [postType]: randomTemplate }));
    }
  }, [selectedTemplates]);

  const generatePostDates = useCallback(() => {
    const { fromDate, toDate, time } = schedule;
    if (!fromDate || !toDate || !time) return [];

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const postDates: { type: 'discount' | 'flashSale'; date: string }[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const [hours, minutes] = time.split(':').map(Number);
      productInfo.postTypes.forEach((postType) => {
        for (let i = 0; i < 3; i++) {
          const postTime = new Date(date);
          // Stagger posts: discount at 0, 10, 20 minutes; flashSale at 30, 40, 50 minutes
          const offset = postType === 'discount' ? i * 10 : 30 + i * 10;
          postTime.setHours(hours, minutes + offset);
          postDates.push({ type: postType, date: postTime.toISOString() });
        }
      });
    }
    return postDates;
  }, [schedule, productInfo.postTypes]);

  const handleSubmit = useCallback(() => {

    console.log('Submitting product info:', productInfo);
    console.log('Schedule:', schedule);
    
    // Validation
    if (!productInfo.name || !productInfo.imageUrl || !productInfo.websiteUrl) {
      showAlert({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields (product name, image, and website URL).',
      });
      return;
    }

    if (productInfo.postTypes.length === 0) {
      showAlert({
        type: 'error',
        title: 'No Post Type Selected',
        message: 'Please select at least one post type (Discount or Flash Sale).',
      });
      return;
    }

    if (
      productInfo.postTypes.includes('discount') &&
      (!productInfo.discount.percentage || !productInfo.discount.description)
    ) {
      showAlert({
        type: 'error',
        title: 'Missing Discount Information',
        message: 'Please provide the discount percentage and description.',
      });
      return;
    }

    if (
      productInfo.postTypes.includes('flashSale') &&
      (!productInfo.flashSale.offer || !productInfo.flashSale.validUntil)
    ) {
      showAlert({
        type: 'error',
        title: 'Missing Flash Sale Information',
        message: 'Please provide the flash sale offer and validity date.',
      });
      return;
    }

    if (!schedule.fromDate || !schedule.toDate || !schedule.time) {
      showAlert({
        type: 'error',
        title: 'Missing Schedule Information',
        message: 'Please provide the date range and time for scheduling posts.',
      });
      return;
    }

    const postDates = generatePostDates();
    if (postDates.length === 0) {
      showAlert({
        type: 'error',
        title: 'Invalid Schedule',
        message: 'The date range is invalid or no posts could be scheduled.',
      });
      return;
    }

    // Log scheduled posts
    console.log('Scheduled Posts:', postDates);

    // Show preview (default to first post type)
    setPreview(true);
    setPreviewType(productInfo.postTypes[0] || null);
  }, [productInfo, schedule, generatePostDates, showAlert]);

  const handleBack = useCallback(() => {
    if (preview) {
      setPreview(false);
      setPreviewType(null);
    } else {
      navigate('/content-type');
    }
  }, [preview, navigate]);

  const generateSlide = useCallback(
    (postType: 'discount' | 'flashSale') => {
      const selectedTemplate = selectedTemplates[postType];
      if (!selectedTemplate) return null;

      const slideData = {
        title: postType === 'discount' ? 'SPECIAL OFFER' : productInfo.name.toUpperCase(),
        description:
          postType === 'discount'
            ? `Get ${productInfo.discount.percentage}% Off! ${productInfo.discount.description}`
            : `${productInfo.flashSale.offer} - Valid Until ${productInfo.flashSale.validUntil}`,
        imageUrl: productInfo.imageUrl,
        footer: productInfo.websiteUrl,
        websiteUrl: productInfo.websiteUrl,
      };

      const colors: Colors = {
        logoColors: { primary: '#000', secondary: '#fff', accent: ['#ff0000', '#00ff00'] },
        imageColors: ['#ffffff', '#000000', '#cccccc'],
        glowColor: '#00f0ff',
        complementaryGlowColor: '#ff00f0',
        vibrantLogoColor: '#ff9800',
        vibrantTextColor: '#1976d2',
        footerColor: '#424242',
        backgroundColor: '#f5f5f5',
        ensureContrast: (foreground: string, background: string) => foreground,
        materialTheme: {
          primary: '#1976d2',
          secondary: '#424242',
          tertiary: '#ff9800',
          background: '#f5f5f5',
          surface: '#ffffff',
          onPrimary: '#ffffff',
          onSecondary: '#ffffff',
          onBackground: '#000000',
          onSurface: '#000000',
        },
        typography: { fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '16px' },
        graphicStyle: { borderRadius: '8px', iconStyle: '', filter: '' },
      };

      return selectedTemplate.renderSlide(slideData, true, '/logo.png', colors);
    },
    [productInfo, selectedTemplates]
  );

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

          {!preview ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
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
                      value={productInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name..."
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Image
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
                      {productInfo.imageUrl ? (
                        <div>
                          <img src={productInfo.imageUrl} alt="Uploaded" className="max-h-40 mx-auto mb-2" />
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
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={productInfo.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="Enter website URL..."
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Post Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Post Types
                    </label>
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => handlePostTypeToggle('discount')}
                        className={`px-6 py-3 rounded-xl font-semibold ${
                          productInfo.postTypes.includes('discount')
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Discount Post
                      </motion.button>
                      <motion.button
                        onClick={() => handlePostTypeToggle('flashSale')}
                        className={`px-6 py-3 rounded-xl font-semibold ${
                          productInfo.postTypes.includes('flashSale')
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Flash Sale Post
                      </motion.button>
                    </div>
                  </div>

                  {/* Discount Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Discount Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        value={productInfo.discount.percentage}
                        onChange={(e) =>
                          handleInputChange('discount', {
                            percentage: parseInt(e.target.value) || 0,
                            description: productInfo.discount.description,
                          })
                        }
                        placeholder="Enter discount percentage..."
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discount Description
                      </label>
                      <input
                        type="text"
                        value={productInfo.discount.description}
                        onChange={(e) =>
                          handleInputChange('discount', {
                            percentage: productInfo.discount.percentage,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter discount description..."
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Flash Sale Information */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Flash Sale Information</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Flash Sale Offer
                      </label>
                      <input
                        type="text"
                        value={productInfo.flashSale.offer}
                        onChange={(e) =>
                          handleInputChange('flashSale', {
                            offer: e.target.value,
                            validUntil: productInfo.flashSale.validUntil,
                          })
                        }
                        placeholder="e.g., Buy 1 Get 1 Free..."
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Valid Until
                      </label>
                      <input
                        type="text"
                        value={productInfo.flashSale.validUntil}
                        onChange={(e) =>
                          handleInputChange('flashSale', {
                            offer: productInfo.flashSale.offer,
                            validUntil: e.target.value,
                          })
                        }
                        placeholder="e.g., 31 July 2025..."
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Schedule Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Schedule Posts</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={schedule.fromDate}
                        onChange={(e) => handleScheduleChange('fromDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={schedule.toDate}
                        onChange={(e) => handleScheduleChange('toDate', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Post Time
                      </label>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) => handleScheduleChange('time', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Posts
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Post Previews</h3>
              <div className="flex space-x-4 mb-4">
                {productInfo.postTypes.includes('discount') && (
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
                {productInfo.postTypes.includes('flashSale') && (
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
                {previewType && generateSlide(previewType)}
              </div>
              <motion.button
                onClick={() => navigate('/content-type')} // Navigate back or to a confirmation page
                className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save & Continue
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