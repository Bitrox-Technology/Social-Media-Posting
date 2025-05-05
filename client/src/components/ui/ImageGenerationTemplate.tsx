import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageTemplates, ImageTemplate } from '../../templetes/ImageTemplate';
import { ArrowLeft, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const ImageGenerationTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const defaultLogoUrl = '/images/Logo1.png';
  const [selectedTemplate, setSelectedTemplate] = useState<ImageTemplate | null>(null);

  const handleSelectTemplate = (template: ImageTemplate) => {
    setSelectedTemplate(template);
  };

  const handleProceedToEdit = () => {
    if (!selectedTemplate) {
      alert('Please select a template first.');
      return;
    }
    navigate('/image-generation', {
      state: {
        templateId: selectedTemplate.id,
        initialSlide: selectedTemplate.slides[0],
      },
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } shadow-lg transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Select Image Template
          </h1>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {imageTemplates.map((template) => (
            <motion.div
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`group cursor-pointer rounded-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-xl transition-all ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-blue-500'
                  : 'hover:shadow-2xl'
              }`}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                {template.coverImageUrl ? (
                  <img
                    src={template.coverImageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <ImageIcon className={`w-12 h-12 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  theme === 'dark'
                    ? 'from-gray-900/80 to-transparent'
                    : 'from-black/60 to-transparent'
                }`} />
              </div>
              <div className="p-4">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {template.name}
                </h3>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Click to preview and customize
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Preview Section */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Template Preview
              </h2>
              <motion.button
                onClick={handleProceedToEdit}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Customize Template
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="flex justify-center">
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  width: '500px',
                  height: '700px',
                }}
              >
                {selectedTemplate.renderSlide(selectedTemplate.slides[0], true, defaultLogoUrl)}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};