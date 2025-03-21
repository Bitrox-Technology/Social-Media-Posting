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

interface Slide {
  tagline?: string;
  title: string;
  description?: string;
  imageUrl: string;
  headshotUrl: string;
  header: string;
  footer: string;
  socialHandle: string;
  websiteUrl: string;
  slideNumber: number;
  comment?: string;
  like?: string;
  save?: string;
  overlayGraphic?: string;
}

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
}

interface GenerateCarouselResponse {
  statusCode: number;
  data: CarouselContent[];
  message: string;
  success: boolean;
}

export const Carousel: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const [addLogo, setAddLogo] = useState<boolean>(true); // New state for logo toggle
  const defaultLogoUrl = '/images/Logo1.png'; // Default logo URL
  const swiperRef = useRef<SwiperRef>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract initial image and topic from navigation state
  const { initialImage, topic: initialTopic } = location.state || {};

  // Get selectedIdea from Redux store
  const selectedIdea = useSelector((state: RootState) => state.app.selectedIdea);

  // RTK Query mutations
  const [generateCarousel, { isLoading: isGeneratingCarousel }] = useGenerateCarouselMutation();
  const [uploadCarousel, { isLoading: isUploading, error: uploadError }] = useUploadCarouselMutation();

  // Frontend-specific fields
  const localImages: Record<string, string[]> = {
    'artificial intelligence': [
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
    ],
    'default': [
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
    ],
  };
  const websiteUrl = 'https://bitrox.tech';
  const socialHandle = '@bitroxtechnologies';
  const footerText = 'bitrox.tech';

  // Default slides
  const defaultSlides: Slide[] = [
    {
      tagline: 'Welcome to Bitrox',
      title: 'EXPLORE OUR AI SOLUTIONS',
      description: 'Discover how our AI-powered tools can transform your business.',
      imageUrl: localImages['default'][0],
      headshotUrl: '/images/headshot.jpg',
      header: '',
      footer: footerText,
      socialHandle: socialHandle,
      websiteUrl: websiteUrl,
      slideNumber: 1,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
    {
      title: 'Why Choose Bitrox?',
      description: 'We provide cutting-edge technology to help you stay ahead of the competition.',
      imageUrl: localImages['default'][1],
      headshotUrl: '',
      header: '',
      footer: footerText,
      socialHandle: socialHandle,
      websiteUrl: websiteUrl,
      slideNumber: 2,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      title: 'Our Services',
      description: 'From AI analytics to predictive modeling, we’ve got you covered.',
      imageUrl: localImages['default'][2],
      headshotUrl: '',
      header: '',
      footer: footerText,
      socialHandle: socialHandle,
      websiteUrl: websiteUrl,
      slideNumber: 3,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      title: 'Get Started Today',
      description: 'Join thousands of businesses already using Bitrox to innovate.',
      imageUrl: localImages['default'][3],
      headshotUrl: '',
      header: '',
      footer: footerText,
      socialHandle: socialHandle,
      websiteUrl: websiteUrl,
      slideNumber: 4,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      tagline: 'Thank You!',
      title: 'LET’S CONNECT',
      description: 'Follow us for more updates and insights.',
      imageUrl: localImages['default'][4],
      headshotUrl: '/images/headshot.jpg',
      header: '',
      footer: footerText,
      socialHandle: socialHandle,
      websiteUrl: websiteUrl,
      slideNumber: 5,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
  ];

  // Set default slides when the component mounts
  useEffect(() => {
    setSlides(defaultSlides);
    setEditedSlides([...defaultSlides]);
  }, []);

  // Set the topic from initialTopic or selectedIdea.title
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    } else if (selectedIdea?.title) {
      setTopic(selectedIdea.title);
    }
  }, [initialTopic, selectedIdea]);

  // Generate carousel content using the API
  const handleGenerateCarouselContent = async () => {
    if (!topic) {
      alert('Please select a topic or idea to generate carousel content.');
      return;
    }

    setLoading(true);

    try {
      const response: GenerateCarouselResponse = await generateCarousel({ topic }).unwrap();

      if (!response.success || !Array.isArray(response.data) || response.data.length !== 5) {
        throw new Error('Invalid response from the carousel API');
      }

      const generatedContent: CarouselContent[] = response.data;
      console.log('Generated carousel content:', generatedContent);

      const normalizedTopic = topic.toLowerCase().trim();
      const generatedImages = localImages[normalizedTopic] || localImages['default'];
      if (!generatedImages.length && !initialImage) {
        throw new Error(`No images found for "${topic}". Please try another topic.`);
      }

      const generatedSlides: Slide[] = generatedContent.map((content, index) => ({
        tagline: content.tagline,
        title: content.title,
        description: content.description,
        imageUrl: initialImage || (generatedImages[index] || '/images/placeholder.jpg'),
        headshotUrl: index === 0 || index === 4 ? '/images/headshot.jpg' : '',
        header: `Slide ${index + 1} - ${topic}`,
        footer: footerText,
        socialHandle: socialHandle,
        websiteUrl: websiteUrl,
        slideNumber: index + 1,
        comment: '/images/comment.png',
        save: '/images/save.png',
        like: '/images/like.png',
        overlayGraphic: index === 1 || index === 2 || index === 3 ? '/images/graphic.jpg' : '',
      }));

      setSlides(generatedSlides);
      setEditedSlides([...generatedSlides]);
      setEditMode(true);
      setUpdateLog([...updateLog, `Generated carousel content for topic: ${topic}`]);
    } catch (error) {
      console.error('Error generating carousel content:', error);
      alert('Failed to generate carousel content');
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
        setUpdateLog([...updateLog, `Updated Slide ${index + 1}: Changed ${field} to ${file.name}`]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditChange = (index: number, field: keyof Slide, value: string) => {
    const newEditedSlides = [...editedSlides];
    newEditedSlides[index] = { ...newEditedSlides[index], [field]: value };
    setEditedSlides(newEditedSlides);
    setUpdateLog([...updateLog, `Updated Slide ${index + 1}: Changed ${field} to "${value}"`]);
  };

  const handleSaveChanges = () => {
    setSlides([...editedSlides]);
    setUpdateLog([...updateLog, `Saved changes for Slide ${activeIndex + 1}`]);
  };

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.realIndex);
  };

  // Preload all images for a slide to ensure they are available for html2canvas
  const preloadSlideImages = async (slide: Slide): Promise<void> => {
    const imagesToPreload = [
      slide.imageUrl,
      slide.headshotUrl,
      slide.overlayGraphic,
      slide.like,
      slide.comment,
      slide.save,
      addLogo ? defaultLogoUrl : '',
    ].filter(Boolean);
  
    const preloadPromises = imagesToPreload.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url || '';
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    });
  
    await Promise.all(preloadPromises);
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleExportToPost = async () => {
    if (!slides.length) {
      alert('No slides available to export.');
      return;
    }
  
    setLoading(true); // Show loading state
  
    try {
      const formData = new FormData();
  
      // Loop through each slide to capture it as a PNG image
      for (let i = 0; i < slides.length; i++) {
        const slideElement = slideRefs.current[i];
        if (!slideElement) {
          console.error(`Slide ${i + 1} element not found`);
          continue;
        }
  
        // Preload images for the current slide to ensure they render correctly
        await preloadSlideImages(slides[i]);
  
        // Capture the slide as an image using html2canvas
        const canvas = await html2canvas(slideElement, {
          useCORS: true, // Enable CORS for external images
          allowTaint: false, // Prevent tainted canvas errors
          scale: 2, // Higher resolution
          backgroundColor: null, // Preserve transparency if needed
        });
  
        // Convert canvas to a Blob (PNG format)
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), 'image/png')
        );
  
        // Debugging: Log the blob to ensure it's valid
        console.log(`Slide ${i + 1} Blob:`, blob);
  
        // Append the Blob to FormData with the field name 'carouselImages'
        formData.append('images', blob, `slide_${i + 1}.png`);
  
        // Optional: Small delay to ensure rendering completes
        await delay(500);
      }
  
      // Debugging: Log the FormData entries
      for (const [key, value] of formData.entries()) {
        console.log(`FormData Entry - ${key}:`, value);
      }
  
      // Send the FormData with PNG images to the backend
      const result = await uploadCarousel(formData).unwrap();
       // Expecting Cloudinary URLs from the backend
      console.log('Generated Cloudinary URLs:', result);
  
      // Prepare content for the posting panel
      const content = {
        title: `${topic || 'Default'} Carousel`,
        content: `Check out this amazing carousel about ${topic || 'Bitrox'}!`,
        hashtags: ['#AI', '#Technology', '#Innovation', '#BitroxAI'],
      };
  
      // Navigate to the posting panel with the Cloudinary URLs
      console.log('Navigating to posting panel with Cloudinary URLs...');

      setTimeout(()=>{
        navigate('/post', {
          state: {
            contentType: 'post',
            topic: topic || 'Default',
            content: JSON.stringify(content),
            imageDataUrls: result.data, 
          },
        });
      }, 3000)
     
    } catch (error) {
      console.error('Error exporting carousel images:', error);
      alert('Failed to export carousel images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-6">Generate Carousel</h2>
      <div className="mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Predictive Social Media Campaign Outcomes)"
          className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base mb-4"
          disabled={!!selectedIdea}
        />
        <button
          onClick={handleGenerateCarouselContent}
          disabled={loading || isGeneratingCarousel || !topic}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {loading || isGeneratingCarousel ? 'Generating...' : 'Generate Carousel Content'}
        </button>
      </div>

      {/* Logo Toggle Checkbox */}
      <div className="mb-6">
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            checked={addLogo}
            onChange={(e) => setAddLogo(e.target.checked)}
            className="form-checkbox text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          />
          <span>Add Logo to Slides</span>
        </label>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-6">Preview Carousel</h3>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          className="w-full max-w-4xl mx-auto relative"
          onSlideChange={handleSlideChange}
          ref={swiperRef}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                ref={(el) => (slideRefs.current[index] = el)}
                className="relative w-full h-[600px] bg-cover bg-center rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  backgroundColor: '#1e3a8a',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-75"></div>

                {slide.overlayGraphic && (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `url(${slide.overlayGraphic})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                {/* Logo in Top-Right Corner */}
                {addLogo && (
                  <img
                    src={defaultLogoUrl}
                    alt="Logo"
                    className="absolute top-12 right-12 w-30 h-12 object-contain z-10"
                    onError={(e) => console.error('Logo load error:', e)}
                  />
                )}

                <div className="absolute inset-0 flex flex-col justify-between p-8 m-10">
                  <div className="flex flex-col items-left text-left">
                    {slide.header && (
                      <span className="text-sm font-light text-gray-300 mb-2">{slide.header}</span>
                    )}
                    {slide.headshotUrl && (
                      <img
                        src={slide.headshotUrl}
                        alt="Headshot"
                        className="w-16 h-16 rounded-full mb-4 border-2 border-blue-500 transition-all duration-300 hover:border-blue-300"
                      />
                    )}
                    {slide.tagline && (
                      <span className="text-xl font-light text-blue-400 drop-shadow-lg mb-2 transition-all duration-300 hover:text-blue-300">
                        {slide.tagline}
                      </span>
                    )}
                    <h2 className="text-5xl font-bold text-white-400 drop-shadow-lg mb-4 leading-tight uppercase tracking-wide transition-all duration-300 hover:text-green-300">
                      {slide.title}
                    </h2>
                    {slide.description && (
                      <p className="text-lg font-light text-white max-w-md leading-relaxed opacity-90 transition-all duration-300 hover:opacity-100 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                        {slide.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start">
                      <div className="bg-blue-800 text-white text-4xl w-16 h-16 flex items-center justify-center rounded-lg font-bold mb-2">
                        {`0${slide.slideNumber}`}
                      </div>
                      <div className="text-sm space-x-6 flex flex-col items-start">
                        <a
                          href={slide.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-100 transition-colors duration-300"
                        >
                          {slide.footer}
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {index === 4 && (
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex space-x-4">
                            <button className="text-white w-10 h-10 hover:text-blue-300 transition-colors duration-300">
                              <img src={slide.like} alt="Like" />
                            </button>
                            <button className="text-white w-10 h-10 hover:text-red-400 transition-colors duration-300">
                              <img src={slide.comment} alt="Comment" />
                            </button>
                            <button className="text-white w-9 h-10 hover:text-yellow-400 transition-colors duration-300">
                              <img src={slide.save} alt="Save" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
            </svg>
          </div>
        </Swiper>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleExportToPost}
            disabled={isUploading}
            className={`px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-300 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Export to Post'}
          </button>
        </div>
        {uploadError && (
          <p className="text-red-500 mt-2">
            Error: {'Failed to upload images to Cloudinary'}
          </p>
        )}
      </div>

      {editMode && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Edit Slide {activeIndex + 1} Content</h3>
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Slide {activeIndex + 1}</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Header</label>
                <input
                  type="text"
                  value={editedSlides[activeIndex].header || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'header', e.target.value)}
                  placeholder="Edit Header"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {(activeIndex === 0 || activeIndex === 4) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editedSlides[activeIndex].tagline || ''}
                    onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                    placeholder="Edit Tagline"
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editedSlides[activeIndex].title}
                  onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                  placeholder="Edit Title"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={editedSlides[activeIndex].description || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                  placeholder="Edit Description"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {(activeIndex === 0 || activeIndex === 4) && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Headshot Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {activeIndex === 4 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Like Icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'like', e)}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Comment Icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'comment', e)}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Save Icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(activeIndex, 'save', e)}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Overlay Graphic</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Update Log</h4>
            <ul className="list-disc list-inside text-sm">
              {updateLog.map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors duration-300"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="ml-4 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};