import chroma from 'chroma-js';
import cn from 'classnames';

export interface DoYouKnowSlide {
  title: string;
  fact: string;
  imageUrl: string;
  footer: string;
  websiteUrl: string;
  slideNumber: number;
}

export interface Colors {
  logoColors: { primary: string; secondary: string; accent: string[] };
  imageColors: string[];
  ensureContrast: (color1: string, color2: string) => string;
  vibrantLogoColor: string;
  vibrantTextColor: string;
  footerColor: string;
  vibrantAccentColor: string;
  backgroundColor: string;
  typography: { fontFamily: string; fontWeight: number; fontSize: string };
  graphicStyle: { borderRadius: string; iconStyle: string; filter: string };
  materialTheme: { [key: string]: string };
}

export interface DoYouKnowTemplate {
  id: string;
  name: string;
  slides: DoYouKnowSlide[];
  renderSlide: (slide: DoYouKnowSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
  colors: Colors;
}
// Template 1: Minimalist Design (Single Slide)
export const DoYouKnowTemplate1: DoYouKnowTemplate = {
  id: 'do-you-know-minimalist',
  name: 'Minimalist Do You Know',
  coverImageUrl: '/images/doyouknow-cover/cover1.png',
  slides: [
    {
      title: 'DO YOU KNOW?',
      fact: 'The human body contains about 0.2 milligrams of gold, most of it in the blood.',
      imageUrl: '',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
      slideNumber: 1,
    },
  ],
  colors: {
    logoColors: {
      primary: '#4B5EAA',
      secondary: '#F4F4F4',
      accent: ['#FFD700', '#FF6F61'],
    },
    imageColors: ['#4B5EAA', '#F4F4F4'],
    ensureContrast: (color1: string, color2: string) => {
      const contrastRatio = chroma.contrast(color1, color2);
      return contrastRatio < 4.5 ? chroma(color1).luminance(0.5).hex() : color1;
    },
    vibrantLogoColor: '#FFD700',
    vibrantTextColor: '#FFFFFF',
    footerColor: '#F4F4F4',
    vibrantAccentColor: '#FF6F61',
    backgroundColor: '#1A2526',
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: '48px',
    },
    graphicStyle: {
      borderRadius: '12px',
      iconStyle: 'rounded',
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
    },
    materialTheme: {
      primary: '#4B5EAA',
      secondary: '#F4F4F4',
      onSurface: '#FFFFFF',
      onSecondary: '#000000',
    },
  },
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      ensureContrast,
      vibrantLogoColor,
      vibrantTextColor,
      footerColor,
      vibrantAccentColor,
      backgroundColor,
      typography,
      graphicStyle,
    } = colors;

    // Fallback colors to prevent undefined errors
    const primaryColor = logoColors.primary || '#4B5EAA';
    const secondaryColor = logoColors.secondary || '#F4F4F4';
    const accentColor = vibrantAccentColor || '#FF6F61';
    const textColor = vibrantTextColor || '#FFFFFF';
    const footerTextColor = footerColor || '#F4F4F4';

    // Responsive layout adjustments
    const hasImage = !!slide.imageUrl;
    const isLongFact = slide.fact.length > 100;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col justify-between', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundImage: hasImage ? `url(${slide.imageUrl})` : 'none',
          backgroundColor: hasImage ? 'transparent' : backgroundColor,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
        }}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: hasImage ? chroma(backgroundColor).alpha(0.6).css() : chroma(backgroundColor).alpha(0.8).css(),
          }}
        />

        {/* Abstract Shapes */}
        {/* Top-Left Circle */}
        <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="50" fill="url(#gradient)" fillOpacity="0.2" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: secondaryColor, stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom-Right Circle */}
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="50" fill="url(#gradient)" fillOpacity="0.2" />
          </svg>
        </div>

        {/* Logo (Top-Right) */}
        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-20"
            style={{
              borderRadius: graphicStyle.borderRadius,
              boxShadow: `0 4px 12px ${chroma(primaryColor).alpha(0.3).css()}`,
            }}
          />
        )}

        {/* Content Section (Centered) */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-16">
          {/* Small Question Mark Icon Above Title */}
          <div className="mb-8">
            <svg
              className="w-24 h-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ stroke: accentColor }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5h2a4 4 0 014 4v1a3 3 0 01-3 3h-1a2 2 0 00-2 2v2m0 0h2m-1-6v6m0 4h0"
              />
            </svg>
          </div>

          {/* Title */}
          <h2
            className={cn('text-center font-bold mb-6 leading-tight', {
              'text-6xl': !isLongFact,
              'text-5xl': isLongFact,
            })}
            style={{
              color: textColor,
              fontSize: typography.fontSize,
              textShadow: `0 2px 4px ${chroma(textColor).alpha(0.5).css()}`,
            }}
          >
            {slide.title}
          </h2>

          {/* Gradient Underline */}
          <div className="w-1/3 h-1 mb-10">
            <svg viewBox="0 0 100 1" className="w-full h-full">
              <line x1="0" y1="0" x2="100" y2="0" stroke="url(#gradient)" strokeWidth="2" />
            </svg>
          </div>

          {/* Fact */}
          <p
            className={cn('text-center leading-relaxed max-w-4xl', {
              'text-3xl': !isLongFact,
              'text-2xl': isLongFact,
            })}
            style={{
              color: textColor,
              fontSize: `calc(${typography.fontSize} * 0.6)`,
              textShadow: `0 2px 4px ${chroma(textColor).alpha(0.5).css()}`,
            }}
          >
            {slide.fact}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 flex justify-between items-center pb-16 px-16">
          {/* Footer (Bottom-Left) */}
          <span
            className="text-2xl"
            style={{ color: footerTextColor }}
          >
            @{slide.footer}
          </span>

          {/* Website URL (Bottom-Right) */}
          <a
            href={slide.websiteUrl}
            className="text-2xl hover:underline"
            style={{ color: footerTextColor }}
          >
            {slide.websiteUrl}
          </a>
        </div>
      </div>
    );
  },
};
// Template 2: Fun Fact Design with Border (Single Slide)
// const DoYouKnowTemplate2: DoYouKnowTemplate = {
//   id: 'do-you-know-fun-fact',
//   name: 'Fun Fact Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover2.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Octopuses have three hearts and can change color to blend into their surroundings.',
//       imageUrl: '/images/background4.png',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white border-4 border-teal-500"
//       style={{
//         backgroundImage: `url(${slide.imageUrl})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundColor: '#1a1a1a',
//       }}
//     >
//       {/* Background Overlay */}
//       <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>

