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
  coverImageUrl?: string;
}

// Template 1: Modern Overlay (Your Original Design with 5 Slides)
const Template1: CarouselTemplate = {
  id: 'template1',
  name: 'Modern Overlay',
  coverImageUrl: '/images/background1.png',
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
      overlayGraphic: '',
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
      overlayGraphic: '',
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
      overlayGraphic: '',
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
        backgroundColor: '#1e3a8a', // Fallback color
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.8), rgba(107, 33, 168, 0.8))', // Blue to purple gradient overlay
        }}
      ></div>

      {/* Subtle Tech-Inspired Lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `, // Grid-like lines
          backgroundSize: '50px 50px',
          opacity: 0.3,
        }}
      ></div>


      {/* Logo (Top-Left) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-8 left-8 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Slide Number (Top-Right) */}
      <div className="absolute top-8 right-8 bg-blue-900 text-white text-2xl w-12 h-12 flex items-center justify-center rounded-full font-bold z-20">
        {`0${slide.slideNumber}`}
      </div>

      {/* Content Section */}
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-10">
        <div className="flex flex-col items-start text-left max-w-2xl">
          {/* Headshot (Circular Avatar with Glow) */}
          {slide.headshotUrl && (
            <div className="relative mb-6">
              <img
                src={slide.headshotUrl}
                alt="Headshot"
                className="w-20 h-20 rounded-full border-2 border-white"
                style={{
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)', // Glowing effect
                }}
              />
              {/* Subtle Glow Ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
              ></div>
            </div>
          )}

          {/* Tagline */}
          {slide.tagline && (
            <span
              className="text-lg md:text-xl font-medium text-blue-300 mb-2"
              style={{
                fontFamily: "'Inter', sans-serif",
                textShadow: '0 0 5px rgba(59, 130, 246, 0.3)', // Subtle glow
              }}
            >
              {slide.tagline}
            </span>
          )}

          {/* Title */}
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide"
            style={{
              fontFamily: "'Inter', sans-serif",
              textShadow: '0 0 10px rgba(59, 130, 246, 0.5)', // Glowing effect
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          {slide.description && (
            <p
              className="text-base md:text-lg text-gray-200 max-w-md leading-relaxed"
              style={{
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {slide.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section (Footer, Website URL, and Social Icons) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 md:px-12 z-10">
        {/* Footer and Social Handle (Bottom-Left) */}
        <div className="flex flex-col items-start">
          <span
            className="text-sm md:text-base text-white"
            style={{
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Designed by {slide.footer}
          </span>
          <span
            className="text-sm md:text-base text-blue-300"
            style={{
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {slide.socialHandle}
          </span>
        </div>

        {/* Website URL (Bottom-Right) */}
        <a
          href={slide.websiteUrl}
          className="text-blue-300 text-sm md:text-base hover:underline"
          style={{
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {slide.websiteUrl}
        </a>
      </div>

      {/* Social Icons (Floating on Last Slide) */}
      {slide.slideNumber === 5 && (
        <div className="absolute bottom-16 right-8 flex flex-col space-y-4 z-20">
          <img
            src={slide.like}
            alt="Like"
            className="w-8 h-8 rounded-full bg-blue-900 p-2 hover:bg-blue-800 transition"
            style={{
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', // Glowing effect
            }}
          />
          <img
            src={slide.comment}
            alt="Comment"
            className="w-8 h-8 rounded-full bg-blue-900 p-2 hover:bg-blue-800 transition"
            style={{
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', // Glowing effect
            }}
          />
          <img
            src={slide.save}
            alt="Save"
            className="w-8 h-8 rounded-full bg-blue-900 p-2 hover:bg-blue-800 transition"
            style={{
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)', // Glowing effect
            }}
          />
        </div>
      )}
    </div>
  ),
};

// Template 2: Minimalist Design with 5 Slides
const Template2: CarouselTemplate = {
  id: 'template-social-media',
  name: 'Social Media Growth Hacks',
  coverImageUrl: '/images/background1.png',
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
          className={`text-left font-bold mb-4 leading-tight ${slide.slideNumber === 1 || slide.slideNumber === 5
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
  coverImageUrl: '/images/background1.png',
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

const Template4: CarouselTemplate = {
  id: 'template-ai-agents',
  name: 'AI Agents',
  coverImageUrl: '/images/background1.png',
  slides: [
    {
      title: 'Integrate The Power Of AI In Your Business.',
      description: '',
      imageUrl: '', // No background image; we'll use a gradient
      headshotUrl: '', // No headshot in this template
      header: 'blocktunix', // Top-right logo text
      footer: 'Link in description', // Bottom text
      socialHandle: '',
      websiteUrl: 'https://blocktunix.com',
      slideNumber: 1,
      comment: '/images/comment-icon.png',
      save: '/images/save-icon.png',
      like: '/images/heart-icon.png',
      overlayGraphic: '/images/share-icon.png',
    },
    {
      title: 'AI Agents The Next Web3 Revolution',
      description: '',
      imageUrl: '/images/robot-sitting.png', // Robot illustration
      headshotUrl: '',
      header: 'blocktunix',
      footer: 'Swipe Next',
      socialHandle: '',
      websiteUrl: 'https://blocktunix.com',
      slideNumber: 2,
      comment: '/images/comment-icon.png',
      save: '/images/save-icon.png',
      like: '/images/heart-icon.png',
      overlayGraphic: '/images/share-icon.png',
    },
    {
      title: 'What Are AI Agents?',
      description:
        'In simple words, AI Agents are software systems that make decisions on behalf of humans using artificial intelligence without needing external inputs.',
      imageUrl: '/images/robot-with-tablet.png', // Robot holding a tablet
      headshotUrl: '',
      header: 'blocktunix',
      footer: 'Swipe Next',
      socialHandle: '',
      websiteUrl: 'https://blocktunix.com',
      slideNumber: 3,
      comment: '/images/comment-icon.png',
      save: '/images/save-icon.png',
      like: '/images/heart-icon.png',
      overlayGraphic: '/images/share-icon.png',
    },
    {
      title: 'How Do AI Agents Work?',
      description:
        'An AI agent can take predictions from predictive AI and use generative AI to take action or provide solutions.',
      imageUrl: '', // No image; we'll use a Venn diagram
      headshotUrl: '',
      header: 'blocktunix',
      footer: 'Swipe Next',
      socialHandle: '',
      websiteUrl: 'https://blocktunix.com',
      slideNumber: 4,
      comment: '/images/comment-icon.png',
      save: '/images/save-icon.png',
      like: '/images/heart-icon.png',
      overlayGraphic: '/images/share-icon.png',
    },
    {
      title: 'Working Examples Of AI Agents',
      description: '',
      imageUrl: '', // No image; we'll use a list with arrows
      headshotUrl: '',
      header: 'blocktunix',
      footer: 'Swipe Next',
      socialHandle: '',
      websiteUrl: 'https://blocktunix.com',
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
        background: 'linear-gradient(to bottom, #0A2A5A, #1A3A7A)', // Dark blue gradient
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', // Particle effect
      }}
    >
      {/* Abstract Shapes */}
      {/* Top-Left Circle */}
      <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="url(#gradient)" fillOpacity="0.2" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top-Right Circle */}
      <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="50" fill="url(#gradient)" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Bottom-Left Circuit Pattern */}
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M20 80 H40 V60 H60 V40 H80"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Header (Top-Right Logo) */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        <svg
          className="w-6 h-6 text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zm-10 10h6v6H4v-6zm10 0h6v6h-6v-6z" />
        </svg>
        <span className="text-white text-sm md:text-base">{slide.header}</span>
      </div>

      {/* Custom Logo (Below Header) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-16 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center">
          {slide.title.split('AI AGENTS').map((part, index) => (
            <span key={index}>
              {part}
              {index < slide.title.split('AI AGENTS').length - 1 && (
                <span className="text-blue-400">AI AGENTS</span>
              )}
            </span>
          ))}
        </h2>

        {/* Gradient Underline */}
        <div className="w-1/2 h-1 mb-6">
          <svg viewBox="0 0 100 1" className="w-full h-full">
            <line x1="0" y1="0" x2="100" y2="0" stroke="url(#gradient)" strokeWidth="2" />
            <circle cx="0" cy="0" r="2" fill="url(#gradient)" />
            <circle cx="100" cy="0" r="2" fill="url(#gradient)" />
          </svg>
        </div>

        {/* Slide-Specific Content */}
        {slide.slideNumber === 1 && (
          <div className="flex justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
              {slide.footer}
            </button>
          </div>
        )}

        {slide.slideNumber === 2 && slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt="Robot Illustration"
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
        )}

        {slide.slideNumber === 3 && (
          <div className="flex flex-col items-center">
            {slide.description && (
              <p className="text-base md:text-xl max-w-lg text-center leading-relaxed mb-6">
                {slide.description}
              </p>
            )}
            {slide.imageUrl && (
              <img
                src={slide.imageUrl}
                alt="Robot with Tablet"
                className="w-48 h-48 md:w-64 md:h-64 object-contain"
              />
            )}
          </div>
        )}

        {slide.slideNumber === 4 && (
          <div className="flex flex-col items-center">
            {slide.description && (
              <p className="text-base md:text-xl max-w-lg text-center leading-relaxed mb-6">
                {slide.description}
              </p>
            )}
            {/* Venn Diagram */}
            <div className="relative w-64 h-32 md:w-80 md:h-40">
              {/* Left Circle (Generative AI) */}
              <div
                className="absolute left-0 top-0 w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  transform: 'translateX(20%)',
                }}
              >
                <span className="text-sm md:text-base text-white text-center">
                  Generative AI
                  <br />
                  (Creating Content)
                </span>
              </div>
              {/* Right Circle (Predictive AI) */}
              <div
                className="absolute right-0 top-0 w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  transform: 'translateX(-20%)',
                }}
              >
                <span className="text-sm md:text-base text-white text-center">
                  Predictive AI
                  <br />
                  (Predicting and Forecasting)
                </span>
              </div>
              {/* Center Overlap (AI Agents) */}
              <div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <span className="text-sm md:text-base text-blue-600 font-bold text-center">
                  AI Agents
                </span>
              </div>
            </div>
          </div>
        )}

        {slide.slideNumber === 5 && (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-semibold text-blue-400 mb-2">Predicts</h3>
                <ul className="text-base md:text-lg space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Buying Trends for Future
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Change in Traffic Pattern
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    A Delay in Supply Chain
                  </li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl md:text-2xl font-semibold text-blue-400 mb-2">Generates</h3>
                <ul className="text-base md:text-lg space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Custom Marketing Campaigns
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Route Optimization Plan
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Alternative Logistic Options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex flex-col items-center pb-6 md:pb-10 px-6 md:px-10">
        {/* Social Media Icons (All Slides) */}
        <div className="flex space-x-4 mb-4">
          <img src={slide.like} alt="Like" className="w-6 h-6 md:w-8 md:h-8" />
          <img src={slide.comment} alt="Comment" className="w-6 h-6 md:w-8 md:h-8" />
          <img src={slide.overlayGraphic} alt="Share" className="w-6 h-6 md:w-8 md:h-8" />
          <img src={slide.save} alt="Save" className="w-6 h-6 md:w-8 md:h-8" />
        </div>

        {/* Footer Text */}
        <div className="flex items-center space-x-2">
          {slide.footer === 'Swipe Next' && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
          <span className="text-white text-sm md:text-base">{slide.footer}</span>
          {slide.footer === 'Swipe Next' && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </div>

        {/* Navigation Dots */}
        <div className="flex space-x-2 mt-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                slide.slideNumber === index + 1 ? 'bg-white' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Website URL (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20">
        <a href={slide.websiteUrl} className="text-blue-300 text-sm md:text-base hover:underline">
          {slide.websiteUrl}
        </a>
      </div>
    </div>
  ),
};

const Template5: CarouselTemplate = {
  id: 'template5',
  name: 'Cyberpunk AI',
  coverImageUrl: '/images/carousel-cover/cover1.png', // Path to the provided image
  slides: [
    {
      tagline: 'Welcome to Bitrox',
      title: 'EXPLORE OUR AI SOLUTIONS',
      description: 'Discover how our AI-powered tools can transform your business.',
      imageUrl: '/images/background8.jpg', // Path to the provided image
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
      imageUrl: '/images/background8.jpg',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 2,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
    {
      title: 'Our Services',
      description: 'AI analytics to predictive modeling.',
      imageUrl: '/images/background8.jpg',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 3,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
    {
      title: 'Get Started Today',
      description: 'Join thousands innovating with Bitrox.',
      imageUrl: '/images/background8.jpg',
      headshotUrl: '',
      header: '',
      footer: 'bitrox.tech',
      socialHandle: '@bitroxtechnologies',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 4,
      comment: '/images/comment.png',
      save: '/images/save.png',
      like: '/images/like.png',
      overlayGraphic: '',
    },
    {
      tagline: 'Thank You!',
      title: 'LET’S CONNECT',
      description: 'Follow us for updates.',
      imageUrl: '/images/background8.jpg',
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
        backgroundColor: '#1A1A1A', // Fallback color (dark gray)
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient Overlay for Readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.9))', // Dark gray overlay
        }}
      ></div>

      {/* Circuit Pattern Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `, // Neon pink and blue circuit lines
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }}
      ></div>

      {/* Holographic Shape (Top-Right) */}
      <div
        className="absolute top-8 right-8 w-16 h-16"
        style={{
          background: 'linear-gradient(45deg, #FF00FF, #00FFFF)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
        }}
      ></div>

      {/* Logo (Top-Left) with 3D Glow */}
      {addLogo && (
        <div className="absolute top-8 left-8 z-20">
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="w-32 h-12 object-contain md:w-40 md:h-16"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))', // Neon blue glow
              transform: 'translateZ(10px)',
            }}
          />
        </div>
      )}

      {/* Slide Number (Top-Right) with Neon Effect */}
      <div
        className="absolute top-10 right-10 text-white text-2xl w-12 h-12 flex items-center justify-center rounded-full font-bold z-20"
        style={{
          background: 'rgba(255, 0, 255, 0.3)', // Neon pink background
          boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)', // Neon pink glow
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {`0${slide.slideNumber}`}
      </div>

      {/* Content Section */}
      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 z-10">
        <div className="flex flex-col items-start text-left max-w-2xl">

          {/* Tagline with Gradient Text */}
          {slide.tagline && (
            <span
              className="text-lg md:text-xl font-medium mb-2 uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                background: 'linear-gradient(to right, #FF00FF, #00FFFF)', // Neon pink to blue gradient
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.5)', // Neon blue glow
              }}
            >
              {slide.tagline}
            </span>
          )}

          {/* Title with Neon Glow */}
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide uppercase"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              color: '#FFFFFF',
              textShadow: '0 0 15px rgba(255, 0, 255, 0.7), 0 0 30px rgba(0, 255, 255, 0.5)', // Neon pink and blue glow
            }}
          >
            {slide.title}
          </h2>

          {/* Description with Semi-Transparent Background */}
          {slide.description && (
            <div
              className="relative max-w-md"
              style={{
                background: 'rgba(26, 26, 26, 0.5)', // Dark gray background
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', // Neon blue glow
              }}
            >
              <p
                className="text-base md:text-lg text-gray-200 leading-relaxed"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  textShadow: '0 0 5px rgba(255, 0, 255, 0.3)', // Subtle neon pink glow
                }}
              >
                {slide.description}
              </p>
              {/* Decorative Circuit Node (Bottom-Right) */}
              <div
                className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full"
                style={{
                  background: 'linear-gradient(45deg, #FF00FF, #00FFFF)', // Neon pink to blue gradient
                  boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)', // Neon pink glow
                }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section (Footer, Website URL, and Social Icons) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-8 md:px-12 z-10">
        {/* Footer and Social Handle (Bottom-Left) */}
        <div className="flex flex-col items-start">
          <span
            className="text-sm md:text-base text-white"
            style={{
              fontFamily: "'Roboto', sans-serif",
              textShadow: '0 0 5px rgba(0, 255, 255, 0.3)', // Neon blue glow
            }}
          >
      {slide.footer}
          </span>
          {/* <span
            className="text-sm md:text-base text-blue-300"
            style={{
              fontFamily: "'Roboto', sans-serif",
              textShadow: '0 0 5px rgba(255, 0, 255, 0.3)', // Neon pink glow
            }}
          >
            {slide.socialHandle}
          </span> */}
        </div>

        {/* Website URL (Bottom-Right) */}
        <a
          href={slide.websiteUrl}
          className="text-blue-300 text-sm md:text-base hover:underline"
          style={{
            fontFamily: "'Roboto', sans-serif",
            textShadow: '0 0 5px rgba(0, 255, 255, 0.3)', // Neon blue glow
          }}
        >
          {slide.websiteUrl}
        </a>
      </div>

      {/* Social Icons (Floating on Last Slide) */}
      {slide.slideNumber === 5 && (
        <div className="absolute bottom-16 right-8 flex flex-col space-y-4 z-20">
          <img
            src={slide.like}
            alt="Like"
            className="w-8 h-8 rounded-full p-2 transition"
            style={{
              background: 'rgba(255, 0, 255, 0.3)', // Neon pink background
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)', // Neon pink glow
            }}
          />
          <img
            src={slide.comment}
            alt="Comment"
            className="w-8 h-8 rounded-full p-2 transition"
            style={{
              background: 'rgba(0, 255, 255, 0.3)', // Neon blue background
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)', // Neon blue glow
            }}
          />
          <img
            src={slide.save}
            alt="Save"
            className="w-8 h-8 rounded-full p-2 transition"
            style={{
              background: 'rgba(255, 0, 255, 0.3)', // Neon pink background
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)', // Neon pink glow
            }}
          />
        </div>
      )}
    </div>
  ),
};

export const carouselTemplates: CarouselTemplate[] = [Template1, Template2, Template3, Template4, Template5];