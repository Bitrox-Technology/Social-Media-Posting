// ImageGenerationTemplate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageTemplates, ImageTemplate } from '../../templetes/ImageTemplate';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const ImageGenerationTemplate: React.FC = () => {
  const navigate = useNavigate();
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
    navigate('/auto-post-creator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Select an Image Template
          </h1>
        </div>

        {/* Horizontal Scrollable Template List */}
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {imageTemplates.map((template) => (
              <motion.div
                key={template.id}
                className={`flex-shrink-0 w-48 bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border ${
                  selectedTemplate?.id === template.id ? 'border-yellow-500' : 'border-gray-700'
                } cursor-pointer hover:border-yellow-500 transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="relative rounded-lg overflow-hidden h-32">
                  {template.coverImageUrl ? (
                    <img
                      src={template.coverImageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <span className="text-gray-400">No Preview</span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-100 mt-2 text-center">{template.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate ? (
          <motion.div
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Template Preview</h2>
            <div
              className="relative rounded-xl overflow-hidden max-w-2xl max-h-[600px] mx-auto"
              style={{
                width: '500px',
                height: '700px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              {selectedTemplate.renderSlide(selectedTemplate.slides[0], true, defaultLogoUrl)}
            </div>
            <div className="flex justify-center mt-6">
              <motion.button
                onClick={handleProceedToEdit}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-400 hover:to-teal-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Select and Edit
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">
            <p>Please select a template to preview.</p>
          </div>
        )}
      </div>
    </div>
  );
};