//       {/* Logo (Top-Right) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Content Section (Centered with Border) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         <div className="bg-teal-500 bg-opacity-20 p-6 rounded-lg border-2 border-teal-300">
//           <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-center">
//             {slide.title}
//           </h2>
//           <p className="text-base md:text-xl max-w-lg text-center leading-relaxed">
//             {slide.fact}
//           </p>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex flex-col items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Website URL (Left) and Footer (Right) */}
//         <div className="w-full flex justify-between items-center">
//           <a href={slide.websiteUrl} className="text-teal-300 text-sm md:text-base hover:underline">
//             {slide.websiteUrl}
//           </a>
//           <span className="text-teal-300 text-sm md:text-base">{slide.footer}</span>
//         </div>
//       </div>
//     </div>
//   ),
// };

// // Template 3: Tech-Themed Design (Previous Template)
// const DoYouKnowTemplate3: DoYouKnowTemplate = {
//   id: 'do-you-know-tech',
//   name: 'Tech Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover3.png',
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'In a few decades, we may experience some terrible things. Because according to experts, artificial intelligence will be able to achieve the ability to do about 40% of human tasks equally.',
//       imageUrl: '', // Remove background image; we'll use a gradient
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
//       style={{
//         background: 'linear-gradient(to bottom, #1E3A8A, #111827)', // Futuristic dark blue gradient
//         backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', // Particle effect
//       }}
//     >
//       {/* Abstract Shapes (Circuit Patterns) */}
//       {/* Top-Left Circuit Pattern */}
//       <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
//         <svg viewBox="0 0 100 100" className="w-full h-full">
//           <path
//             d="M20 80 H40 V60 H60 V40 H80"
//             fill="none"
//             stroke="url(#circuit-gradient)"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//           <defs>
//             <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.5 }} />
//               <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 0.5 }} />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Bottom-Right Circuit Pattern */}
//       <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 pointer-events-none">
//         <svg viewBox="0 0 100 100" className="w-full h-full">
//           <path
//             d="M20 80 H40 V60 H60 V40 H80"
//             fill="none"
//             stroke="url(#circuit-gradient)"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </div>



//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         {/* Title (Top-Center with Glowing Effect) */}
//         <h2
//           className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center text-white"
//           style={{
//             textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.4)',
//           }}
//         >
//           {slide.title}
//         </h2>

//         {/* Gradient Underline */}
//         <div className="w-1/2 h-1 mb-8">
//           <svg viewBox="0 0 100 1" className="w-full h-full">
//             <line x1="0" y1="0" x2="100" y2="0" stroke="url(#gradient)" strokeWidth="2" />
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
//                 <stop offset="100%" style={{ stopColor: '#50E3C2', stopOpacity: 1 }} />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>

//         {/* Fact Content (Futuristic Box) */}
//         <div
//           className="relative bg-gray-900 bg-opacity-80 p-6 rounded-lg max-w-md border-2"
//           style={{
//             borderImage: 'linear-gradient(to right, #3B82F6, #60A5FA) 1',
//             boxShadow: '0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
//           }}
//         >
//           <p className="text-base md:text-lg leading-relaxed text-white">{slide.fact}</p>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex justify-between items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Footer (Bottom-Left) */}
//         <span className=" text-sm md:text-base">
//           @{slide.footer}
//         </span>

//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className=" text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// // Template 4: Playful Robot Design (Based on the New Image)
// const DoYouKnowTemplate4: DoYouKnowTemplate = {
//   id: 'do-you-know-robot',
//   name: 'Robot Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover4.png',
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Sloths are one of the slowest animals to walk, even in their digestion process. They live a slow-paced lifestyle, but surprisingly they are strong swimmers.',
//       imageUrl: '', // Placeholder for the robot illustration
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
//       style={{
//         background: 'linear-gradient(to bottom, #1E3A8A, #111827)', // Futuristic dark blue gradient
//         backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)', // Particle effect
//       }}
//     >

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         {/* Title with Glowing Effect */}
//         <h2
//           className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center text-white"
//           style={{
//             textShadow: '0 0 10px rgba(234, 179, 8, 0.8), 0 0 20px rgba(234, 179, 8, 0.4)',
//           }}
//         >
//           {slide.title}
//         </h2>

//         {/* Gradient Underline */}
//         <div className="w-1/2 h-1 mb-8">
//           <svg viewBox="0 0 100 1" className="w-full h-full">
//             <line x1="0" y1="0" x2="100" y2="0" stroke="url(#gradient)" strokeWidth="2" />
//             <defs>
//               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#EAB308', stopOpacity: 1 }} />
//                 <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>

//         {/* Fact Content (Styled Box) */}
//         <div
//           className="relative bg-gray-900 bg-opacity-80 p-6 rounded-lg max-w-md border-2"
//           style={{
//             borderImage: 'linear-gradient(to right, #EAB308, #F59E0B) 1',
//             boxShadow: '0 0 15px rgba(234, 179, 8, 0.5), 0 0 30px rgba(234, 179, 8, 0.3)',
//           }}
//         >
//           <p className="text-base md:text-lg leading-relaxed text-white">{slide.fact}</p>
//         </div>
//       </div>

