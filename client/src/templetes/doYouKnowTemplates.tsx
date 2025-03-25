import React from 'react';

export interface DoYouKnowSlide {
  title: string;
  fact: string;
  imageUrl: string;
  footer: string;
  websiteUrl: string;
  slideNumber: number;
}

export interface DoYouKnowTemplate {
  id: string;
  name: string;
  slides: DoYouKnowSlide[];
  renderSlide: (slide: DoYouKnowSlide, addLogo: boolean, defaultLogoUrl: string) => JSX.Element;
}

// Template 1: Minimalist Design (Single Slide)
const DoYouKnowTemplate1: DoYouKnowTemplate = {
  id: 'do-you-know-minimalist',
  name: 'Minimalist Do You Know',
  slides: [
    {
      title: 'DO YOU KNOW?',
      fact: 'The human body contains about 0.2 milligrams of gold, most of it in the blood.',
      imageUrl: '/images/background1.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
      style={{
        backgroundImage: `url(${slide.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#1a1a1a',
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

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center">
          {slide.title}
        </h2>
        <p className="text-base md:text-xl max-w-lg text-center leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex flex-col items-center pb-6 md:pb-10 px-6 md:px-10">
        {/* Website URL (Left) and Footer (Right) */}
        <div className="w-full flex justify-between items-center">
          <a href={slide.websiteUrl} className="text-teal-300 text-sm md:text-base hover:underline">
            {slide.websiteUrl}
          </a>
          <span className="text-teal-300 text-sm md:text-base">{slide.footer}</span>
        </div>
      </div>
    </div>
  ),
};

// Template 2: Fun Fact Design with Border (Single Slide)
const DoYouKnowTemplate2: DoYouKnowTemplate = {
  id: 'do-you-know-fun-fact',
  name: 'Fun Fact Do You Know',
  slides: [
    {
      title: 'DO YOU KNOW?',
      fact: 'Octopuses have three hearts and can change color to blend into their surroundings.',
      imageUrl: '/images/background4.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white border-4 border-teal-500"
      style={{
        backgroundImage: `url(${slide.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>

      {/* Logo (Top-Right) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Content Section (Centered with Border) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
        <div className="bg-teal-500 bg-opacity-20 p-6 rounded-lg border-2 border-teal-300">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center">
            {slide.title}
          </h2>
          <p className="text-base md:text-xl max-w-lg text-center leading-relaxed">
            {slide.fact}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 flex flex-col items-center pb-6 md:pb-10 px-6 md:px-10">
        {/* Website URL (Left) and Footer (Right) */}
        <div className="w-full flex justify-between items-center">
          <a href={slide.websiteUrl} className="text-teal-300 text-sm md:text-base hover:underline">
            {slide.websiteUrl}
          </a>
          <span className="text-teal-300 text-sm md:text-base">{slide.footer}</span>
        </div>
      </div>
    </div>
  ),
};

// Template 3: Tech-Themed Design (Previous Template)
const DoYouKnowTemplate3: DoYouKnowTemplate = {
  id: 'do-you-know-tech',
  name: 'Tech Do You Know',
  slides: [
    {
      title: 'DID YOU KNOW?',
      fact: 'In a few decades, we may experience some terrible things. Because according to experts, artificial intelligence will be able to achieve the ability to do about 40% of human tasks equally.',
      imageUrl: '/images/background5.png',
      footer: 'reallygreatsite',
      websiteUrl: 'https://reallygreatsite.com',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex text-white border-4 border-[#A8C686]"
      style={{
        backgroundImage: `url(${slide.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#1a1a1a',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>

      {/* Logo (Top-Right) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Username (Top Center) */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
        <span className="bg-[#F7E4E4] text-black text-sm md:text-base px-4 py-1 rounded-b-lg border-2 border-[#A8C686]">
          @{slide.footer}
        </span>
      </div>

      {/* Title (Vertical on the Left) */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#D4A017] leading-tight"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {slide.title}
        </h2>
      </div>

      {/* Fact Content (Centered in Pink Box) */}
      <div className="relative z-10 flex items-center justify-center flex-grow p-6 md:p-10">
        <div className="bg-[#F7E4E4] text-black p-6 rounded-lg border-2 border-[#A8C686] max-w-md">
          <p className="text-base md:text-lg leading-relaxed">{slide.fact}</p>
        </div>
      </div>
    </div>
  ),
};

// Template 4: Playful Robot Design (Based on the New Image)
const DoYouKnowTemplate4: DoYouKnowTemplate = {
  id: 'do-you-know-robot',
  name: 'Robot Do You Know',
  slides: [
    {
      title: 'DID YOU KNOW?',
      fact: 'Sloths are one of the slowest animals to walk, even in their digestion process. They live a slow-paced lifestyle, but surprisingly they are strong swimmers.',
      imageUrl: '/images/background6.png', // Placeholder for the robot illustration
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex text-white"
      style={{
        backgroundColor: '#1C2526', // Dark blue background
      }}
    >
      {/* Decorative Dots (Top-Left) */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      </div>
      <div className="absolute top-8 left-4 w-16 h-0.5 bg-gray-400"></div>

      {/* Decorative Dots (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-8 left-4 w-16 h-0.5 bg-gray-400"></div>

      {/* Left Side: Title and Fact */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-10 z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-yellow-500 mb-6 leading-tight">
          {slide.title}
        </h2>
        <p className="text-base md:text-xl text-white max-w-md leading-relaxed">
          "{slide.fact}"
        </p>
      </div>

      {/* Right Side: Robot Illustration */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Yellow Circle Background */}
          <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 bg-yellow-500 rounded-full transform translate-x-8 translate-y-8"></div>
          {/* Robot Image */}
          <img
            src={slide.imageUrl}
            alt="Robot Illustration"
            className="relative w-64 h-64 md:w-80 md:h-80 object-contain z-10"
          />
          {/* Question Mark */}
          <span className="absolute bottom-0 right-0 text-6xl md:text-8xl text-yellow-500 z-20">?</span>
        </div>
      </div>

      {/* Logo (Top-Right) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <span className="text-white text-sm md:text-base">
          @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-yellow-500 hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
      </div>
    </div>
  ),
};

const DoYouKnowTemplate5: DoYouKnowTemplate = {
  id: 'do-you-know-neon',
  name: 'Neon Question Mark Do You Know',
  slides: [
    {
      title: 'QUESTION?',
      fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dignissim pretium consectetur. Curabitur tempor posuere massa in.',
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex text-white"
      style={{
        background: 'linear-gradient(to bottom, #1C2526, #2A3B5A)', // Gradient dark blue background
      }}
    >
      {/* Left Side: Neon Question Mark */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="relative">
          {/* Neon Circle */}
          <div
            className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-red-500"
            style={{
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)',
            }}
          ></div>
          {/* Neon Question Mark */}
          <span
            className="relative text-9xl md:text-[12rem] text-red-500 z-10"
            style={{
              textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)',
            }}
          >
            ?
          </span>
          {/* Small Square at Bottom */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-red-500"
            style={{
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)',
            }}
          ></div>
        </div>
      </div>

      {/* Right Side: Title and Fact */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-10 z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {slide.title}
        </h2>
        <p className="text-base md:text-xl text-white max-w-md leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Logo (Top-Right) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <span className="text-white text-sm md:text-base">
          @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-red-500 hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
      </div>
    </div>
  ),
};

const DoYouKnowTemplate6: DoYouKnowTemplate = {
  id: 'do-you-know-interesting-facts',
  name: 'Interesting Facts Do You Know',
  slides: [
    {
      title: 'DID YOU KNOW',
      fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna al iquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ut laoreet dolore magna aliquam erat volutpat.',
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-between text-black"
      style={{
        background: 'linear-gradient(to bottom, #F5F5F5, #E5E5E5)', // Light gray gradient background
      }}
    >
      {/* Decorative Yellow Shapes */}
      <div
        className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 opacity-50 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400 opacity-50 rounded-full"
        style={{ transform: 'translate(50%, 50%)' }}
      ></div>

      {/* Crown Icon (Top-Left) */}
      <div className="absolute top-4 left-4 z-10">
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-5z" />
        </svg>
      </div>

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
          {slide.title}
        </h2>
        {/* Fact */}
        <p className="text-base md:text-lg text-black max-w-md leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Logo (Top-Right) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="relative z-10 flex flex-col items-center pb-4">
        <span className="text-black text-sm md:text-base">
          Designed by @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-black hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
        <span className="text-black text-xs mt-1">626px × 626px / EPS, JPG</span>
      </div>
    </div>
  ),
};

const DoYouKnowTemplate7: DoYouKnowTemplate = {
  id: 'do-you-know-watercolor',
  name: 'Watercolor Question Mark Do You Know',
  slides: [
    {
      title: 'DID YOU KNOW?',
      fact: 'Lorem ipsum is simply pasted text from the typesetting industry and needs to remove it.',
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-between text-blue-600"
      style={{
        background: 'linear-gradient(to bottom, #E6F0FA, #D6E5FA)', // Light blue watercolor-style gradient
      }}
    >
      {/* Crown Icon (Top-Left) */}
      <div className="absolute top-4 left-4 z-10">
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-5z" />
        </svg>
      </div>

      {/* Top-Right Icons (Heart, Share, More) */}
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C9.886 12.938 10 12.482 10 12c0-.482-.114-.938-1.316-1.342m2.632 2.684C12.514 13.746 13 14.202 13 15c0 .796-.486 1.252-1.684 1.658m-2.632-5.316C7.486 10.938 7 10.482 7 10c0-.482.114-.938 1.316-1.342M12 9v6m3-3H9"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
        {/* Question Mark Frame */}
        <div className="relative mb-6">
          {/* White Frame with Quotation Marks */}
          <div
            className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 border-4 border-white rounded-lg"
            style={{ transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }}
          >
            {/* Top-Left Quotation Mark */}
            <span className="absolute top-0 left-0 text-4xl text-white transform -translate-x-1/2 -translate-y-1/2">
              “
            </span>
            {/* Bottom-Right Quotation Mark */}
            <span className="absolute bottom-0 right-0 text-4xl text-white transform translate-x-1/2 translate-y-1/2">
              ”
            </span>
          </div>
          {/* Question Mark */}
          <span className="relative text-6xl md:text-8xl text-white z-10">?</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4 leading-tight">
          {slide.title}
        </h2>
        {/* Fact */}
        <p className="text-base md:text-lg text-blue-600 max-w-md leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Logo (Top-Right, below icons) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-16 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="relative z-10 flex flex-col items-center pb-4">
        <span className="text-black text-sm md:text-base">
          Designed by @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-black hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
        <span className="text-black text-xs mt-1">626px × 626px / EPS, JPG</span>
      </div>
    </div>
  ),
};

const DoYouKnowTemplate8: DoYouKnowTemplate = {
  id: 'do-you-know-glowing-question',
  name: 'Glowing Question Mark Do You Know',
  slides: [
    {
      title: 'LOOKING FOR AN ANSWER?',
      fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna al iquam erat volutpat.',
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex text-white"
      style={{
        background: 'linear-gradient(to bottom, #0A2A5A, #1A3A7A)', // Dark blue gradient
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', // Particle effect
      }}
    >
      {/* Top-Right Icons (Heart, Share, More) */}
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C9.886 12.938 10 12.482 10 12c0-.482-.114-.938-1.316-1.342m2.632 2.684C12.514 13.746 13 14.202 13 15c0 .796-.486 1.252-1.684 1.658m-2.632-5.316C7.486 10.938 7 10.482 7 10c0-.482.114-.938 1.316-1.342M12 9v6m3-3H9"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      {/* Left Side: Title and Fact */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-10 z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h2>
        <p className="text-base md:text-lg text-white max-w-md leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Right Side: Glowing 3D Question Mark */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="relative">
          {/* Glowing Question Mark (Simplified with SVG and CSS) */}
          <svg
            className="w-40 h-40 md:w-48 md:h-48 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))',
              strokeWidth: '6',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
          >
            <path
              d="M40 20c10 0 20 10 20 20s-10 20-20 20"
              stroke="url(#glass-gradient)"
            />
            <circle cx="40" cy="70" r="5" fill="url(#glass-gradient)" />
            {/* Define gradient for glass effect */}
            <defs>
              <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Logo (Top-Right, below icons) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-16 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-10">
        <span className="text-white text-sm md:text-base">
          Designed by @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-white hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
        <span className="text-white text-xs mt-1">626px × 626px / EPS, JPG</span>
      </div>
    </div>
  ),
};

// Template 9: Simple Question Mark Background (Image 2)
const DoYouKnowTemplate9: DoYouKnowTemplate = {
  id: 'do-you-know-simple-question',
  name: 'Simple Question Mark Background',
  slides: [
    {
      title: 'QUESTION',
      fact: '', // No fact provided in the image
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-center text-white"
      style={{
        background: '#3B82F6', // Solid blue background
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', // Subtle particle effect
      }}
    >
      {/* Top-Right Icons (Heart, Share, More) */}
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C9.886 12.938 10 12.482 10 12c0-.482-.114-.938-1.316-1.342m2.632 2.684C12.514 13.746 13 14.202 13 15c0 .796-.486 1.252-1.684 1.658m-2.632-5.316C7.486 10.938 7 10.482 7 10c0-.482.114-.938 1.316-1.342M12 9v6m3-3H9"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
        {/* Question Mark in Circle */}
        <div className="relative mb-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white flex items-center justify-center">
            <span className="text-6xl md:text-8xl text-white">?</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h2>
        {/* Fact (Optional) */}
        {slide.fact && (
          <p className="text-base md:text-lg text-white max-w-md leading-relaxed">
            {slide.fact}
          </p>
        )}
      </div>

      {/* Logo (Top-Right, below icons) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-16 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-10">
        <span className="text-white text-sm md:text-base">
          Designed by @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-white hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
        <span className="text-white text-xs mt-1">400px × 400px / multiple formats</span>
      </div>
    </div>
  ),
};

// Template 10: Gradient Circle with Bulb Icon (Custom Design)
const DoYouKnowTemplate10: DoYouKnowTemplate = {
  id: 'do-you-know-bulb-gradient',
  name: 'Gradient Circle with Bulb Icon',
  slides: [
    {
      title: 'DID YOU KNOW?',
      fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod.',
      imageUrl: '', // No image used in this template
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl) => (
    <div
      className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-center text-white"
      style={{
        background: 'linear-gradient(to bottom, #C084FC, #F472B6)', // Purple to pink gradient
      }}
    >
      {/* Top-Right Icons (Heart, Share, More) */}
      <div className="absolute top-4 right-4 flex space-x-3 z-10">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C9.886 12.938 10 12.482 10 12c0-.482-.114-.938-1.316-1.342m2.632 2.684C12.514 13.746 13 14.202 13 15c0 .796-.486 1.252-1.684 1.658m-2.632-5.316C7.486 10.938 7 10.482 7 10c0-.482.114-.938 1.316-1.342M12 9v6m3-3H9"
          />
        </svg>
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </div>

      {/* Content Section (Centered) */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
        {/* Bulb Icon in Gradient Circle */}
        <div className="relative mb-6">
          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(to right, #F472B6, #C084FC)',
              boxShadow: '0 0 20px rgba(240, 171, 252, 0.6)',
            }}
          >
            <svg
              className="w-16 h-16 md:w-20 md:h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 21h6m-3-3v3m-4-9h8m-8 0a4 4 0 004-4V5a4 4 0 00-8 0v4a4 4 0 004 4z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {slide.title}
        </h2>
        {/* Fact */}
        <p className="text-base md:text-lg text-white max-w-md leading-relaxed">
          {slide.fact}
        </p>
      </div>

      {/* Logo (Top-Right, below icons) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-16 right-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
        />
      )}

      {/* Footer (Bottom Center) */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center z-10">
        <span className="text-white text-sm md:text-base">
          Designed by @{slide.footer} |{' '}
          <a href={slide.websiteUrl} className="text-white hover:underline">
            {slide.websiteUrl}
          </a>
        </span>
        <span className="text-white text-xs mt-1">626px × 626px / EPS, JPG</span>
      </div>
    </div>
  ),
};



export const doYouKnowTemplates: DoYouKnowTemplate[] = [
  DoYouKnowTemplate1,
  DoYouKnowTemplate2,
  DoYouKnowTemplate3,
  DoYouKnowTemplate4,
  DoYouKnowTemplate5,
  DoYouKnowTemplate6,
  DoYouKnowTemplate7,
  DoYouKnowTemplate8,
  DoYouKnowTemplate9,
  DoYouKnowTemplate10,
];