import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { carouselTemplates, Slide, CarouselTemplate } from '../../templetes/templetesDesign';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext'; // Adjust path as needed

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
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedCarouselTemplate>(
    { ...carouselTemplates[0], coverImage: carouselTemplates[0].slides[0]?.imageUrl || '/images/default-cover.jpg' }
  );
  const [slides, setSlides] = useState<Slide[]>(selectedTemplate.slides);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...slides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const defaultLogoUrl = '/images/Logo1.png';
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const extendedTemplates: ExtendedCarouselTemplate[] = carouselTemplates.map((template) => ({
    ...template,
    coverImage: template.coverImageUrl || '/images/default-cover.jpg',
  }));

  useEffect(() => {
    if (onImagesGenerated) {
      captureScreenshots(slides).then((images) => onImagesGenerated(images));
    }
  }, [onImagesGenerated]);

  const handleTemplateSelect = (template: ExtendedCarouselTemplate) => {
    setSelectedTemplate(template);
    setSlides(template.slides);
    setEditedSlides([...template.slides]);
  };

  const captureScreenshots = async (slidesToCapture: Slide[]) => {
    const images: string[] = [];
    for (let i = 0; i < slidesToCapture.length; i++) {
      const slideElement = slideRefs.current[i];
      if (!slideElement) continue;
      await preloadSlideImages(slidesToCapture[i]);
      const canvas = await html2canvas(slideElement, { useCORS: true, scale: 2 });
      const image = canvas.toDataURL('image/png');
      images.push(image);
    }
    return images;
  };

  const handleImageUpload = (index: number, field: keyof Slide, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEditedSlides = [...editedSlides];
        newEditedSlides[index] = { ...newEditedSlides[index], [field]: reader.result as string };
        setEditedSlides(newEditedSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (index: number, field: keyof Slide, value: string) => {
    const newEditedSlides = [...editedSlides];
    newEditedSlides[index] = { ...newEditedSlides[index], [field]: value };
    setEditedSlides(newEditedSlides);
  };

  const handleSaveChanges = async () => {
    setSlides([...editedSlides]);
    const updatedImages = await captureScreenshots(editedSlides);
    if (onSave) {
      onSave(editedSlides, updatedImages);
    }
    setEditMode(false);
  };

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.realIndex);
  };

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
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };


  const getSlideDimensions = () => {
    const baseDimensions = platform === 'instagram' ? { width: 1080, height: 1080 } : { width: 1200, height: 1200 };
    return {
      width: `${baseDimensions.width}px`,
      height: `${baseDimensions.height}px`,
      maxHeight: '70vh',
      aspectRatio: '1 / 1',
    };
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
      } text-gray-800`}
    >
      <div className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1
            className={`text-4xl font-bold ${
              theme === 'dark'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600'
                : 'text-gray-900'
            }`}
          >
            Template Carousel
          </h1>
        </header>

        <div className="flex gap-8">
          {/* Left Sidebar: Template List */}
          <aside
            className={`w-1/4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-6 rounded-xl shadow-lg overflow-y-auto`}
            style={{ maxHeight: '80vh' }}
          >
            <h2
              className={`text-2xl font-semibold mb-6 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-amber-600'
              }`}
            >
              Templates
            </h2>
            <div className="space-y-4">
              {extendedTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  className={`cursor-pointer p-3 rounded-xl border transition-all ${
                    selectedTemplate.id === template.id
                      ? `${theme === 'dark' ? 'border-yellow-500 bg-gray-700' : 'border-amber-500 bg-gray-100'}`
                      : `${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img
                    src={template.coverImage}
                    alt={`${template.name} preview`}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <p
                    className={`text-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } text-base font-medium`}
                  >
                    {template.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </aside>

          {/* Right Side: Selected Template Preview */}
          <main className="w-3/4">
            <div className="mb-6 flex justify-between items-center">
              <h2
                className={`text-2xl font-semibold ${
                  theme === 'dark'
                    ? 'text-white'
                    : 'text-gray-800'
                }`}
              >
                Preview: {selectedTemplate.name}
              </h2>
              {!editMode && onSave && (
                <motion.button
                  onClick={() => setEditMode(true)}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Slides
                </motion.button>
              )}
            </div>

            {loading && (
              <div className="flex items-center justify-center">
                <Loader2
                  className={`w-12 h-12 animate-spin ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
                />
              </div>
            )}

            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={handleSlideChange}
              ref={swiperRef}
              className="mb-8"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => (slideRefs.current[index] = el)}
                    style={{
                      ...getSlideDimensions(),
                      margin: '0 auto',
                      overflow: 'hidden',
                    }}
                    className={`rounded-xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    {selectedTemplate.renderSlide(slide, addLogo, defaultLogoUrl)}
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-button-prev-custom absolute top-1/2 left-4 -translate-y-1/2 z-10">
                <motion.button
                  className={`w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all ${
                    theme === 'dark' ? '' : 'text-gray-800'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
                  </svg>
                </motion.button>
              </div>
              <div className="swiper-button-next-custom absolute top-1/2 right-4 -translate-y-1/2 z-10">
                <motion.button
                  className={`w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all ${
                    theme === 'dark' ? '' : 'text-gray-800'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
                  </svg>
                </motion.button>
              </div>
            </Swiper>

            {editMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-8 p-6 rounded-xl shadow-lg ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3
                  className={`text-2xl font-semibold mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Edit Slide {activeIndex + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={editedSlides[activeIndex].tagline || ''}
                      onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
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
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={editedSlides[activeIndex].description || ''}
                      onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 h-32`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Background Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Headshot Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Overlay Graphic
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Add Logo
                    </label>
                    <input
                      type="checkbox"
                      checked={addLogo}
                      onChange={(e) => setAddLogo(e.target.checked)}
                      className={`w-5 h-5 ${
                        theme === 'dark'
                          ? 'text-yellow-400 border-gray-600'
                          : 'text-amber-600 border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className={`block mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
                      className={`w-full px-4 py-2 rounded-lg ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="instagram">Instagram (1080x1080)</option>
                      <option value="facebook">Facebook (1200x1200)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <motion.button
                    onClick={handleSaveChanges}
                    className={`px-6 py-3 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={() => setEditMode(false)}
                    className={`px-6 py-3 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};