//       {/* Robot Illustration (Bottom-Right) */}
//       <div className="absolute bottom-0 right-0 z-10">
//         <div className="relative">
//           {/* Glowing Gradient Circle Background */}
//           <div
//             className="absolute inset-0 w-48 h-48 md:w-64 md:h-64 rounded-full transform translate-x-4 translate-y-4"
//             style={{
//               background: 'radial-gradient(circle, #EAB308 0%, transparent 70%)',
//               boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)',
//             }}
//           ></div>
//           {/* Robot Image */}
//           <div
//             className="relative w-48 h-48 md:w-64 md:h-64 object-contain z-10"
//           />
//           {/* Question Mark */}
//           <span className="absolute bottom-12 right-12 text-4xl md:text-9xl text-yellow-500 z-20">?</span>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex justify-between items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Footer (Bottom-Left) */}
//         <span className=" text-sm md:text-base ">
//           @{slide.footer}
//         </span>

//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className=" text-sm md:text-base hover:underline "
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// const DoYouKnowTemplate5: DoYouKnowTemplate = {
//   id: 'do-you-know-neon',
//   name: 'Neon Question Mark Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover5.png',
//   slides: [
//     {
//       title: 'QUESTION?',
//       fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dignissim pretium consectetur. Curabitur tempor posuere massa in.',
//       imageUrl: '', // No image used in this template
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
//       style={{
//         background: 'linear-gradient(to bottom, #1C2526, #2A3B5A)', // Gradient dark blue background
//         backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)', // Subtle particle effect
//         border: '2px solid',
//         borderImage: 'linear-gradient(to right, #EF4444, #F87171) 1', // Neon gradient border
//       }}
//     >
//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Neon Circle (Centered, behind content) */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
//         <div className="relative">
//           {/* Neon Circle */}
//           <div
//             className="w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-red-500"
//             style={{
//               boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)',
//             }}
//           ></div>
//           {/* Neon Question Mark (Top-Right of Circle) */}
//           <span
//             className="absolute top-0 right-40 text-5xl md:text-9xl text-red-500 z-10"
//             style={{
//               textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)',
//             }}
//           >
//             ?
//           </span>
//         </div>
//       </div>

//       {/* Content Section (Centered, inside the circle) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         {/* Title with Neon Glow */}
//         <h2
//           className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-center text-white"
//           style={{
//             textShadow: '0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)',
//           }}
//         >
//           {slide.title}
//         </h2>

//         {/* Fact with Neon Glow */}
//         <p
//           className="text-base md:text-xl max-w-md text-center leading-relaxed text-white"
//           style={{
//             textShadow: '0 0 5px rgba(239, 68, 68, 0.6), 0 0 10px rgba(239, 68, 68, 0.3)',
//           }}
//         >
//           {slide.fact}
//         </p>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex justify-between items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-red-500 text-sm md:text-base">
//           @{slide.footer}
//         </span>

//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-red-500 text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// const DoYouKnowTemplate6: DoYouKnowTemplate = {
//   id: 'do-you-know-interesting-facts',
//   name: 'Interesting Facts Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover6.png',
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna al iquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ut laoreet dolore magna aliquam erat volutpat.',
//       imageUrl: '', // No image used in this template
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-between text-black"
//       style={{
//         background: 'linear-gradient(to bottom,rgb(177, 196, 102),rgb(150, 176, 214))', // Softer gray gradient background
//         backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(228, 253, 0, 0.98) 0%, transparent 70%)', // Subtle texture
//       }}
//     >
//       {/* Decorative Shapes (Abstract Gradient Circles) */}
//       <div
//         className="absolute top-0 left-0 w-40 h-40 rounded-full"
//         style={{
//           background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
//           transform: 'translate(-40%, -40%)',
//         }}
//       ></div>
//       <div
//         className="absolute bottom-0 right-0 w-40 h-40 rounded-full"
//         style={{
//           background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
//           transform: 'translate(40%, 40%)',
//         }}
//       ></div>

//       {/* Crown Icon (Top-Left with Gradient) */}
//       <div className="absolute top-4 left-4 z-10">
//         <svg
//           className="w-6 h-6"
//           fill="url(#crown-gradient)"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-5z" />
//           <defs>
//             <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
//               <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
//         {/* Title */}
//         <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
//           {slide.title}
//         </h2>
//         {/* Decorative Underline */}
//         <div className="w-1/2 h-1 mb-6">
//           <svg viewBox="0 0 100 1" className="w-full h-full">
//             <line x1="0" y1="0" x2="100" y2="0" stroke="url(#underline-gradient)" strokeWidth="2" />
//             <defs>
//               <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
//                 <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//         {/* Fact */}
//         <p className="text-base md:text-lg text-gray-700 max-w-md leading-relaxed">
//           {slide.fact}
//         </p>
//       </div>

//       {/* Logo (Top-Right) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//           style={{
//             filter: 'invert(100%)', // Convert white logo to black
//           }}
//         />
//       )}

