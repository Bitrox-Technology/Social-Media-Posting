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
import { ArrowLeft } from 'lucide-react';

interface TemplateCarouselProps {
  initialTopic: string;
  onImagesGenerated?: (images: string[]) => void;
  onSave?: (updatedSlides: Slide[], updatedImages: string[]) => void;
}

// Extend CarouselTemplate to include a coverImage
interface ExtendedCarouselTemplate extends CarouselTemplate {
  coverImage: string; // URL to an image representing the template
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ initialTopic, onImagesGenerated, onSave }) => {
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

  // Extend templates with cover images (for demo purposes, use the first slide’s imageUrl or a default)
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

  const handleBack = () => {
    navigate('/images');
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
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar: Template List */}
        <div className="w-1/4 pr-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Templates</h2>
          <div className="space-y-4">
            {extendedTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer p-2 rounded-lg border ${
                  selectedTemplate.id === template.id ? 'border-yellow-500 bg-gray-800' : 'border-gray-700'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.coverImage}
                  alt={`${template.name} preview`}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-gray-300 text-sm text-center">{template.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Selected Template Preview */}
        <div className="w-3/4 pl-4">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-yellow-400">Template Preview: {selectedTemplate.name}</h1>
          </div>

          {loading && <p className="text-gray-500">Generating...</p>}

          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
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
                    width: getSlideDimensions().width,
                    height: getSlideDimensions().height,
                    maxWidth: '100%',
                    maxHeight: getSlideDimensions().maxHeight,
                    aspectRatio: getSlideDimensions().aspectRatio,
                    margin: '0 auto',
                    overflow: 'hidden',
                  }}
                >
                  {selectedTemplate.renderSlide(slide, addLogo, defaultLogoUrl)}
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev-custom absolute top-1/2 left-4 text-yellow-400 -translate-y-1/2 z-10">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
              </svg>
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 right-4 text-yellow-400 -translate-y-1/2 z-10">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
              </svg>
            </div>
          </Swiper>

          {editMode && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-2xl font-semibold mb-6">Edit Slide {activeIndex + 1}</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editedSlides[activeIndex].tagline || ''}
                    onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editedSlides[activeIndex].title || ''}
                    onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Description</label>
                  <textarea
                    value={editedSlides[activeIndex].description || ''}
                    onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg h-32"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Headshot Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Overlay Graphic</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Add Logo</label>
                  <input
                    type="checkbox"
                    checked={addLogo}
                    onChange={(e) => setAddLogo(e.target.checked)}
                    className="w-5 h-5 text-yellow-400 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="instagram">Instagram (1080x1080)</option>
                    <option value="facebook">Facebook (1200x1200)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!editMode && onSave && (
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Edit Slides
            </button>
          )}
        </div>
      </div>
    </div>
  );
};