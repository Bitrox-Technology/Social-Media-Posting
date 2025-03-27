import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as SwiperCore } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGenerateCarouselMutation, useUploadCarouselMutation } from '../store/api';
import { carouselTemplates, Slide, CarouselTemplate } from '../templetes/templetesDesign';
import { ArrowLeft } from 'lucide-react';

export const Carousel: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<CarouselTemplate>(carouselTemplates[0]);
  const [slides, setSlides] = useState<Slide[]>(carouselTemplates[0].slides);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...carouselTemplates[0].slides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const defaultLogoUrl = '/images/Logo1.png';
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { initialImage, topic: initialTopic, template: initialTemplate, generatedImageUrl } = location.state || {};
  const selectedIdea = useSelector((state: RootState) => state.app.selectedIdea);
  const [generateCarousel] = useGenerateCarouselMutation();
  const [uploadCarousel, { isLoading: isUploading }] = useUploadCarouselMutation();

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    else if (selectedIdea?.title) setTopic(selectedIdea.title);

    if (initialTemplate) {
      const template = carouselTemplates.find((t) => t.id === initialTemplate) || carouselTemplates[0];
      setSelectedTemplate(template);
      setSlides(template.slides);
      setEditedSlides([...template.slides]);
    }
  }, [initialTopic, selectedIdea, initialTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const newTemplate = carouselTemplates.find((t) => t.id === templateId) || carouselTemplates[0];
    setSelectedTemplate(newTemplate);
    setSlides(newTemplate.slides);
    setEditedSlides([...newTemplate.slides]);
  };

  const handleGenerateCarouselContent = async () => {
    if (!topic) {
      alert('Please enter a topic.');
      return;
    }
    setLoading(true);
    try {
      const response = await generateCarousel({ topic }).unwrap();
      const generatedContent = response.data;

      const newSlides: Slide[] = selectedTemplate.slides.map((slide, index) => {
        const content = generatedContent[index] || {};
        let formattedDescription = content.description || slide.description;

        // Check if description starts with a number followed by a dot (e.g., "1.")
        if ((formattedDescription ?? '').trim().match(/^\d+\./)) {
          formattedDescription = (formattedDescription || '').split(/,\s*\d+\./) // Split by ", <number>."
            .map((item, i) => {
              const cleanItem = item.replace(/^\s*\d+\.\s*/, '').trim(); // Remove leading number if present
              return i === 0 ? cleanItem : `${i + 1}. ${cleanItem}`; // Re-add number with proper formatting
            })
            .join('\n')
            .replace(/^\s+/, ''); // Remove leading whitespace
        }

        return {
          ...slide,
          tagline: content.tagline || slide.tagline,
          title: content.title || slide.title,
          description: formattedDescription,
          imageUrl: generatedImageUrl || slide.imageUrl,
        };
      });

      setSlides(newSlides);
      setEditedSlides([...newSlides]);
      setEditMode(true);
      setUpdateLog([...updateLog, `Generated new carousel content for "${topic}"`]);
    } catch (error) {
      console.error('Error generating carousel:', error);
      alert('Failed to generate carousel.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (index: number, field: keyof Slide, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newEditedSlides = [...editedSlides];
        newEditedSlides[index] = { ...newEditedSlides[index], [field]: reader.result as string };
        setEditedSlides(newEditedSlides);
        setUpdateLog([...updateLog, `Updated Slide ${index + 1}: ${field} to "${file.name}"`]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (index: number, field: keyof Slide, value: string) => {
    const newEditedSlides = [...editedSlides];
    newEditedSlides[index] = { ...newEditedSlides[index], [field]: value };
    setEditedSlides(newEditedSlides);
    setUpdateLog([...updateLog, `Updated Slide ${index + 1}: ${field} to "${value}"`]);
  };

  const handleSaveChanges = () => {
    setSlides([...editedSlides]);
    setUpdateLog([...updateLog, `Saved changes for Slide ${activeIndex + 1}`]);
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

  const handleExportToPost = async () => {
    if (!slides.length) return;
    setLoading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < slides.length; i++) {
        const slideElement = slideRefs.current[i];
        if (!slideElement) continue;
        await preloadSlideImages(slides[i]);
        const canvas = await html2canvas(slideElement, { useCORS: true, scale: 2 });
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
        formData.append('images', blob, `slide_${i + 1}.png`);
      }
      const result = await uploadCarousel(formData).unwrap();
      navigate('/post', {
        state: {
          contentType: 'post',
          topic,
          content: JSON.stringify({
            title: `${topic} Carousel`,
            content: `Check out this carousel about ${topic}!`,
            hashtags: ['#AI', '#Technology'],
          }),
          imageDataUrls: result.data,
        },
      });
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export carousel.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/images', { state: { generatedImageUrl } });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back to Image Generator</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Create Carousel
          </h1>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mb-8 border border-gray-700 space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic"
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={selectedTemplate.id}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
          >
            {carouselTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={addLogo}
                onChange={(e) => setAddLogo(e.target.checked)}
                className="w-5 h-5 text-yellow-400 border-gray-600"
              />
              <span>Add Logo</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as 'instagram' | 'facebook')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              <option value="instagram">Instagram (1080x1080)</option>
              <option value="facebook">Facebook (1200x1200)</option>
            </select>
          </div>
          <button
            onClick={handleGenerateCarouselContent}
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Generating...' : 'Generate Carousel Content'}
          </button>
        </div>

        {/* Swiper Carousel */}
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

        {/* Export Button */}
        <button
          onClick={handleExportToPost}
          disabled={isUploading}
          className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition-all duration-300 mb-8"
        >
          {isUploading ? 'Uploading...' : 'Export to Post'}
        </button>

        {/* Edit Mode */}
        {editMode && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6">Edit Slide {activeIndex + 1}</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-gray-300 mb-1">Header</label>
                <input
                  type="text"
                  value={editedSlides[activeIndex].header || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'header', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editedSlides[activeIndex].tagline || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editedSlides[activeIndex].title}
                  onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={editedSlides[activeIndex].description || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg h-32 focus:ring-2 focus:ring-yellow-400"
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
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Toggle */}
        {!editMode && slides.length > 0 && (
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-300"
          >
            Edit Slides
          </button>
        )}

        {/* Update Log */}
        {updateLog.length > 0 && (
          <div className="mt-6 bg-gray-800/50 backdrop-blur-md rounded-lg p-3 border border-gray-700 max-h-32 overflow-y-auto">
            <h3 className="text-md font-semibold mb-1">Update Log</h3>
            <ul className="list-disc pl-3 text-gray-300 text-xs">
              {updateLog.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};