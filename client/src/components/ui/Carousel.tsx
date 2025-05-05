import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Image as ImageIcon,
  Type,
  Sparkles,
  Settings,
  Save,
  ImagePlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  useGenerateCarouselMutation,
  useUploadImageToCloudinaryMutation,
  useLazyGetCarouselContentQuery,
  useUploadCarouselMutation,
  useUpdatePostMutation,
} from '../../store/api';
import { carouselTemplates, Slide, CarouselTemplate } from '../../templetes/templetesDesign';

interface CarouselProps {
  initialTopic: string;
  template: string;
  slides: Slide[];
  onImagesGenerated?: (images: string[]) => void;
  onSave?: (updatedSlides: Slide[], images: string[]) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  initialTopic,
  template,
  slides: initialSlides,
  onImagesGenerated,
  onSave,
}) => {
  const [topic, setTopic] = useState<string>(initialTopic);
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate>(
    carouselTemplates.find((t) => t.id === template) || carouselTemplates[0]
  );
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [loading, setLoading] = useState<boolean>(true);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...initialSlides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'settings'>('content');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Adjust based on your app's theme logic

  const defaultLogoUrl = '/images/Logo1.png';
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { contentId, contentType, postContentId, logoUrl: stateLogoUrl } = location.state || {};
  const logoUrl = stateLogoUrl || defaultLogoUrl;

  const [generateCarousel] = useGenerateCarouselMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [getCarouselContent] = useLazyGetCarouselContentQuery();
  const [uploadCarousel] = useUploadCarouselMutation();
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    const fetchCarouselContent = async () => {
      if (contentId && contentType === 'CarouselContent') {
        try {
          const response = await getCarouselContent({ contentId }).unwrap();
          const data = response.data;

          if (data.templateId && Array.isArray(data.content)) {
            const newTemplate = carouselTemplates.find((t) => t.id === data.templateId) || carouselTemplates[0];
            setSelectedTemplate(newTemplate);
            setTopic(data.topic || initialTopic);

            const updatedSlides = data.content.map((contentItem: any, index: number) => ({
              ...newTemplate.slides[index],
              ...contentItem,
              slideNumber: index + 1,
            }));

            setSlides(updatedSlides);
            setEditedSlides([...updatedSlides]);
            await Promise.all(updatedSlides.map((slide: Slide) => preloadSlideImages(slide)));
          }
        } catch (error) {
          console.error('Error fetching content:', error);
          initializeSlides();
        }
      } else {
        initializeSlides();
      }
      setLoading(false);
    };

    fetchCarouselContent();
  }, [contentId, contentType]);

  const initializeSlides = async () => {
    const templateToUse = carouselTemplates.find((t) => t.id === template) || carouselTemplates[0];
    setSelectedTemplate(templateToUse);

    const updatedSlides = templateToUse.slides.map((slide, index) => ({
      ...slide,
      ...initialSlides[index],
      slideNumber: index + 1,
    }));

    setSlides(updatedSlides);
    setEditedSlides([...updatedSlides]);
    await Promise.all(updatedSlides.map((slide: Slide) => preloadSlideImages(slide)));
  };

  const preloadSlideImages = async (slide: Slide) => {
    const images = [
      slide.imageUrl,
      slide.headshotUrl,
      slide.overlayGraphic,
      slide.like,
      slide.comment,
      slide.save,
      addLogo ? logoUrl : '',
    ].filter(Boolean);

    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(undefined);
            img.onerror = () => {
              console.error(`Failed to preload image: ${url}`);
              resolve(undefined);
            };
          })
      )
    );
  };

  const captureScreenshots = async (slidesToCapture: Slide[]) => {
    const images: string[] = [];
    for (let i = 0; i < slidesToCapture.length; i++) {
      const slideElement = slideRefs.current[i];
      if (!slideElement) continue;

      await preloadSlideImages(slidesToCapture[i]);
      const canvas = await html2canvas(slideElement, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, `carousel-slide-${i + 1}.png`);
      const result = await uploadImageToCloudinary(formData).unwrap();
      if (result?.data?.secure_url) {
        images.push(result.data.secure_url);
      }
    }
    return images;
  };

  const handleEditChange = (index: number, field: keyof Slide, value: string) => {
    setEditedSlides((prev) => {
      const newSlides = [...prev];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return newSlides;
    });
  };

  const handleImageUpload = async (index: number, field: keyof Slide, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      const result = await uploadImageToCloudinary(formData).unwrap();

      if (result?.data?.secure_url) {
        handleEditChange(index, field, result.data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await Promise.all(editedSlides.map((slide: Slide) => preloadSlideImages(slide)));
      const screenshots = await captureScreenshots(editedSlides);

      const uploadedImages = await Promise.all(
        screenshots.map(async (screenshot, index) => {
          const blob = await (await fetch(screenshot)).blob();
          const formData = new FormData();
          formData.append('file', blob, `slide-${index}.png`);

          const response = await uploadCarousel(formData).unwrap();
          return {
            url: response.data.url,
            label: `Carousel Slide ${index + 1}`,
          };
        })
      );

      setSlides([...editedSlides]);

      if (onSave) {
        onSave(editedSlides, uploadedImages.map((img) => img.url));
      }

      await updatePost({
        contentId,
        contentType: 'CarouselContent',
        images: [...uploadedImages],
      }).unwrap();

      navigate('/auto', { state: { postContentId } });
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save carousel. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSlideDimensions = () => {
    return {
      width: platform === 'instagram' ? '1080px' : '1200px',
      height: platform === 'instagram' ? '1080px' : '1200px',
      maxWidth: '100%',
      maxHeight: '100%',
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/auto', { state: { postContentId } })}
              className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </motion.button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Carousel Editor
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Slide {activeIndex + 1} of {slides.length}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <Swiper
                  modules={[Navigation, Pagination, EffectFade, Autoplay]}
                  effect="fade"
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  loop
                  className="carousel-swiper"
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                  {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div
                        ref={(el) => (slideRefs.current[index] = el)}
                        style={getSlideDimensions()}
                        className="mx-auto"
                      >
                        {selectedTemplate.renderSlide(
                          editMode ? editedSlides[index] : slide,
                          addLogo,
                          logoUrl
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </motion.div>

          {/* Editor Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex gap-2 mb-6">
              {[
                { id: 'content', icon: <Type />, label: 'Content' },
                { id: 'images', icon: <ImagePlus />, label: 'Images' },
                { id: 'settings', icon: <Settings />, label: 'Settings' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Tagline</label>
                      <input
                        type="text"
                        value={editedSlides[activeIndex].tagline || ''}
                        onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter slide tagline..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Title</label>
                      <input
                        type="text"
                        value={editedSlides[activeIndex].title || ''}
                        onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter slide title..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Description</label>
                      <textarea
                        value={editedSlides[activeIndex].description || ''}
                        onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all h-32 resize-none"
                        placeholder="Enter slide description..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Background Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                          className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Profile Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                          className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <label className="text-gray-300">Show Logo</label>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={addLogo}
                          onChange={(e) => setAddLogo(e.target.checked)}
                          className="sr-only peer"
                          id="logo-toggle"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Platform</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
                        className="w-full px-4 py-3 bg-gray-700/50 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="instagram">Instagram (1080x1080)</option>
                        <option value="facebook">Facebook (1200x1200)</option>
                      </select>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                isSaving
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/20'
              }`}
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: isSaving ? 1 : 0.98 }}
            >
              {isSaving ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};