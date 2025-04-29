import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, Type, FileText, Layout, Settings, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import {
  useGenerateCarouselMutation,
  useUploadImageToCloudinaryMutation,
  useLazyGetCarouselContentQuery,
  useUploadCarouselMutation,
  useUpdatePostMutation,
} from '../../store/api';
import { carouselTemplates, Slide, CarouselTemplate } from '../../templetes/templetesDesign';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...initialSlides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'settings'>('content');

  const defaultLogoUrl = '/images/Logo1.png';
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { contentId, contentType, postContentId } = location.state || {};

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
      
      await updatePost({
        contentId,
        contentType: 'CarouselContent',
        images: [...uploadedImages],
      }).unwrap();

      navigate('/auto', { state: { postContentId } });
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
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
            img.crossOrigin = 'Anonymous';
            img.onload = resolve;
            img.onerror = resolve;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={() => navigate('/auto', { state: { postContentId } })}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back to Posts</span>
          </motion.button>
          
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Carousel Editor
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  prevEl: '.custom-prev',
                  nextEl: '.custom-next',
                }}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                ref={swiperRef}
                className="relative"
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <div
                      ref={(el) => (slideRefs.current[index] = el)}
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      {selectedTemplate.renderSlide(
                        editMode ? editedSlides[index] : slide,
                        addLogo,
                        defaultLogoUrl
                      )}
                    </div>
                  </SwiperSlide>
                ))}
                
                <button className="custom-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button className="custom-next absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </Swiper>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => setEditMode(true)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !editMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={{ scale: editMode ? 1 : 1.05 }}
                disabled={editMode}
              >
                Edit Slides
              </motion.button>
            </div>
          </div>

          {editMode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur rounded-xl p-6"
            >
              <div className="flex gap-4 mb-6">
                {[
                  { id: 'content', icon: <Type className="w-5 h-5" />, label: 'Content' },
                  { id: 'images', icon: <ImageIcon className="w-5 h-5" />, label: 'Images' },
                  { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
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
                    <>
                      <div>
                        <label className="block text-gray-300 mb-2">Tagline</label>
                        <input
                          type="text"
                          value={editedSlides[activeIndex].tagline || ''}
                          onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          value={editedSlides[activeIndex].title || ''}
                          onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Description</label>
                        <textarea
                          value={editedSlides[activeIndex].description || ''}
                          onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'images' && (
                    <>
                      <div>
                        <label className="block text-gray-300 mb-2">Background Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Headshot Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Overlay Graphic</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'settings' && (
                    <>
                      <div className="flex items-center gap-4">
                        <label className="text-gray-300">Add Logo</label>
                        <input
                          type="checkbox"
                          checked={addLogo}
                          onChange={(e) => setAddLogo(e.target.checked)}
                          className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Platform</label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
                          className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="instagram">Instagram (1080x1080)</option>
                          <option value="facebook">Facebook (1200x1200)</option>
                        </select>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <motion.button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isSaving
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/20 text-white'
                }`}
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};