//       {/* Bottom Section (Footer and Website URL) */}
//       <div className="relative z-10 flex justify-between items-center pb-4 px-6 md:px-10 w-full">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-gray-700 text-sm md:text-base">
//           @{slide.footer}
//         </span>
//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-gray-700 text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// const DoYouKnowTemplate7: DoYouKnowTemplate = {
//   id: 'do-you-know-watercolor',
//   name: 'Watercolor Question Mark Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover7.png',
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Lorem ipsum is simply pasted text from the typesetting industry and needs to remove it.',
//       imageUrl: '', // No image used in this template
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-between text-blue-600"
//       style={{
//         background: 'linear-gradient(to bottom, #F9FAFB, #E5E7EB)', // Very light gray background for contrast
//       }}
//     >
//       {/* Watercolor Splash Background */}
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 20% 30%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
//             radial-gradient(circle at 80% 70%, rgba(219, 39, 119, 0.3) 0%, transparent 50%),
//             radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.3) 0%, transparent 60%)
//           `, // Watercolor splash effect with soft blues, pinks, and purples
//           opacity: 0.8,
//         }}
//       ></div>

//       {/* Watercolor Brush Stroke (Top-Left) */}
//       <div
//         className="absolute top-0 left-0 w-48 h-24"
//         style={{
//           background: 'linear-gradient(to right, rgba(147, 197, 253, 0.5), transparent)',
//           clipPath: 'polygon(0 0, 100% 20%, 80% 100%, 0 80%)', // Irregular brush stroke shape
//           transform: 'rotate(-10deg)',
//         }}
//       ></div>

//       {/* Watercolor Brush Stroke (Bottom-Right) */}
//       <div
//         className="absolute bottom-0 right-0 w-48 h-24"
//         style={{
//           background: 'linear-gradient(to left, rgba(219, 39, 119, 0.5), transparent)',
//           clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 80%)', // Irregular brush stroke shape
//           transform: 'rotate(10deg)',
//         }}
//       ></div>

//       {/* Crown Icon (Top-Left with Watercolor Gradient) */}
//       <div className="absolute top-4 left-4 z-10">
//         <svg
//           className="w-6 h-6"
//           fill="url(#crown-gradient)"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6l3-5z" />
//           <defs>
//             <linearGradient id="crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" style={{ stopColor: '#93C5FD', stopOpacity: 1 }} />
//               <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>


//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
//         {/* Watercolor Question Mark Frame (Above Title) */}
//         <div className="relative mb-6">
//           {/* Watercolor Frame with Quotation Marks */}
//           <div
//             className="absolute inset-0 w-24 h-24 md:w-32 md:h-32"
//             style={{
//               background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 70%)',
//               border: '3px solid',
//               borderImage: 'linear-gradient(to right, #93C5FD, #DB2777) 1',
//               clipPath: 'polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)', // Irregular watercolor border
//               transform: 'translate(-50%, -50%)',
//               top: '50%',
//               left: '50%',
//             }}
//           >
//             {/* Top-Left Quotation Mark */}
//             <span className="absolute top-0 left-0 text-3xl text-blue-400 transform -translate-x-1/2 -translate-y-1/2">
//               “
//             </span>
//             {/* Bottom-Right Quotation Mark */}
//             <span className="absolute bottom-0 right-0 text-3xl text-blue-400 transform translate-x-1/2 translate-y-1/2">
//               ”
//             </span>
//           </div>
//           {/* Question Mark */}
//           <span className="relative text-5xl md:text-6xl text-blue-400 z-10">?</span>
//         </div>

//         {/* Title */}
//         <h2
//           className="text-4xl md:text-5xl font-bold text-blue-600 mb-4 leading-tight m-4"
//           style={{
//             fontFamily: "'Playfair Display', serif", // Elegant serif font for a handwritten feel
//           }}
//         >
//           {slide.title}
//         </h2>
//         {/* Fact */}
//         <p className="text-base md:text-lg text-blue-500 max-w-md leading-relaxed">
//           {slide.fact}
//         </p>
//       </div>

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//           style={{
//             filter: 'invert(100%)', // Convert white logo to black
//           }}
//         />
//       )}

//       {/* Bottom Section (Footer and Website URL) */}
//       <div className="relative z-10 flex justify-between items-center pb-4 px-6 md:px-10 w-full">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-blue-600 text-sm md:text-base">
//           @{slide.footer}
//         </span>
//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-blue-600 text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// const DoYouKnowTemplate8: DoYouKnowTemplate = {
//   id: 'do-you-know-glowing-question',
//   name: 'Glowing Question Mark Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover8.png',
//   slides: [
//     {
//       title: 'LOOKING FOR AN ANSWER?',
//       fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna al iquam erat volutpat.',
//       imageUrl: '', // No image used in this template
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex text-white"
//       style={{
//         background: 'linear-gradient(to bottom, #0A1A3A, #1A2A5A)', // Darker cosmic gradient
//         backgroundImage: `
//           radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 0.1%, transparent 1%),
//           radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.2) 0.1%, transparent 1%),
//           radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0.1%, transparent 1%),
//           radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2) 0.1%, transparent 1%)
//         `, // Starry background effect
//       }}
//     >

//       {/* Left Side: Title and Fact */}
//       <div className="flex-1 flex flex-col justify-center p-6 md:p-10 z-10">
//         <h2
//           className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
//           style={{
//             fontFamily: "'Montserrat', sans-serif", // Modern sans-serif font
//             textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)', // Subtle glow
//           }}
//         >
//           {slide.title}
//         </h2>
//         <p
//           className="text-lg md:text-xl text-gray-200 max-w-md leading-loose"
//           style={{
//             fontFamily: "'Open Sans', sans-serif", // Clean sans-serif font for readability
//             textShadow: '0 0 5px rgba(59, 130, 246, 0.3)', // Subtle glow for consistency
//           }}
//         >
//           {slide.fact}
//         </p>
//       </div>

