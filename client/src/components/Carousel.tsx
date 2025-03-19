import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useNavigate, useLocation } from 'react-router-dom';

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

export const Carousel: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [updateLog, setUpdateLog] = useState<string[]>([]);
  const swiperRef = useRef<any>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract initial image from navigation state
  const { initialImage } = location.state || {};

  const localImages: Record<string, string[]> = {
    'artificial intelligence': [
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
      '/images/background1.png',
    ],
  };

  const logoUrl = '/images/Logo.png';
  const websiteUrl = 'https://bitrox.tech';
  const socialHandle = '@bitroxtechnologies';
  const footerText = 'bitrox.tech';

  const handleGenerateCarousel = async () => {
    if (!topic) return;

    setLoading(true);

    try {
      const normalizedTopic = topic.toLowerCase().trim();
      const generatedImages = localImages[normalizedTopic] || [];
      if (!generatedImages.length && !initialImage) {
        alert(`No images found for "${topic}". Please try another topic.`);
        return;
      }

      const generatedTexts = [
        {
          tagline: 'Welcome to the Journey',
          title: `${topic.toUpperCase()} OVERVIEW`,
          description: 'Artificial Intelligence is transforming industries and shaping the future of humanity.',
          imageUrl: initialImage || generatedImages[0] || '/images/placeholder.jpg',
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
          title: `Why ${topic} Matters`,
          description: `Discover the importance of Artificial Intelligence in today’s world, from automating tasks to enhancing decision-making processes.`,
          imageUrl: initialImage || generatedImages[1] || '/images/placeholder.jpg',
          headshotUrl: '',
          header: '',
          footer: footerText,
          socialHandle: socialHandle,
          websiteUrl: websiteUrl,
          slideNumber: 2,
          comment: '/images/comment.png',
          save: '/images/save.png',
          like: '/images/like.png',
          overlayGraphic: '/images/graphic.png',
        },
        {
          title: `Top Tips for ${topic}`,
          description: `Follow these expert tips to excel in AI: Stay updated with advancements, learn programming languages like Python, and experiment with machine learning frameworks.`,
          imageUrl: initialImage || generatedImages[2] || '/images/placeholder.jpg',
          headshotUrl: '',
          header: '',
          footer: footerText,
          socialHandle: socialHandle,
          websiteUrl: websiteUrl,
          slideNumber: 3,
          comment: '/images/comment.png',
          save: '/images/save.png',
          like: '/images/like.png',
          overlayGraphic: '/images/graphic.png',
        },
        {
          title: `Future of ${topic}`,
          description: `Explore how Artificial Intelligence will evolve in the coming years, including breakthroughs in robotics, autonomous systems, and ethical AI governance.`,
          imageUrl: initialImage || generatedImages[3] || '/images/placeholder.jpg',
          headshotUrl: '',
          header: '',
          footer: footerText,
          socialHandle: socialHandle,
          websiteUrl: websiteUrl,
          slideNumber: 4,
          comment: '/images/comment.png',
          save: '/images/save.png',
          like: '/images/like.png',
          overlayGraphic: '/images/graphic.png',
        },
        {
          tagline: 'Thanks for Watching',
          title: 'THANK YOU!',
          description: 'Follow us for more insightful content and updates about Artificial Intelligence and its limitless possibilities.',
          imageUrl: initialImage || generatedImages[4] || '/images/placeholder.jpg',
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

      const newSlides = generatedTexts.map((text) => ({
        ...text,
        imageUrl: text.imageUrl,
      }));

      setSlides(newSlides);
      setEditedSlides([...newSlides]);
      setEditMode(true);
      setUpdateLog([...updateLog, `Generated carousel for topic: ${topic}`]);
    } catch (error) {
      console.error('Error generating carousel:', error);
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

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleDownloadCarousel = async () => {
    const zip = new JSZip();
    const promises = slides.map(async (slide, index) => {
      const slideElement = slideRefs.current[index];
      if (slideElement) {
        const canvas = await html2canvas(slideElement, { useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgBase64 = imgData.split(',')[1];
        zip.file(`slide-${index + 1}.png`, imgBase64, { base64: true });
      }
    });

    await Promise.all(promises);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'carousel-slides.zip');
    });
  };

  // Export carousel to PostingPanel
  const handleExportToPost = async () => {
    const imageFiles: File[] = [];
    const promises = slides.map(async (slide, index) => {
      const slideElement = slideRefs.current[index];
      if (slideElement) {
        const canvas = await html2canvas(slideElement, { useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const response = await fetch(imgData);
        const blob = await response.blob();
        const file = new File([blob], `slide-${index + 1}.png`, { type: 'image/png' });
        imageFiles.push(file);
      }
    });

    await Promise.all(promises);

    // Prepare content for PostingPanel
    const content = {
      title: `${topic} Carousel`,
      content: `Check out this amazing carousel about ${topic}!`,
      hashtags: ['#AI', '#Technology', '#Innovation', '#BitroxAI'],
    };

    navigate('/posting-panel', {
      state: {
        contentType: 'post',
        topic,
        content: JSON.stringify(content),
        images: imageFiles, // Pass array of images
      },
    });
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-6">Generate Carousel</h2>
      <div className="mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Artificial Intelligence)"
          className="w-full px-5 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base mb-4"
        />
        <button
          onClick={handleGenerateCarousel}
          disabled={!topic || loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {slides.length > 0 && (
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
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                  {/* Overlay Graphic */}
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

                  {/* Logo */}
                  <div className="absolute top-6 right-6 flex items-center space-x-2">
                    <div className="p-2 rounded-lg">
                      <img src={logoUrl} alt="Logo" className="w-21 h-12" />
                    </div>
                  </div>

                  {/* Slide Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 m-10">
                    <div className="flex flex-col items-left text-left">
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
                      <h2 className="text-5xl font-bold text-green-400 drop-shadow-lg mb-4 leading-tight uppercase tracking-wide transition-all duration-300 hover:text-green-300">
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
              onClick={handleDownloadCarousel}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors duration-300"
            >
              Download Carousel for Instagram
            </button>
            <button
              onClick={handleExportToPost}
              className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-300"
            >
              Export to Post
            </button>
          </div>
        </div>
      )}

      {editMode && slides.length > 0 && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-6">Edit Slide {activeIndex + 1} Content</h3>
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Slide {activeIndex + 1}</h4>
            <div className="grid grid-cols-1 gap-4">
              {activeIndex === 0 || activeIndex === 4 ? (
                <input
                  type="text"
                  value={editedSlides[activeIndex].tagline || ''}
                  onChange={(e) => handleEditChange(activeIndex, 'tagline', e.target.value)}
                  placeholder="Edit Tagline"
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : null}
              <input
                type="text"
                value={editedSlides[activeIndex].title}
                onChange={(e) => handleEditChange(activeIndex, 'title', e.target.value)}
                placeholder="Edit Title"
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={editedSlides[activeIndex].description || ''}
                onChange={(e) => handleEditChange(activeIndex, 'description', e.target.value)}
                placeholder="Edit Description"
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(activeIndex, 'imageUrl', e)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(activeIndex === 0 || activeIndex === 4) && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(activeIndex, 'headshotUrl', e)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              {activeIndex === 4 && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'like', e)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'comment', e)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(activeIndex, 'save', e)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(activeIndex, 'overlayGraphic', e)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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