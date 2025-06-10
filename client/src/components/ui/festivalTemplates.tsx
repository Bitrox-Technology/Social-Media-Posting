// src/components/ui/ImageGenerationTemplate.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FestivalTemplates, FestivalTemplate, Colors } from '../../templetes/festivalTemplates';
import { ArrowLeft, Image as ImageIcon, ChevronRight, Layout, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import chroma from 'chroma-js';

const defaultColors: Colors = {
  logoColors: { primary: '#4A90E2', secondary: '#50E3C2', accent: ['#50E3C2', '#F5A623'] },
  imageColors: ['#4A90E2', '#50E3C2'],
  ensureContrast: (textColor: string, bgColor: string) => {
    try {
      const contrast = chroma.contrast(textColor, bgColor);
      if (contrast < 4.5) {
        const adjusted = chroma(textColor).luminance(contrast < 4.5 ? 0.7 : 0.3).hex();
        return chroma.contrast(adjusted, bgColor) >= 4.5 ? adjusted : '#ffffff';
      }
      return textColor;
    } catch {
      return '#ffffff';
    }
  },
  vibrantLogoColor: '#4A90E2',
  vibrantTextColor: '#FFFFFF',
  footerColor: '#50E3C2',
  backgroundColor: '#FFFFFF',
  glowColor: '#FFD700', // Added default glow color
  complementaryTextColor: '#00BFFF', // Added default complementary text color
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '2.5rem',
  },
  graphicStyle: {
    borderRadius: '8px',
    iconStyle: 'sharp',
    filter: 'none',
  },
  materialTheme: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    tertiary: '#F5A623',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
  },
};

export const FestivalTemplatesSelector: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const defaultLogoUrl = '/images/Logo.png' 
  const [selectedTemplate, setSelectedTemplate] = useState<FestivalTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'preview' | 'settings'>('templates');
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Dynamically adjust scale based on container size
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // Template is 1080x1080px; scale to fit container while preserving aspect ratio
        const maxWidth = containerWidth - 32; // Account for padding
        const maxHeight = containerHeight - 64; // Increased padding for top visibility
        const scaleX = maxWidth / 1080;
        const scaleY = maxHeight / 1080;
        const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 1:1
        setScale(newScale);
        console.log('Preview Scale:', newScale, 'Container:', {
          width: containerWidth,
          height: containerHeight,
          top: container.offsetTop,
        });
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [selectedTemplate]);

  const handleSelectTemplate = (template: FestivalTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
    console.log('Selected Template:', template.id, 'Logo URL:', defaultLogoUrl);
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
      <div className="flex h-screen">
        {/* Left Sidebar - Template Selection */}
        <div
          className={`w-1/4 border-r ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } p-6 overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.button
              onClick={handleBack}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
              } transition-all`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </motion.button>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Templates
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FestivalTemplates.map((template) => (
              <motion.div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`cursor-pointer rounded-xl overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                } ${selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="aspect-[3/4] relative">
                  {template.coverImageUrl ? (
                    <img
                      src={template.coverImageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={() => console.error(`Failed to load cover image at ${template.coverImageUrl}`)}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                      }`}
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div
                    className={`absolute bottom-0 left-0 right-0 p-3 ${
                      theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
                    } backdrop-blur-sm`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {template.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Content - Preview & Settings */}
        <div className="flex-1 flex flex-col">
          {/* Main Content Area */}
          <div className="flex-1 p-8 overflow-y-auto flex items-start justify-center pt-12">
            <AnimatePresence mode="wait">
              {activeTab === 'preview' && selectedTemplate ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center w-full"
                >
                  <div
                    ref={previewContainerRef}
                    className="relative rounded-xl shadow-2xl mb-8 w-full max-w-[1080px] aspect-square"
                  >
                    <div
                      style={{
                        width: '1080px',
                        height: '1080px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'center',
                        margin: '0 auto',
                      }}
                    >
                      {selectedTemplate.renderSlide(selectedTemplate.slides[0], true, defaultLogoUrl, defaultColors)}
                    </div>
                  </div>
                  <motion.button
                    onClick={handleProceedToEdit}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Customize Template
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : activeTab === 'settings' ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <div
                    className={`p-6 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } shadow-lg max-w-md w-full`}
                  >
                    <h3
                      className={`text-xl font-semibold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Template Settings
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Settings are not implemented yet. Customize colors, fonts, or other options here in the future.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <div
                    className={`p-4 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    } mb-4`}
                  >
                    <ImageIcon
                      className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                  </div>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select a template to preview
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};