//       {/* Right Side: Glowing 3D Question Mark with Sparkles */}
//       <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
//         <div className="relative">
//           {/* Sparkles Around Question Mark */}
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `
//                 radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.5) 1%, transparent 2%)
//               `, // Small sparkles
//             }}
//           ></div>
//           {/* Glowing Question Mark */}
//           <svg
//             className="w-40 h-40 md:w-48 md:h-48 text-blue-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 100 100"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{
//               filter: `
//                 drop-shadow(0 0 10px rgba(59, 130, 246, 0.9))
//                 drop-shadow(0 0 20px rgba(59, 130, 246, 0.7))
//                 drop-shadow(0 0 40px rgba(59, 130, 246, 0.5))
//               `, // Multi-layered glow
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//             }}
//           >
//             <path
//               d="M40 20c10 0 20 10 20 20s-10 20-20 20"
//               stroke="url(#glass-gradient)"
//             />
//             <circle cx="40" cy="70" r="5" fill="url(#glass-gradient)" />
//             {/* Define gradient for glass effect */}
//             <defs>
//               <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
//                 <stop offset="50%" style={{ stopColor: '#60A5FA', stopOpacity: 0.8 }} />
//                 <stop offset="100%" style={{ stopColor: '#93C5FD', stopOpacity: 0.6 }} />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//       </div>

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Bottom Section (Footer and Website URL) */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6 md:px-10 z-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-white text-sm md:text-base">
//           @{slide.footer}
//         </span>
//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-white text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };
// // Template 9: Simple Question Mark Background (Image 2)
// const DoYouKnowTemplate9: DoYouKnowTemplate = {
//   id: 'do-you-know-simple-question',
//   name: 'Simple Question Mark Background',
//   coverImageUrl: '/images/doyouknow-cover/cover9.png',
//   slides: [
//     {
//       title: 'QUESTION?',
//       fact: 'The human body contains about 0.2 milligrams of gold, most of which is in the blood.',
//       imageUrl: '/images/background7.jpg', // Placeholder path for the provided image
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-center text-white"
//       style={{
//         backgroundImage: `url(${slide.imageUrl})`, // Use the image as the background
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       {/* Subtle Overlay for Text Contrast */}
//       <div
//         className="absolute inset-0"
//         style={{
//           background: 'rgba(0, 0, 0, 0.4)', // Dark overlay to improve text readability
//         }}
//       ></div>


//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center">
//         {/* Question Mark in Circle with Smoky Glow */}
//         <div className="relative mb-6">
//           <div
//             className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
//             style={{
//               background: 'radial-gradient(circle, rgba(147, 197, 253, 0.3) 0%, transparent 70%)', // Smoky effect
//               borderImage: 'linear-gradient(to right, #93C5FD, #3B82F6) 1', // Gradient border to match the smoke
//               boxShadow: '0 0 15px rgba(147, 197, 253, 0.5), 0 0 30px rgba(147, 197, 253, 0.3)', // Glowing effect
//             }}
//           >
//             <span
//               className="text-6xl md:text-8xl text-white"
//               style={{
//                 textShadow: '0 0 10px rgba(147, 197, 253, 0.8)', // Subtle glow to match the smoke
//               }}
//             >
//               ?
//             </span>
//           </div>
//         </div>

//         {/* Title */}
//         <h2
//           className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
//           style={{
//             fontFamily: "'Montserrat', sans-serif", // Modern sans-serif font
//             textShadow: '0 0 10px rgba(147, 197, 253, 0.5)', // Subtle glow to match the smoke
//           }}
//         >
//           {slide.title}
//         </h2>
//         {/* Fact */}
//         {slide.fact && (
//           <p
//             className="text-base md:text-lg text-gray-200 max-w-md leading-relaxed"
//             style={{
//               fontFamily: "'Open Sans', sans-serif", // Clean sans-serif font for readability
//               textShadow: '0 0 5px rgba(147, 197, 253, 0.3)', // Subtle glow for consistency
//             }}
//           >
//             {slide.fact}
//           </p>
//         )}
//       </div>

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Bottom Section (Footer and Website URL) */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6 md:px-10 z-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-white text-sm md:text-base">
//           @{slide.footer}
//         </span>
//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-white text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };

// // Template 10: Gradient Circle with Bulb Icon (Custom Design)
// const DoYouKnowTemplate10: DoYouKnowTemplate = {
//   id: 'do-you-know-bulb-gradient',
//   name: 'Gradient Circle with Bulb Icon',
//   coverImageUrl: '/images/doyouknow-cover/cover10.png',
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod.',
//       imageUrl: '', // No image used in this template
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[600px] rounded-lg overflow-hidden flex flex-col items-center justify-center text-white"
//       style={{
//         background: 'linear-gradient(to bottom right, #6B21A8, #DB2777)', // Vibrant purple to pink gradient
//       }}
//     >
//       {/* Subtle Background Sparkles */}
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 1%, transparent 2%),
//             radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 1%, transparent 2%),
//             radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 1%, transparent 2%)
//           `, // Sparkle effect
//           opacity: 0.5,
//         }}
//       ></div>

