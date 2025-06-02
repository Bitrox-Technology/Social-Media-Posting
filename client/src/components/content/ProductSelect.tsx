import React, { useState, useCallback } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { NewProductTemplates, NewProductTemplate, Colors } from '../../templetes/Product/newProductTemplates'; // Assuming this is where your templates are exported

interface ProductInfo {
  name: string;
  imageUrl: string;
  postType: 'discount' | 'flashSale' | '';
  discount?: {
    percentage: number;
    description: string;
  };
  flashSale?: {
    offer: string; // e.g., "Buy 1 Get 1 Free"
    validUntil: string; // e.g., "31 July 2025"
  };
  websiteUrl: string;
}

export const ProductPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isOpen, config, showAlert, closeAlert, handleConfirm } = useAlert();
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    imageUrl: '',
    postType: '',
    discount: undefined,
    flashSale: undefined,
    websiteUrl: '',
  });
  const [preview, setPreview] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NewProductTemplate | null>(null);

  const handleInputChange = useCallback(
    (field: keyof ProductInfo, value: string | { percentage: number; description: string } | { offer: string; validUntil: string }) => {
      setProductInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handlePostTypeSelect = useCallback((postType: 'discount' | 'flashSale') => {
    setProductInfo((prev) => ({
      ...prev,
      postType,
      discount: postType === 'discount' ? { percentage: 0, description: '' } : undefined,
      flashSale: postType === 'flashSale' ? { offer: '', validUntil: '' } : undefined,
    }));
    // Automatically select a random template based on post type
    const templates = postType === 'discount' ? NewProductTemplates.slice(7, 12) : NewProductTemplates.slice(12, 17); // Discount: 8-12, Flash Sale: 13-17
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setSelectedTemplate(randomTemplate);
  }, []);

  const handleSubmit = useCallback(() => {
    // Validation
    if (!productInfo.name || !productInfo.imageUrl || !productInfo.postType || !productInfo.websiteUrl) {
      showAlert({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields (product name, image URL, post type, and website URL).',
      });
      return;
    }

    if (productInfo.postType === 'discount' && (!productInfo.discount?.percentage || !productInfo.discount?.description)) {
      showAlert({
        type: 'error',
        title: 'Missing Discount Information',
        message: 'Please provide the discount percentage and description.',
      });
      return;
    }

    if (productInfo.postType === 'flashSale' && (!productInfo.flashSale?.offer || !productInfo.flashSale?.validUntil)) {
      showAlert({
        type: 'error',
        title: 'Missing Flash Sale Information',
        message: 'Please provide the flash sale offer and validity date.',
      });
      return;
    }

    // If all validation passes, show the preview
    setPreview(true);
  }, [productInfo, showAlert]);

  const handleBack = useCallback(() => {
    if (preview) {
      setPreview(false);
    } else {
      navigate('/content-type');
    }
  }, [preview, navigate]);

  const generateSlide = useCallback(() => {
    if (!selectedTemplate) return null;

    const slideData = {
      title: productInfo.postType === 'discount' ? 'SPECIAL OFFER' : productInfo.name.toUpperCase(),
      description:
        productInfo.postType === 'discount'
          ? `Get ${productInfo.discount?.percentage}% Off! ${productInfo.discount?.description}`
          : `${productInfo.flashSale?.offer} - Valid Until ${productInfo.flashSale?.validUntil}`,
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
      ensureContrast: (foreground: string, background: string) => foreground, // Dummy implementation
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
      graphicStyle: { borderRadius: '8px', iconStyle: '', filter: '' }
    };

    return selectedTemplate.renderSlide(slideData, true, '/logo.png', colors);
  }, [productInfo, selectedTemplate]);

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

                  {/* Product Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Image URL
                    </label>
                    <input
                      type="text"
                      value={productInfo.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="Enter image URL..."
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      Post Type
                    </label>
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => handlePostTypeSelect('discount')}
                        className={`px-6 py-3 rounded-xl font-semibold ${productInfo.postType === 'discount'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Discount Post
                      </motion.button>
                      <motion.button
                        onClick={() => handlePostTypeSelect('flashSale')}
                        className={`px-6 py-3 rounded-xl font-semibold ${productInfo.postType === 'flashSale'
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
                  {productInfo.postType === 'discount' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Discount Percentage
                        </label>
                        <input
                          type="number"
                          value={productInfo.discount?.percentage || 0}
                          onChange={(e) =>
                            handleInputChange('discount', {
                              percentage: parseInt(e.target.value) || 0,
                              description: productInfo.discount?.description || '',
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
                          value={productInfo.discount?.description || ''}
                          onChange={(e) =>
                            handleInputChange('discount', {
                              percentage: productInfo.discount?.percentage || 0,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter discount description..."
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Flash Sale Information */}
                  {productInfo.postType === 'flashSale' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Flash Sale Offer
                        </label>
                        <input
                          type="text"
                          value={productInfo.flashSale?.offer || ''}
                          onChange={(e) =>
                            handleInputChange('flashSale', {
                              offer: e.target.value,
                              validUntil: productInfo.flashSale?.validUntil || '',
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
                          value={productInfo.flashSale?.validUntil || ''}
                          onChange={(e) =>
                            handleInputChange('flashSale', {
                              offer: productInfo.flashSale?.offer || '',
                              validUntil: e.target.value,
                            })
                          }
                          placeholder="e.g., 31 July 2025..."
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Post
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Post Preview</h3>
              <div className="flex justify-center">
                {generateSlide()}
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