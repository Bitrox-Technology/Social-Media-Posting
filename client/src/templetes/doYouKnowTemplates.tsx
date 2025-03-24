// src/templates/doYouKnowTemplates.ts
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

      {/* Logo (Top-Left) */}
      {addLogo && (
        <img
          src={defaultLogoUrl}
          alt="Logo"
          className="absolute top-12 left-12 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
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

export const doYouKnowTemplates: DoYouKnowTemplate[] = [DoYouKnowTemplate1, DoYouKnowTemplate2];