//       {/* Content Section (Centered with Glassmorphism) */}
//       <div
//         className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10 text-center"
//         style={{
//           background: 'rgba(255, 255, 255, 0.1)', // Frosted glass effect
//           backdropFilter: 'blur(10px)', // Glassmorphism blur
//           borderRadius: '20px',
//           border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
//           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Soft shadow
//           maxWidth: '80%',
//         }}
//       >
//         {/* Redesigned Bulb Icon with Radiant Glow */}
//         <div className="relative mb-6">
//           <svg
//             className="w-24 h-24 md:w-32 md:h-32"
//             viewBox="0 0 100 100"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{
//               filter: `
//                 drop-shadow(0 0 10px rgba(240, 171, 252, 0.8))
//                 drop-shadow(0 0 20px rgba(240, 171, 252, 0.5))
//                 drop-shadow(0 0 40px rgba(240, 171, 252, 0.3))
//               `, // Multi-layered glow effect
//             }}
//           >
//             {/* Radiant Background Glow */}
//             <circle
//               cx="50"
//               cy="50"
//               r="40"
//               fill="url(#glow-gradient)"
//               style={{
//                 opacity: 0.3,
//               }}
//             />
//             {/* Bulb Icon Path */}
//             <path
//               d="M50 30a10 10 0 00-10 10v10a10 10 0 0020 0V40a10 10 0 00-10-10z"
//               fill="url(#bulb-gradient)"
//               stroke="url(#bulb-gradient)"
//               strokeWidth="2"
//             />
//             <rect
//               x="45"
//               y="60"
//               width="10"
//               height="5"
//               fill="url(#bulb-gradient)"
//             />
//             <path
//               d="M47 65h6m-3 3v3"
//               stroke="url(#bulb-gradient)"
//               strokeWidth="2"
//               strokeLinecap="round"
//             />
//             {/* Light Rays */}
//             <path
//               d="M50 20v-5M50 85v5M30 50h-5m45 0h5"
//               stroke="rgba(255, 255, 255, 0.5)"
//               strokeWidth="2"
//               strokeLinecap="round"
//               style={{
//                 opacity: 0.7,
//               }}
//             />
//             {/* Define Gradients */}
//             <defs>
//               <linearGradient id="bulb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: '#F472B6', stopOpacity: 1 }} />
//                 <stop offset="50%" style={{ stopColor: '#E879F9', stopOpacity: 0.9 }} />
//                 <stop offset="100%" style={{ stopColor: '#C084FC', stopOpacity: 0.8 }} />
//               </linearGradient>
//               <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
//                 <stop offset="0%" style={{ stopColor: '#F472B6', stopOpacity: 0.5 }} />
//                 <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
//               </radialGradient>
//             </defs>
//           </svg>
//           {/* Subtle Sparkles Around Bulb */}
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: `
//                 radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.5) 1%, transparent 2%),
//                 radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.5) 1%, transparent 2%)
//               `, // Sparkle effect
//               opacity: 0.5,
//             }}
//           ></div>
//         </div>

//         {/* Title */}
//         <h2
//           className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
//           style={{
//             fontFamily: "'Montserrat', sans-serif", // Modern sans-serif font
//             textShadow: '0 0 10px rgba(240, 171, 252, 0.5)', // Subtle glow to match the bulb
//           }}
//         >
//           {slide.title}
//         </h2>
//         {/* Fact */}
//         <p
//           className="text-base md:text-lg text-gray-100 max-w-md leading-relaxed"
//           style={{
//             fontFamily: "'Open Sans', sans-serif", // Clean sans-serif font for readability
//           }}
//         >
//           {slide.fact}
//         </p>
//       </div>

//       {/* Logo (Top-Right) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-1 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Bottom Section (Footer and Website URL) */}
//       <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6 md:px-10 z-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-white text-sm md:text-base">
//           @{slide.footer}
//         </span>
//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-white text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };
// const DoYouKnowTemplate11: DoYouKnowTemplate = {
//   id: 'do-you-know-minimalist',
//   name: 'Minimalist Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover1.png', // Thumbnail for the template
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Besides being done conventionally, it can be done through online media on the internet, which is more efficient in terms of time and budget.',
//       imageUrl: '', // No background image; we'll use a solid color with icons
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-black"
//       style={{
//         background: '#B3D7F5', // Light blue background as per the image
//       }}
//     >
//       {/* Light Bulb Icon (Top-Right) */}
//       <div className="absolute top-10 right-10 w-16 h-16 md:w-20 md:h-20 pointer-events-none">
//         <svg
//           viewBox="0 0 24 24"
//           className="w-full h-full text-yellow-400"
//           fill="currentColor"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2a6 6 0 00-6 6c0 2.5 1.5 4.5 3.5 5.5v2h5v-2c2-1 3.5-3 3.5-5.5a6 6 0 00-6-6zm0 16a1 1 0 01-1-1h2a1 1 0 01-1 1z" />
//         </svg>
//       </div>

//       {/* Paper Airplane (Bottom-Left) */}
//       <div className="absolute bottom-10 left-10 w-16 h-16 md:w-20 md:h-20 pointer-events-none">
//         <svg
//           viewBox="0 0 24 24"
//           className="w-full h-full text-white"
//           fill="currentColor"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
//         </svg>
//       </div>

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-2 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         {/* Title */}
//         <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-center">
//           {slide.title}
//         </h2>

//         {/* Fact */}
//         <p className="text-lg md:text-xl max-w-md text-center leading-relaxed">
//           {slide.fact}
//         </p>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex justify-between items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-gray-700 text-sm md:text-base">
//           @{slide.footer}
//         </span>

//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-gray-700 text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };
// const DoYouKnowTemplate12: DoYouKnowTemplate = {
//   id: 'do-you-know-minimalist',
//   name: 'Minimalist Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover1.png', // Thumbnail for the template
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'The human body contains about 0.2 milligrams of gold, most of it in the blood.',
//       imageUrl: '', // No background image; we'll use a solid color with icons
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-between text-black"
//       style={{
//         background: '#B3D7F5', // Light blue background as per the image
//       }}
//     >
//       {/* Light Bulb Icon (Top-Right) */}
//       <div className="absolute top-10 right-10 w-16 h-16 md:w-20 md:h-20 pointer-events-none">
//         <svg
//           viewBox="0 0 24 24"
//           className="w-full h-full text-yellow-400"
//           fill="currentColor"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M12 2a6 6 0 00-6 6c0 2.5 1.5 4.5 3.5 5.5v2h5v-2c2-1 3.5-3 3.5-5.5a6 6 0 00-6-6zm0 16a1 1 0 01-1-1h2a1 1 0 01-1 1z" />
//         </svg>
//       </div>

