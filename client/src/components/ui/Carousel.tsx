import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { useGenerateCarouselMutation, useUploadImageToCloudinaryMutation } from '../../store/api';
import { carouselTemplates, Slide, CarouselTemplate } from '../../templetes/templetesDesign';
import { ArrowLeft } from 'lucide-react';

interface CarouselProps {
  initialTopic: string;
  template: string;
  slides: Slide[];
  onImagesGenerated?: (images: string[]) => void;
  onSave?: (updatedSlides: Slide[], ref: HTMLDivElement) => void; // Updated to include ref
}

export const Carousel: React.FC<CarouselProps> = ({ initialTopic, template, slides: initialSlides, onImagesGenerated, onSave }) => {
  const [topic] = useState<string>(initialTopic);
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate>(
    carouselTemplates.find((t) => t.id === template) || carouselTemplates[0]
  );
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...initialSlides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const defaultLogoUrl = '/images/Logo1.png';
  const swiperRef = useRef<SwiperRef>(null);
  const carouselRef = useRef<HTMLDivElement>(null); // Added for entire carousel screenshot
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();

  const [generateCarousel] = useGenerateCarouselMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();

  useEffect(() => {
    const newTemplate = carouselTemplates.find((t) => t.id === template) || carouselTemplates[0];
    setSelectedTemplate(newTemplate);
  }, [template]);

  useEffect(() => {
    if (onImagesGenerated) {
      generateAndCaptureScreenshots();
    }
  }, [onImagesGenerated]);

  const generateAndCaptureScreenshots = async () => {
    setLoading(true);
    try {
      const response = await generateCarousel({ topic }).unwrap();
      const generatedContent = response.data;

      const newSlides: Slide[] = selectedTemplate.slides.map((slide, index) => {
        const content = generatedContent[index] || {};
        let formattedDescription = content.description || slide.description;

        if ((formattedDescription ?? '').trim().match(/^\d+\./)) {
          formattedDescription = (formattedDescription || '')
            .split(/,\s*\d+\./)
            .map((item, i) => {
              const cleanItem = item.replace(/^\s*\d+\.\s*/, '').trim();
              return i === 0 ? cleanItem : `${i + 1}. ${cleanItem}`;
            })
            .join('\n')
            .replace(/^\s+/, '');
        }

        return {
          ...slide,
          tagline: content.tagline || slide.tagline,
          title: content.title || slide.title,
          description: formattedDescription,
          imageUrl: slide.imageUrl,
        };
      });

      setSlides(newSlides);
      setEditedSlides([...newSlides]);

      const images = await captureScreenshots(newSlides);
      if (onImagesGenerated) {
        onImagesGenerated(images);
      }
    } catch (error) {
      console.error('Error generating carousel:', error);
      alert('Failed to generate carousel.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const newTemplate = carouselTemplates.find((t) => t.id === templateId) || carouselTemplates[0];
    setSelectedTemplate(newTemplate);

    const updatedSlides = newTemplate.slides.map((slide, index) => {
      const existingSlide = slides[index] || {};
      return {
        ...slide,
        tagline: existingSlide.tagline || slide.tagline,
        title: existingSlide.title || slide.title,
        description: existingSlide.description || slide.description,
        imageUrl: existingSlide.imageUrl || slide.imageUrl || '',
      };
    });
    setSlides(updatedSlides);
    setEditedSlides([...updatedSlides]);
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
      const cloudinaryUrl = result?.data?.secure_url;
      if (cloudinaryUrl) {
        images.push(cloudinaryUrl);
      }
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
    if (onSave && carouselRef.current) {
      onSave(editedSlides, carouselRef.current); // Pass the entire carousel ref
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
    navigate('/auto-post-creator'); // Updated to match navigation flow
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
    <div className="bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto" ref={carouselRef}>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-yellow-400">Carousel Editor</h1>
        </div>

        {loading && <p className="text-gray-500">Generating...</p>}

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Select Template</label>
          <select
            value={selectedTemplate.id}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            {carouselTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

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
  );
};