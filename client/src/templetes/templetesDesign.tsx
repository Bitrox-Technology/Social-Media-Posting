// src/templates/templates.ts
import React from 'react';

export interface Slide {
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

export interface CarouselTemplate {
  id: string;
  name: string;
  slides: Slide[];
  renderSlide: (slide: Slide, addLogo: boolean, defaultLogoUrl: string) => JSX.Element;
}

// Template 1: Modern Overlay (Your Original Design with 5 Slides)
const Template1: CarouselTemplate = {
  id: 'template1',
  name: 'Modern Overlay',
  slides: [
    {
      tagline: 'Welcome to Bitrox',
      title: 'EXPLORE OUR AI SOLUTIONS',
      description: 'Discover how our AI-powered tools can transform your business.',
      imageUrl: '/images/background1.png',
      headshotUrl: '/images/headshot.jpg',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
    {
      title: 'Why Choose Bitrox?',
      description: 'Cutting-edge tech to stay ahead.',
      imageUrl: '/images/background1.png',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 2,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      title: 'Our Services',
      description: 'AI analytics to predictive modeling.',
      imageUrl: '/images/background1.png',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 3,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      title: 'Get Started Today',
      description: 'Join thousands innovating with Bitrox.',
      imageUrl: '/images/background1.png',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 4,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '/images/graphic.jpg',
    },
    {
      tagline: 'Thank You!',
      title: 'LET’S CONNECT',
      description: 'Follow us for updates.',
      imageUrl: '/images/background1.png',
      headshotUrl: '/images/headshot.jpg',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 5,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
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
          }}
        />
      )}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-30 h-12 object-contain z-10"
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-8 m-10">
        <div className="flex flex-col items-left text-left">
          {slide.header && <span className="text-sm font-light text-gray-300 mb-2">{slide.header}</span>}
          {slide.headshotUrl && (
            <img src={slide.headshotUrl} alt="Headshot" className="w-16 h-16 rounded-full mb-4 border-2 border-blue-500" />
          )}
          {slide.tagline && (
            <span className="text-xl font-light text-blue-400 drop-shadow-lg mb-2">{slide.tagline}</span>
          )}
          <h2 className="text-5xl font-bold text-white drop-shadow-lg mb-4 uppercase tracking-wide">
            {slide.title}
          </h2>
          {slide.description && (
            <p className="text-lg font-light text-white max-w-md bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              {slide.description}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-start">
            <div className="bg-blue-800 text-white text-4xl w-16 h-16 flex items-center justify-center rounded-lg font-bold mb-2">
              {`0${slide.slideNumber}`}
            </div>
            <a href={slide.websiteUrl} className="text-blue-300">{slide.footer}</a>
          </div>
          {slide.slideNumber === 5 && (
            <div className="flex space-x-4">
              <img src={slide.like} alt="Like" className="w-10 h-10" />
              <img src={slide.comment} alt="Comment" className="w-10 h-10" />
              <img src={slide.save} alt="Save" className="w-9 h-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  ),
};

// Template 2: Minimalist Design with 5 Slides
const Template2: CarouselTemplate = {
    id: 'template-social-media',
    name: 'Social Media Growth Hacks',
    slides: [
      {
        title: 'Growth Hacks for Your Social Media Business',
        description: '',
        imageUrl: '/images/background3.png', // Replace with actual image URL
        headshotUrl: '', // Not used in this slide
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 1,
        comment: '',
        save: '',
        like: '',
        overlayGraphic: '',
      },
      {
        title: 'Content is King, Engagement is Queen',
        description: "It's not enough to just create content; you need to create content that resonates with your audience and sparks engagement.",
        imageUrl: '/images/background3.png', // Replace with actual image URL
        headshotUrl: '', // Not used in this slide
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 2,
        comment: '',
        save: '',
        like: '',
        overlayGraphic: '',
      },
      {
        title: 'Leverage the Power of Collaboration',
        description: 'Partner with influencers in your niche to reach a wider audience.\n\nLook for creators who align with your brand values and have a strong following.\n\nCo-create content, host giveaways, or do shoutouts to tap into their audience and gain new followers.',
        imageUrl: '/images/background3.png', // Replace with actual image URL
        headshotUrl: '', // Not used in this slide
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 3,
        comment: '',
        save: '',
        like: '',
        overlayGraphic: '',
      },
      {
        title: 'Hashtag Hero',
        description: 'Hashtags are a powerful tool for discovery on social media. Research relevant hashtags for your industry and target audience.\n\nUse a mix of popular and niche hashtags to increase your reach without getting lost in the noise.\n\nTrack which hashtags perform best and adapt your strategy accordingly.',
        imageUrl: '/images/background3.png', // Replace with actual image URL
        headshotUrl: '', // Not used in this slide
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 4,
        comment: '',
        save: '',
        like: '',
        overlayGraphic: '',
      },
      {
        title: 'FOLLOW ME FOR MORE',
        description: '',
        imageUrl: '/images/background3.png', // Replace with actual image URL
        headshotUrl: '', // Replace with actual avatar URL if needed
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 5,
        comment: '',
        save: '',
        like: '',
        overlayGraphic: '',
      },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl) => (
      <div
        className="relative w-full h-[600px] md:h-[700px] bg-cover bg-center rounded-lg overflow-hidden flex flex-col justify-between text-white"
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
  
        {/* Logo (Top-Right) */}
        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
          />
        )}
  
        {/* Content Section (Left-Aligned) */}
        <div className="relative z-10 flex flex-col items-start justify-center flex-grow p-6 md:p-10">
          <h2
            className={`text-left font-bold mb-4 leading-tight ${
              slide.slideNumber === 1 || slide.slideNumber === 5
                ? 'text-4xl md:text-6xl'
                : 'text-3xl md:text-5xl'
            }`}
          >
            {slide.title}
          </h2>
          {slide.description && (
            <p className="text-base md:text-xl max-w-md text-left leading-relaxed whitespace-pre-line">
              {slide.description}
            </p>
          )}
        </div>
  
        {/* Bottom Section */}
        <div className="relative z-10 flex flex-col items-end pb-6 md:pb-10 px-6 md:px-10">
          {/* Navigation Button (Right-Aligned) */}
          <button className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center justify-center mb-4 hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
  
          {/* Social Handle (Left Side, Slide 5 Only) */}
          {slide.slideNumber === 5 && (
            <div className="absolute left-6 md:left-10 bottom-6 md:bottom-32 flex flex-col items-start">
              <h3 className="text-xl md:text-2xl font-bold text-left">{slide.socialHandle.replace('@', '')}</h3>
              <p className="text-teal-500 text-sm md:text-base text-left">{slide.socialHandle}</p>
            </div>
          )}
  
          {/* Website URL (Left) and Footer (Right) */}
          <div className="w-full flex justify-between items-center">
            <a href={slide.websiteUrl} className="text-teal-300 text-sm md:text-base hover:underline">
              {slide.websiteUrl}
            </a>
            <span className="text-teal-300 text-sm md:text-base">{slide.footer}</span>
          </div>
        </div>
  
        {/* Slide Number (Bottom-Left, with Margin-Bottom) */}
        <div className="absolute bottom-20 left-10 z-20">
          <span className="bg-teal-500 text-white text-lg md:text-xl font-bold px-4 py-2 rounded-full">
            {`0${slide.slideNumber}`}
          </span>
        </div>
  
        {/* Teal Geometric Shape (Bottom-Right) */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 md:h-1/2 pointer-events-none">
          <svg viewBox="0 0 500 500" className="w-full h-full fill-teal-500 opacity-50">
            <polygon points="0,500 500,500 0,0" />
          </svg>
        </div>
      </div>
    ),
  };

  const Template3: CarouselTemplate = {
    id: 'template-growth-strategies',
    name: 'Growth Strategies',
    slides: [
      {
        title: 'HOW TO GROW YOUR BUSINESS ON SOCIAL MEDIA',
        description: '',
        imageUrl: '/images/background4.png', // Ensure this path is correct
        headshotUrl: '',
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 1,
        comment: '/images/comment-icon.png',
        save: '/images/save-icon.png',
        like: '/images/heart-icon.png',
        overlayGraphic: '/images/share-icon.png',
      },
      {
        title: 'DEFINE YOUR GOALS:',
        description: 'Before you start, identify what you want to achieve on social media, whether it’s increasing brand awareness, driving traffic to your website, or generating leads.',
        imageUrl: '/images/background4.png',
        headshotUrl: '',
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 2,
        comment: '/images/comment-icon.png',
        save: '/images/save-icon.png',
        like: '/images/heart-icon.png',
        overlayGraphic: '/images/share-icon.png',
      },
      {
        title: 'KNOW YOUR AUDIENCE:',
        description: 'Understand who your target audience is, what they like, and where they spend time online. This will help you create content that resonates with them.',
        imageUrl: '/images/background4.png',
        headshotUrl: '',
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 3,
        comment: '/images/comment-icon.png',
        save: '/images/save-icon.png',
        like: '/images/heart-icon.png',
        overlayGraphic: '/images/share-icon.png',
      },
      {
        title: 'CHOOSE THE RIGHT PLATFORMS:',
        description: 'Not all social media platforms are created equal. Choose the ones that align with your goals and where your audience is most active.',
        imageUrl: '/images/background4.png',
        headshotUrl: '',
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 4,
        comment: '/images/comment-icon.png',
        save: '/images/save-icon.png',
        like: '/images/heart-icon.png',
        overlayGraphic: '/images/share-icon.png',
      },
      {
        title: 'FOLLOW FOR MORE TIPS!',
        description: '',
        imageUrl: '/images/background4.png',
        headshotUrl: '',
        header: '',
        footer: 'bitrox.tech',
        socialHandle: '',
        websiteUrl: 'https://bitrox.tech',
        slideNumber: 5,
        comment: '/images/comment-icon.png',
        save: '/images/save-icon.png',
        like: '/images/heart-icon.png',
        overlayGraphic: '/images/share-icon.png',
      },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl) => (
      <div
        className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1a1a1a', // Fallback background color if image fails to load
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
  
        {/* Logo (Top-Right) */}
        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
          />
        )}
  
        {/* Geometric Shapes */}
        {/* Top-Left Shape (Cone) */}
        <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 0 L100 100 L0 100 Z" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF69B4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#00C4FF', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
  
        {/* Bottom-Left Shape (Swirl) */}
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10 90 Q 50 10 90 90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </div>
  
        {/* Top-Right Shape (Swirl) */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M10 10 Q 50 90 90 10"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
  
        {/* Bottom-Right Shape (Cube) */}
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M30 30 L70 30 L70 70 L30 70 Z M70 30 L50 10 L30 30 M70 70 L50 90 L30 70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
  
        {/* Content Section (Centered) */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center">
            {slide.title}
          </h2>
          {/* Gradient Underline */}
          <div className="w-3/4 h-1 mb-6">
            <svg viewBox="0 0 100 1" className="w-full h-full">
              <line x1="0" y1="0" x2="100" y2="0" stroke="url(#gradient)" strokeWidth="2" />
            </svg>
          </div>
          {slide.description && (
            <p className="text-base md:text-xl max-w-lg text-center leading-relaxed">
              {slide.description}
            </p>
          )}
        </div>
  
        {/* Bottom Section */}
        <div className="relative z-10 flex flex-col items-center pb-6 md:pb-10 px-6 md:px-10">
          {/* Social Media Icons (Slide 5 Only) */}
          {slide.slideNumber === 5 && (
            <div className="flex space-x-4 mb-4">
              <img src={slide.like} alt="Like" className="w-6 h-6 md:w-8 md:h-8" />
              <img src={slide.comment} alt="Comment" className="w-6 h-6 md:w-8 md:h-8" />
              <img src={slide.overlayGraphic} alt="Share" className="w-6 h-6 md:w-8 md:h-8" />
              <img src={slide.save} alt="Save" className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          )}
  
          {/* Website URL (Left) and Footer (Right) */}
          <div className="w-full flex justify-between items-center">
            <a href={slide.websiteUrl} className="text-teal-300 text-sm md:text-base hover:underline">
              {slide.websiteUrl}
            </a>
            <span className="text-teal-300 text-sm md:text-base">{slide.footer}</span>
          </div>
        </div>
  
        {/* Social Handle (Bottom-Left, All Slides) */}
        {slide.socialHandle && (
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
            <p className="text-teal-300 text-sm md:text-base">{slide.socialHandle}</p>
          </div>
        )}
      </div>
    ),
  };

export const carouselTemplates: CarouselTemplate[] = [Template1, Template2, Template3];