//       {/* Paper Airplane (Bottom-Left) */}
//       <div className="absolute bottom-10 left-10 w-16 h-16 md:w-20 md:h-20 pointer-events-none">
//         <svg
//           viewBox="0 0 24 24"
//           className="w-full h-full text-white"
//           fill="currentColor"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
//         </svg>
//       </div>

//       {/* Logo (Top-Right, below icons) */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-2 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//         />
//       )}

//       {/* Content Section (Centered) */}
//       <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 md:p-10">
//         {/* Title */}
//         <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-center">
//           {slide.title}
//         </h2>

//         {/* Fact */}
//         <p className="text-lg md:text-xl max-w-md text-center leading-relaxed">
//           {slide.fact}
//         </p>
//       </div>

//       {/* Bottom Section */}
//       <div className="relative z-10 flex justify-between items-center pb-6 md:pb-10 px-6 md:px-10">
//         {/* Footer (Bottom-Left) */}
//         <span className="text-gray-700 text-sm md:text-base">
//           @{slide.footer}
//         </span>

//         {/* Website URL (Bottom-Right) */}
//         <a
//           href={slide.websiteUrl}
//           className="text-gray-700 text-sm md:text-base hover:underline"
//         >
//           {slide.websiteUrl}
//         </a>
//       </div>
//     </div>
//   ),
// };
// const DidYouKnowTemplate13: DoYouKnowTemplate  = {
//   id: 'did-you-know-bright',
//   name: 'Bright Did You Know',
//   coverImageUrl: '/images/didyouknow-cover/cover1.png', // Thumbnail for the template
//   slides: [
//     {
//       title: 'DID YOU KNOW?',
//       fact: 'Besides being done conventionally, it turns out that selling products can be done through online media on the internet, which is more efficient in terms of time, effort, and budget.',
//       footer: 'bitrox.tech',
//       imageUrl: '',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div
//       className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden flex flex-col justify-between"
//       style={{
//         background: '#CCEAFF', // Light blue background
//       }}
//     >
//       {/* Background Blobs */}
//       <div className="absolute left-0 top-0 w-32 h-32 rounded-br-full" style={{ background: '#B1DCFF' }}></div>
//       <div className="absolute right-0 bottom-0 w-32 h-32 rounded-tl-full" style={{ background: '#B1DCFF' }}></div>
      
//       {/* Logo */}
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-2 right-2 w-20 h-8 object-contain z-20"
//         />
//       )}

//       {/* Main Content Card */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-lg p-6 w-4/5 z-10">
//         {/* Title */}
//         <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-blue-800">
//           {slide.title}
//         </h2>
        
//         {/* Fact */}
//         <p className="text-sm md:text-base text-center text-gray-800">
//           {slide.fact}
//         </p>
//       </div>
      
//       {/* Light Bulb Icon */}
//       <div className="absolute top-12 right-12 md:top-16 md:right-20 z-20">
//         <div className="relative">
//           <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-400"></div>
//           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-4 md:h-5 bg-gray-700 rounded-b-lg"></div>
          
//           {/* Light Rays */}
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
//             <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
//           </div>
//           <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45">
//             <div className="w-2 h-6 bg-yellow-400 rounded-full"></div>
//           </div>
//           <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
//             <div className="w-6 h-2 bg-yellow-400 rounded-full"></div>
//           </div>
//         </div>
//       </div>
      
//       {/* Paper Airplane */}
//       <div className="absolute bottom-12 left-16 z-20">
//         <div className="w-12 h-12 md:w-16 md:h-16 transform rotate-12">
//           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 3L2 12H5V20H19V12H22L12 3Z" fill="#E6E6E6" stroke="#CCCCCC"/>
//           </svg>
//         </div>
//       </div>
      
//       {/* Footer */}
//       <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
//         <span className="text-xs md:text-sm text-blue-800">
//           @{slide.footer} | {slide.websiteUrl}
//         </span>
//       </div>
//     </div>
//   ),
// };
// const DoYouKnowTemplate14: DoYouKnowTemplate = {
//   id: 'do-you-know-modern-card',
//   name: 'Modern Card Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover3.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'A day on Venus is longer than its year. Venus takes 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun.',
//       imageUrl: '/images/space-bg.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full">
//           <div className="text-white text-center">
//             <h2 className="text-4xl md:text-5xl font-bold mb-6">{slide.title}</h2>
//             <p className="text-lg md:text-xl leading-relaxed">{slide.fact}</p>
//           </div>
//         </div>
        
//         <div className="absolute bottom-6 w-full px-8 flex justify-between text-white/80">
//           <span>@{slide.footer}</span>
//           <a href={slide.websiteUrl} className="hover:text-white">{slide.websiteUrl}</a>
//         </div>
//       </div>
//     </div>
//   ),
// };

// // Template 4: Neon Style
// const DoYouKnowTemplate15: DoYouKnowTemplate = {
//   id: 'do-you-know-neon',
//   name: 'Neon Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover4.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-black">
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="text-center">
//           <h2 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse">
//             {slide.title}
//           </h2>
//           <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed">
//             {slide.fact}
//           </p>
//         </div>
        
//         <div className="absolute bottom-6 w-full px-8 flex justify-between text-cyan-400">
//           <span>@{slide.footer}</span>
//           <a href={slide.websiteUrl} className="hover:text-purple-400">{slide.websiteUrl}</a>
//         </div>
//       </div>
//     </div>
//   ),
// };

// // Template 5: Split Design
// const DoYouKnowTemplate16: DoYouKnowTemplate = {
//   id: 'do-you-know-split',
//   name: 'Split Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover5.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'The world\'s oldest known living tree is a Great Basin Bristlecone Pine that is over 5,000 years old.',
//       imageUrl: '/images/nature-bg.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex">
//       <div className="w-1/2 bg-emerald-900 p-8 flex flex-col justify-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">{slide.title}</h2>
//         <p className="text-lg md:text-xl text-emerald-100 leading-relaxed">{slide.fact}</p>
//       </div>
      
