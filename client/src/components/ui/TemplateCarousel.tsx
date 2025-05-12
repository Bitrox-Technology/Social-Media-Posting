// src/components/ui/TemplateCarousel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { carouselTemplates, Slide, CarouselTemplate } from '../../templetes/templetesDesign';
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ExtendedCarouselTemplate extends CarouselTemplate {
  coverImage: string;
}

interface TemplateCarouselProps {
  initialTopic: string;
  onImagesGenerated?: (images: string[]) => void;
  onSave?: (updatedSlides: Slide[], updatedImages: string[]) => void;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ initialTopic, onImagesGenerated, onSave }) => {
  const { theme } = useTheme();
  const [topic] = useState<string>(initialTopic);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedCarouselTemplate>({
    ...carouselTemplates[0],
    coverImage: carouselTemplates[0].slides[0]?.imageUrl || '/images/default-cover.jpg',
  });
  const [slides, setSlides] = useState<Slide[]>(selectedTemplate.slides);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...slides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const defaultLogoUrl = '/images/Logo.png' 
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const extendedTemplates: ExtendedCarouselTemplate[] = carouselTemplates.map((template) => ({
    ...template,
    coverImage: template.coverImageUrl || '/images/default-cover.jpg',
  }));

  // Log Swiper position for debugging
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper && swiperRef.current.swiper.el) {
      const swiperEl = swiperRef.current.swiper.el as HTMLElement;
      console.log('Swiper Position:', {
        top: swiperEl.offsetTop,
        height: swiperEl.offsetHeight,
        width: swiperEl.offsetWidth,
      });
    }
  }, [loading, editMode]);

  // Log selectedTemplate for debugging
  useEffect(() => {
    console.log('Selected Template:', {
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      colors: selectedTemplate.colors,
      slidesCount: selectedTemplate.slides.length,
    });
  }, [selectedTemplate]);

  const handleTemplateSelect = async (template: ExtendedCarouselTemplate) => {
    setLoading(true);
    try {
      setSelectedTemplate(template);
      const newSlides = template.slides;
      await Promise.all(newSlides.map(preloadSlideImages));
      setSlides(newSlides);
      setEditedSlides([...newSlides]);
      console.log('Selected Template:', template.id, 'Logo URL:', defaultLogoUrl);
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  // const captureScreenshots = async (slidesToCapture: Slide[]) => {
  //   const images: string[] = [];
  //   for (let i = 0; i < slidesToCapture.length; i++) {
  //     const slideElement = slideRefs.current[i];
  //     if (!slideElement) continue;
  //     await preloadSlideImages(slidesToCapture[i]);
  //     const canvas = await html2canvas(slideElement, {
  //       useCORS: true,
  //       scale: 2,
  //       backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
  //     });
  //     const image = canvas.toDataURL('image/png');
  //     images.push(image);
  //   }
  //   return images;
  // };

  // const handleImageUpload = (index: number, field: keyof Slide, event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const newEditedSlides = [...editedSlides];
  //       newEditedSlides[index] = { ...newEditedSlides[index], [field]: reader.result as string };
  //       setEditedSlides(newEditedSlides);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleEditChange = (index: number, field: keyof Slide, value: string) => {
  //   const newEditedSlides = [...editedSlides];
  //   newEditedSlides[index] = { ...newEditedSlides[index], [field]: value };
  //   setEditedSlides(newEditedSlides);
  // };

  // const handleSaveChanges = async () => {
  //   setLoading(true);
  //   try {
  //     setSlides([...editedSlides]);
  //     const updatedImages = await captureScreenshots(editedSlides);
  //     if (onSave) {
  //       onSave(editedSlides, updatedImages);
  //     }
  //     setEditMode(false);
  //   } catch (error) {
  //     console.error('Error saving changes:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const preloadSlideImages = async (slide: Slide) => {
    const images = [
      slide.imageUrl,
      slide.headshotUrl,
      slide.overlayGraphic,
      slide.like,
      slide.comment,
      slide.save,
      addLogo ? defaultLogoUrl : '',
    ].filter(Boolean);

    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              console.log(`Image loaded: ${url}`);
              resolve(undefined);
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${url}`);
              resolve(undefined);
            };
          })
      )
    );
  };

  const getSlideDimensions = () => {
    const baseDimensions = platform === 'instagram' ? { width: 1080, height: 1080 } : { width: 1200, height: 1200 };
    return {
      width: `${baseDimensions.width}px`,
      height: `${baseDimensions.height}px`,
      maxHeight: '80vh',
      aspectRatio: '1 / 1',
    };
  };

  // Error Boundary Component
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return <div className="text-red-500 p-4">Something went wrong. Please try again.</div>;
      }
      return this.props.children;
    }
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div
              className={`lg:w-1/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Templates
                </h2>
                <motion.button
                  onClick={() => navigate(-1)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
                </motion.button>
              </div>

              <div className="grid gap-4">
                {extendedTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? theme === 'dark'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-500 bg-blue-50'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square">
                      <img
                        src={template.coverImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={() => console.error(`Failed to load cover image: ${template.coverImage}`)}
                      />
                    </div>
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-3 ${
                        theme === 'dark' ? 'bg-black/60' : 'bg-white/60'
                      } backdrop-blur-sm`}
                    >
                      <p
                        className={`text-center font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {template.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4 space-y-6">
              <div
                className={`rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {selectedTemplate.name}
                    </h2>
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings size={18} />
                        {editMode ? 'Preview' : 'Edit'}
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-[600px]"
                      >
                        <Loader2
                          className={`w-12 h-12 animate-spin ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                      >
                        <Swiper
                          ref={swiperRef}
                          modules={[Navigation, Pagination, EffectFade, Autoplay]}
                          effect="fade"
                          navigation={{
                            prevEl: '.swiper-button-prev',
                            nextEl: '.swiper-button-next',
                          }}
                          pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                          }}
                          autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                          }}
                          loop={true}
                          onSlideChange={(swiper: SwiperCore) => setActiveIndex(swiper.realIndex)}
                          className="rounded-xl"
                        >
                          {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                              <div
                                ref={(el) => (slideRefs.current[index] = el)}
                                style={{ ...getSlideDimensions(), margin: '0 auto' }}
                                className="relative mx-auto"
                              >
                                {selectedTemplate.renderSlide(
                                  editMode ? editedSlides[index] : slide,
                                  addLogo,
                                  defaultLogoUrl,
                                  selectedTemplate.colors
                                )}
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        <div
                          className={`swiper-button-prev !hidden lg:!flex !left-0 !text-white ${
                            theme === 'dark' ? '!bg-gray-700/50' : '!bg-gray-200/50'
                          } !z-10`}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </div>
                        <div
                          className={`swiper-button-next !hidden lg:!flex !right-0 !text-white ${
                            theme === 'dark' ? '!bg-gray-700/50' : '!bg-gray-200/50'
                          } !z-10`}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </div>
                        <div
                          className={`swiper-pagination !bottom-4 ${
                            theme === 'dark' ? '!text-white' : '!text-gray-900'
                          } !z-10`}
                        ></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* {editMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl shadow-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <h3
                    className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    Edit Slide {activeIndex + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          value={editedSlides[activeIndex].title || ''}
                          onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300'
                          } border focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          Description
                        </label>
                        <textarea
                          value={editedSlides[activeIndex].description || ''}
                          onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300'
                          } border focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          Background Image
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                            className="hidden"
                            id="background-image"
                          />
                          <label
                            htmlFor="background-image"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            <Upload size={18} />
                            Upload Image
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          Show Logo
                        </label>
                        <input
                          type="checkbox"
                          checked={addLogo}
                          onChange={(e) => setAddLogo(e.target.checked)}
                          className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          Platform
                        </label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
                          className={`w-full px-4 py-2 rounded-lg ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-white border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300'
                          } border focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="instagram">Instagram (1080x1080)</option>
                          <option value="facebook">Facebook (1200x1200)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <motion.button
                      onClick={() => setEditMode(false)}
                      className={`px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveChanges}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )} */}
            </div>
          </div>
        </div>

        {/* Inline CSS for Responsiveness */}
        <style>
          {`
            @media (max-width: 768px) {
              .flex.lg\\:flex-row {
                flex-direction: column;
              }
              .lg\\:w-1\\/4 {
                width: 100%;
                max-height: 40vh;
                overflow-y: auto;
              }
              .lg\\:w-3\\/4 {
                width: 100%;
              }
              .swiper {
                max-height: 60vh;
              }
              .swiper-slide > div {
                transform: scale(0.9); /* Adjusted scale to keep logo visible */
                margin: 0 auto;
              }
            }
            .swiper-button-prev, .swiper-button-next {
              z-index: 10 !important;
            }
            .swiper-pagination {
              z-index: 10 !important;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};