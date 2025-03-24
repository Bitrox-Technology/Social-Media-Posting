// src/components/Carousel.tsx
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
  const defaultLogoUrl = '/images/Logo1.png';
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { initialImage, topic: initialTopic, template: initialTemplate, generatedImageUrl } = location.state || {};
  const selectedIdea = useSelector((state: RootState) => state.app.selectedIdea);
  const [generateCarousel] = useGenerateCarouselMutation();
  const [uploadCarousel, { isLoading: isUploading }] = useUploadCarouselMutation();

  const localImages: Record<string, string[]> = {
    'artificial intelligence': Array(5).fill('/images/background1.png'),
    'default': Array(5).fill('/images/background1.png'),
  };

  useEffect(() => {
    // Set topic from initialTopic or selectedIdea
    if (initialTopic) setTopic(initialTopic);
    else if (selectedIdea?.title) setTopic(selectedIdea.title);

    // Set the initial template from navigation state if provided
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
      const normalizedTopic = topic.toLowerCase().trim();
      const generatedImages = localImages[normalizedTopic] || localImages['default'];

      const generatedSlides: Slide[] = generatedContent.map((content: any, index: number) => ({
        ...selectedTemplate.slides[index],
        tagline: content.tagline || selectedTemplate.slides[index].tagline,
        title: content.title || selectedTemplate.slides[index].title,
        description: content.description || selectedTemplate.slides[index].description,
        imageUrl: initialImage || generatedImages[index] || selectedTemplate.slides[index].imageUrl,
        headshotUrl: selectedTemplate.slides[index].headshotUrl,
        header: `Slide ${index + 1} - ${topic}`,
        footer: selectedTemplate.slides[index].footer,
        socialHandle: selectedTemplate.slides[index].socialHandle,
        websiteUrl: selectedTemplate.slides[index].websiteUrl,
        slideNumber: index + 1,
        comment: selectedTemplate.slides[index].comment,
        save: selectedTemplate.slides[index].save,
        like: selectedTemplate.slides[index].like,
        overlayGraphic: selectedTemplate.slides[index].overlayGraphic,
      }));

      setSlides(generatedSlides);
      setEditedSlides([...generatedSlides]);
      setEditMode(true);
      setUpdateLog([...updateLog, `Generated carousel for ${topic}`]);
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
        setUpdateLog([...updateLog, `Updated Slide ${index + 1}: ${field} to ${file.name}`]);
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
    // Corrected navigation path to match ImageGenerator route
    navigate('/images', { state: { generatedImageUrl } });
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Template Selection
          </button>
        </div>
        <h2 className="text-2xl font-semibold">Generate Carousel</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic"
          className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg mb-4"
        />
        <select
          value={selectedTemplate.id}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg mb-4"
        >
          {carouselTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerateCarouselContent}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Carousel'}
        </button>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={addLogo}
            onChange={(e) => setAddLogo(e.target.checked)}
            className="form-checkbox text-blue-500"
          />
          <span>Add Logo</span>
        </label>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
        ref={swiperRef}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div ref={(el) => (slideRefs.current[index] = el)}>
              {selectedTemplate.renderSlide(slide, addLogo, defaultLogoUrl)}
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev-custom absolute top-1/2 left-4 text-white -translate-y-1/2">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 right-4 text-white -translate-y-1/2">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
          </svg>
        </div>
      </Swiper>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleExportToPost}
          disabled={isUploading}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Export to Post'}
        </button>
      </div>

      {editMode && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Edit Slide {activeIndex + 1}</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              value={editedSlides[activeIndex].header || ''}
              onChange={(e) => handleEditChange(activeIndex, 'header', e.target.value)}
              placeholder="Header"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="text"
              value={editedSlides[activeIndex].tagline || ''}
              onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
              placeholder="Tagline"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="text"
              value={editedSlides[activeIndex].title}
              onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
            <textarea
              value={editedSlides[activeIndex].description || ''}
              onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
              placeholder="Description"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg h-24"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleSaveChanges}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};