//       <div className="w-1/2 relative">
//         <img src={slide.imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
//         <div className="absolute inset-0 bg-black/40"></div>
        
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//           />
//         )}
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-white">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-emerald-300">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 6: Minimal Dark
// const DoYouKnowTemplate17: DoYouKnowTemplate = {
//   id: 'do-you-know-minimal-dark',
//   name: 'Minimal Dark Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover6.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'A single cloud can weigh more than 1 million pounds.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-zinc-900 p-8">
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="h-full flex flex-col justify-center items-center">
//         <div className="max-w-2xl text-center">
//           <h2 className="text-4xl md:text-5xl font-bold mb-2 text-white">{slide.title}</h2>
//           <div className="w-20 h-1 bg-zinc-700 mx-auto mb-8"></div>
//           <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-zinc-500">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-white">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 7: Gradient Cards
// const DoYouKnowTemplate18: DoYouKnowTemplate = {
//   id: 'do-you-know-gradient-cards',
//   name: 'Gradient Cards Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover7.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Bananas are berries, but strawberries aren\'t.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500">
//       <div className="absolute inset-0 bg-black/20"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 max-w-2xl">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">{slide.title}</h2>
//           <p className="text-xl md:text-2xl text-white/90 text-center leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-white/80">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-white">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 8: Modern Minimal
// const DoYouKnowTemplate19: DoYouKnowTemplate = {
//   id: 'do-you-know-modern-minimal',
//   name: 'Modern Minimal Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover8.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'The first oranges weren\'t orange; they were green.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-slate-100">
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="h-full flex flex-col justify-center items-center p-8">
//         <div className="max-w-2xl w-full">
//           <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">{slide.title}</h2>
//           <div className="h-px w-full bg-gradient-to-r from-slate-300 to-slate-100 mb-8"></div>
//           <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-slate-500">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-slate-900">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 9: Geometric
// const DoYouKnowTemplate20: DoYouKnowTemplate = {
//   id: 'do-you-know-geometric',
//   name: 'Geometric Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover9.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Honeybees can recognize human faces.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-amber-50">
//       <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="bg-white rounded-lg shadow-xl p-10 max-w-2xl">
//           <div className="text-amber-500 text-4xl mb-4">?</div>
//           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{slide.title}</h2>
//           <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-amber-800">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-amber-600">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 10: Tech Style
// const DoYouKnowTemplate21: DoYouKnowTemplate = {
//   id: 'do-you-know-tech',
//   name: 'Tech Style Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover10.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'The first computer mouse was made of wood.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-gray-900">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(51,65,85,0.5),rgba(15,23,42,0))]"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="max-w-2xl text-center">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">{slide.title}</h2>
//           <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-gray-400">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-blue-400">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 11: Nature Theme
// const DoYouKnowTemplate22: DoYouKnowTemplate = {
//   id: 'do-you-know-nature',
//   name: 'Nature Theme Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover11.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Trees can communicate with each other through an underground network of fungi.',
//       imageUrl: '/images/forest-bg.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden">
//       <img src={slide.imageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
//       <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="bg-white/10 backdrop-blur rounded-lg p-10 max-w-2xl border border-white/20">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">{slide.title}</h2>
//           <p className="text-xl md:text-2xl text-green-50 text-center leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-green-100">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-white">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };

// // Template 12: Futuristic
// const DoYouKnowTemplate23: DoYouKnowTemplate = {
//   id: 'do-you-know-futuristic',
//   name: 'Futuristic Do You Know',
//   coverImageUrl: '/images/doyouknow-cover/cover12.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Quantum computers can perform calculations in 200 seconds that would take traditional supercomputers 10,000 years.',
//       imageUrl: '',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl) => (
//     <div className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-black">
//       <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20"></div>
      
//       {addLogo && (
//         <img
//           src={defaultLogoUrl}
//           alt="Logo"
//           className="absolute top-4 right-4 w-32 h-12 object-contain z-20"
//         />
//       )}

//       <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//         <div className="max-w-2xl text-center space-y-8">
//           <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
//             {slide.title}
//           </h2>
//           <p className="text-xl md:text-2xl text-white/90 leading-relaxed">{slide.fact}</p>
//         </div>
//       </div>
      
//       <div className="absolute bottom-6 w-full px-8 flex justify-between text-cyan-400">
//         <span>@{slide.footer}</span>
//         <a href={slide.websiteUrl} className="hover:text-violet-400">{slide.websiteUrl}</a>
//       </div>
//     </div>
//   ),
// };


export const doYouKnowTemplates: DoYouKnowTemplate[] = [
  DoYouKnowTemplate1,
  // DoYouKnowTemplate2,
  // DoYouKnowTemplate3,
  // DoYouKnowTemplate4,
  // DoYouKnowTemplate5,
  // DoYouKnowTemplate6,
  // DoYouKnowTemplate7,
  // DoYouKnowTemplate8,
  // DoYouKnowTemplate9,
  // DoYouKnowTemplate10,
  // DoYouKnowTemplate11,
  // DoYouKnowTemplate12,
  // DidYouKnowTemplate13,
  // DoYouKnowTemplate14,
  // DoYouKnowTemplate15,
  // DoYouKnowTemplate16,
  // DoYouKnowTemplate17,
  // DoYouKnowTemplate18,
  // DoYouKnowTemplate19,
  // DoYouKnowTemplate20,
  // DoYouKnowTemplate21,
  // DoYouKnowTemplate22,
  // DoYouKnowTemplate23,
  
];