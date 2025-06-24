import chroma from "chroma-js";
import cn from 'classnames';
import { blendColors, ensureContrast } from "../Utilities/colorContraxt";

export interface ImageSlide {
  title: string;
  description: string;
  imageUrl: string;
  footer: string;
  websiteUrl: string;
}

export interface Colors {
  logoColors: { primary: string; secondary: string; accent: string[] };
  imageColors: string[];

  glowColor: string;
  // logoGlowColor: string;
  complementaryGlowColor: string;
  ensureContrast: (color1: string, color2: string) => string;
  vibrantLogoColor: string;
  vibrantTextColor: string;
  footerColor: string;
  backgroundColor: string;
  typography: { fontFamily: string; fontWeight: number; fontSize: string };
  graphicStyle: { borderRadius: string; iconStyle: string; filter: string };
  materialTheme: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
  };

}

export interface ImageTemplate {
  id: string;
  name: string;
  slides: ImageSlide[];
  renderSlide: (slide: ImageSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
}

// const ImageTemplate1: ImageTemplate = {
//     id: 'teddy-bear-love',
//     name: 'Teddy Bear Love',
//     coverImageUrl:'/images/image-cover/cover1.png', 
//     slides: [
//         {
//             title: 'ENCOURAGING WORDS',
//             description: '"Is it too soon to say \'I love you\'?"',
//             imageUrl: '/images/background14.jpg', 
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//         // Fallback colors if extraction fails
//       const logoColors = colors?.logoColors || ['#FF5733', '#33FF57', '#5733FF', '#FFFFFF', '#000000'];
//       const imageColors = colors?.imageColors || ['#A0A0A0', '#D3D3D3', '#4A4A4A', '#FFFFFF', '#000000'];
//       const ensureContrast = colors?.ensureContrast ?? ((textColor: string) => textColor);


//       // Select colors for styling
//       const backgroundColor = imageColors[0]; 
//       const textColor = logoColors[0];
//       const accentColor = logoColors[1]; 
//       const footerColor = imageColors[2]; 

//       // Ensure text readability
//       const adjustedTextColor = ensureContrast(textColor, backgroundColor);
//     const adjustedFooterColor = ensureContrast(footerColor, backgroundColor);
//       return (
//         <div
//             className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-end text-white"
//             style={{
//                 backgroundImage: `url(${slide.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundColor: backgroundColor, 
//             }}
//         >
//             {/* Logo (Top-Right) */}
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//                 />
//             )}

//             {/* Content Section (Bottom) */}
//             <div className="relative z-10 bg-black bg-opacity-50 p-6 md:p-8">
//                 {/* Title */}
//                 <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center uppercase" style={{ color: adjustedTextColor }}>
//                     {slide.title}

//                 </h2>

//                 {/* Description */}
//                 <p className="text-lg md:text-xl text-center italic" style={{ color: adjustedTextColor }}>
//                     {slide.description}
//                 </p>

//                 {/* Footer (Bottom-Right) */}
//                 <div className="flex justify-end mt-4">
//                     <span className="text-sm md:text-base text-gray-300" style={{ color: adjustedFooterColor }}>
//                         @{slide.footer}
//                     </span>
//                 </div>
//             </div>
//         </div>
//       )
//     }

// };

//     id: 'whimsical-garden',
//     name: 'Whimsical Garden',
//     coverImageUrl: '/images/whimsical-garden-cover/cover2.png',
//     slides: [
//         {
//             title: 'FUN FACT',
//             description: 'Butterflies taste with their feet!',
//             imageUrl: '/images/background15.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div
//             className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-center text-white"
//             style={{
//                 backgroundImage: `url(${slide.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}
//         >
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 h-12 object-contain z-20 md:w-40 md:h-16"

//                 />
//             )}
//             <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-8">
//                 <div
//                     className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 border-4 border-dashed border-black-300 shadow-lg"
//                     style={{ maxWidth: '80%' }}
//                 >
//                     <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-yellow-300 uppercase">
//                         {slide.title}
//                     </h2>
//                     <p className="text-lg md:text-xl text-center text-white">
//                         {slide.description}
//                     </p>
//                     <div className="flex justify-center mt-4">
//                         <span className="text-sm md:text-base text-yellow-200">
//                             @{slide.footer}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     ),
// };
// export const ImageTemplate3: ImageTemplate = {
//   id: 'dna-mystery-m3',
//   name: 'DNA Mystery M3',
//   coverImageUrl: '/images/image-cover/cover2.png',
//   slides: [
//     {
//       title: 'A MYSTERIOUS DISCOVERY',
//       description: '"Unraveling the secrets of ancient DNA hidden within us."',
//       imageUrl: '/images/background16.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       materialTheme,
//       typography,
//       graphicStyle,
//       ensureContrast,
//     } = colors;

//     // Responsive layout adjustments
//     const hasImage = !!slide.imageUrl;
//     const isLongText = slide.description.length > 100;

//     return (
//       <div
//         className={cn('relative w-[1080px] h-[1080px] flex flex-col justify-between', {
//           'rounded-lg': graphicStyle.borderRadius !== '0px',
//         })}
//         style={{
//           backgroundImage: hasImage ? `url(${slide.imageUrl})` : 'none',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: materialTheme.background,
//           fontFamily: typography.fontFamily,
//           fontWeight: typography.fontWeight,
//         }}
//       >
//         {/* Adaptive Semi-transparent Overlay */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundColor: chroma(materialTheme.background).alpha(0.6).css(),
//           }}
//         />

//         {/* Logo with M3 Principles (No Background, Higher z-index) */}
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-8 right-8 w-48 h-24 object-contain z-30"

//           />
//         )}

//         {/* Content Section with M3 Typography and Color */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
//           {/* Title with Dynamic Sizing and Color */}
//           <h2
//             className={cn('font-bold mb-6 uppercase tracking-wide', {
//               'text-6xl': !isLongText,
//               'text-5xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: typography.fontSize,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Description with Dynamic Sizing and Color */}
//           <p
//             className={cn('font-medium', {
//               'text-3xl': !isLongText,
//               'text-2xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: `calc(${typography.fontSize} * 0.6)`,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.description}
//           </p>
//         </div>

//         {/* Footer with M3 Color Principles */}
//         <div
//           className="relative z-10 flex justify-end p-6"
//           style={{
//             backgroundColor: chroma(materialTheme.surface).alpha(0.2).css(),
//             borderRadius: graphicStyle.borderRadius,
//           }}
//         >
//           <a
//             href={slide.websiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-lg font-medium"
//             style={{
//               color: ensureContrast(materialTheme.onSecondary, materialTheme.surface),
//               textShadow: `0 2px 4px ${chroma(materialTheme.onSecondary).alpha(0.3).css()}`,
//             }}
//           >
//             @{slide.footer}
//           </a>
//         </div>
//       </div>
//     );
//   },
// };

// export const ImageTemplate4: ImageTemplate = {
//   id: 'artificial-super-intelligence',
//   name: 'Artificial Super Intelligence (ASI)',
//   coverImageUrl: '/images/image-cover/cover2.png',
//   slides: [
//     {
//       title: 'ARTIFICIAL SUPER INTELLIGENCE (ASI)',
//       description: 'ASI refers to hypothetical AI systems that surpass human intelligence in reasoning, creativity, and problem-solving, representing the most advanced form of AI.',
//       imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
//       footer: 'blocktunix',
//       websiteUrl: 'https://blocktunix.com',
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       materialTheme,
//       typography,
//       graphicStyle,
//       ensureContrast,
//     } = colors;

//     // Responsive layout adjustments
//     const hasImage = !!slide.imageUrl;
//     const isLongText = slide.description.length > 100;

//     return (
//       <div
//         className="relative w-[1080px] h-[1080px] flex flex-col justify-between"
//         style={{
//           backgroundImage: hasImage ? `url(${slide.imageUrl})` : 'none',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: materialTheme.background,
//           fontFamily: typography.fontFamily,
//           fontWeight: typography.fontWeight,
//         }}
//       >
//         {/* Dark blue overlay for contrast */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundColor: 'rgba(0, 12, 36, 0.8)',
//           }}
//         />

//         {/* Logo placement in top right */}
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
//           />
//         )}

//         {/* Content Section with futuristic tech styling */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
//           {/* Title with larger tech-inspired styling */}
//           <h2
//             className="font-bold mb-6 text-6xl uppercase tracking-wide"
//             style={{
//               color: '#ffffff',
//               textShadow: '0 0 10px rgba(77, 213, 255, 0.7)',
//               letterSpacing: '2px',
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Description with medium sizing and clean display */}
//           <p
//             className="font-medium text-2xl max-w-4xl"
//             style={{
//               color: '#f0f0f0',
//               lineHeight: '1.6',
//             }}
//           >
//             {slide.description}
//           </p>

//           {/* Brain visualization with ASI node icons */}
//           <div className="relative mt-12 w-96 h-96">
//             {/* This would be where the brain network visualization appears */}
//             {/* In the real implementation, this could be an SVG or component */}
//           </div>
//         </div>

//         {/* Footer with subtle styling */}
//         <div
//           className="relative z-10 flex justify-between items-center w-full p-6"
//           style={{
//             backgroundColor: 'rgba(0, 30, 60, 0.5)',
//           }}
//         >
//           <div></div> {/* Empty div for spacing */}
//           <a
//             href={slide.websiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-lg font-medium"
//             style={{
//               color: '#4dd5ff',
//             }}
//           >
//             @{slide.footer}
//           </a>
//         </div>
//       </div>
//     );
//   },
// };


// export const ImageTemplate13: ImageTemplate = {
//   id: 'teddy-bear-love',
//   name: 'Teddy Bear Love',
//   coverImageUrl: '/images/image-cover/cover1.png',
//   slides: [
//     {
//       title: 'ENCOURAGING WORDS',
//       description: '"Is it too soon to say \'I love you\'?"',
//       imageUrl: '/images/background14.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       materialTheme,
//       typography,
//       graphicStyle,
//       ensureContrast,
//     } = colors;

//     // Responsive layout adjustments
//     const hasImage = !!slide.imageUrl;
//     const isLongText = slide.description.length > 100;

//     return (
//       <div
//         className={cn('relative w-[1080px] h-[1080px] flex flex-col justify-between', {
//           'rounded-lg': graphicStyle.borderRadius !== '0px',
//         })}
//         style={{
//           backgroundImage: hasImage ? `url(${slide.imageUrl})` : 'none',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: materialTheme.background,
//           fontFamily: typography.fontFamily,
//           fontWeight: typography.fontWeight,
//         }}
//       >
//         {/* Adaptive Semi-transparent Overlay */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundColor: chroma(materialTheme.background).alpha(0.6).css(),
//           }}
//         />

//         {/* Logo with M3 Principles (No Background, Higher z-index) */}
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
//           />
//         )}

//         {/* Content Section with M3 Typography and Color */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
//           {/* Title with Dynamic Sizing and Color */}
//           <h2
//             className={cn('font-bold mb-6 uppercase tracking-wide', {
//               'text-6xl': !isLongText,
//               'text-5xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: typography.fontSize,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Description with Dynamic Sizing and Color */}
//           <p
//             className={cn('font-medium', {
//               'text-3xl': !isLongText,
//               'text-2xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: `calc(${typography.fontSize} * 0.6)`,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.description}
//           </p>
//         </div>

//         {/* Footer with M3 Color Principles */}
//         <div
//           className="relative z-10 flex justify-end p-6"
//           style={{
//             backgroundColor: chroma(materialTheme.surface).alpha(0.2).css(),
//             borderRadius: graphicStyle.borderRadius,
//           }}
//         >
//           <a
//             href={slide.websiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-lg font-medium"
//             style={{
//               color: ensureContrast(materialTheme.onSecondary, materialTheme.surface),
//               textShadow: `0 2px 4px ${chroma(materialTheme.onSecondary).alpha(0.3).css()}`,
//             }}
//           >
//             @{slide.footer}
//           </a>
//         </div>
//       </div>
//     );
//   },
// };

// export const ImageTemplate5: ImageTemplate = {
//   id: 'asi-futuristic',
//   name: 'Artificial Super Intelligence',
//   coverImageUrl: '/images/image-cover/asi-cover.png',
//   slides: [
//     {
//       title: 'ARTIFICIAL SUPER INTELLIGENCE',
//       description: '"Pushing beyond human intelligence to redefine the future."',
//       imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png', // A sleek, futuristic background
//       footer: 'aisuperintelligence.io',
//       websiteUrl: 'https://aisuperintelligence.io',
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       materialTheme,
//       typography,
//       graphicStyle,
//       ensureContrast,
//     } = colors;

//     // Responsive layout adjustments
//     const hasImage = !!slide.imageUrl;
//     const isLongText = slide.description.length > 100;

//     return (
//       <div
//         className={cn('relative w-[1080px] h-[1080px] flex flex-col justify-between', {
//           'rounded-lg': graphicStyle.borderRadius !== '0px',
//         })}
//         style={{
//           backgroundImage: hasImage ? `url(${slide.imageUrl})` : 'none',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundColor: materialTheme.background,
//           fontFamily: typography.fontFamily,
//           fontWeight: typography.fontWeight,
//         }}
//       >
//         {/* Adaptive Semi-transparent Overlay */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundColor: chroma(materialTheme.background).alpha(0.6).css(),
//           }}
//         />

//         {/* Logo with M3 Principles */}
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
//           />
//         )}

//         {/* Content Section with M3 Typography and Color */}
//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center">
//           {/* Visual Elements: Woman and Robotic Head */}
//           <div className="flex justify-between w-full px-12 mb-6">
//             <img
//               src="/images/woman-at-desk.png" // Left: Woman at desk with laptop
//               alt="Woman working on AI"
//               className="w-[300px] h-[300px] object-contain"
//             />
//             <img
//               src="/images/robotic-head.png" // Right: Robotic head with brain
//               alt="Robotic ASI brain"
//               className="w-[300px] h-[300px] object-contain"
//             />
//           </div>

//           {/* Prominent ASI Acronym */}
//           <h1
//             className="text-8xl font-extrabold mb-4"
//             style={{
//               color: ensureContrast(materialTheme.primary, materialTheme.background),
//               textShadow: `0 4px 8px ${chroma(materialTheme.primary).alpha(0.4).css()}`,
//             }}
//           >
//             ASI
//           </h1>

//           {/* Title with Dynamic Sizing and Color */}
//           <h2
//             className={cn('font-bold mb-6 uppercase tracking-wide', {
//               'text-6xl': !isLongText,
//               'text-5xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: typography.fontSize,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Description with Dynamic Sizing and Color */}
//           <p
//             className={cn('font-medium', {
//               'text-3xl': !isLongText,
//               'text-2xl': isLongText,
//             })}
//             style={{
//               color: ensureContrast(materialTheme.onBackground, materialTheme.background),
//               fontSize: `calc(${typography.fontSize} * 0.6)`,
//               textShadow: `0 2px 4px ${chroma(materialTheme.onBackground).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.description}
//           </p>

//           {/* Brain with AI Symbol */}
//           <img
//             src="/images/brain-ai-symbol.png"
//             alt="Brain with AI symbol"
//             className="mt-6 w-[150px] h-[150px] object-contain"
//           />
//         </div>

//         {/* Footer with M3 Color Principles */}
//         <div
//           className="relative z-10 flex justify-end p-6"
//           style={{
//             backgroundColor: chroma(materialTheme.surface).alpha(0.2).css(),
//             borderRadius: graphicStyle.borderRadius,
//           }}
//         >
//           <a
//             href={slide.websiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-lg font-medium"
//             style={{
//               color: ensureContrast(materialTheme.onSecondary, materialTheme.surface),
//               textShadow: `0 2px 4px ${chroma(materialTheme.onSecondary).alpha(0.3).css()}`,
//             }}
//           >
//             @{slide.footer}
//           </a>
//         </div>
//       </div>
//     );
//   },
// };



// const ImageTemplate13: ImageTemplate = {
//     id: 'teddy-bear-love',
//     name: 'Teddy Bear Love',
//     coverImageUrl: '/images/image-cover/cover1.png',
//     slides: [
//         {
//             title: 'ENCOURAGING WORDS',
//             description: '"Is it too soon to say \'I love you\'?"',
//             imageUrl: '/images/background14.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div
//             className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-end text-white"
//             style={{
//                 backgroundImage: `url(${slide.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}
//         >
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
//                 />
//             )}
//             <div className="relative z-10 bg-black bg-opacity-50 p-6 md:p-8">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center uppercase">
//                     {slide.title}
//                 </h2>
//                 <p className="text-lg md:text-xl text-center italic">
//                     {slide.description}
//                 </p>
//                 <div className="flex justify-end mt-4">
//                     <span className="text-sm md:text-base text-gray-300">
//                         @{slide.footer}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     ),
// };


// const ImageTemplate14: ImageTemplate = {
//     id: 'minimalist-split',
//     name: 'Minimalist Split',
//     coverImageUrl: '/images/image-cover/cover2.png',
//     slides: [
//         {
//             title: 'MODERN DESIGN',
//             description: 'Where simplicity meets elegance in perfect harmony',
//             imageUrl: '/images/background15.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] flex">
//             <div className="w-1/2 bg-black p-8 flex flex-col justify-center">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
//                     {slide.title}
//                 </h2>
//                 <p className="text-lg md:text-xl text-gray-300">
//                     {slide.description}
//                 </p>
//                 <span className="text-sm text-gray-400 mt-4">@{slide.footer}</span>
//             </div>
//             <div 
//                 className="w-1/2 relative"
//                 style={{
//                     backgroundImage: `url(${slide.imageUrl})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             >
//                 {addLogo && (
//                     <img
//                         src={defaultLogoUrl}
//                         alt="Logo"
//                         className="absolute top-4 right-4 w-32 object-contain"
//                     />
//                 )}
//             </div>
//         </div>
//     ),
// };


// const ImageTemplate15: ImageTemplate = {
//     id: 'gradient-overlay',
//     name: 'Gradient Overlay',
//     coverImageUrl: '/images/image-cover/cover3.png',
//     slides: [
//         {
//             title: 'INSPIRING THOUGHTS',
//             description: 'Create your path to success with determination',
//             imageUrl: '/images/background16.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div
//             className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center"
//             style={{
//                 backgroundImage: `linear-gradient(45deg, rgba(76, 0, 255, 0.85), rgba(255, 0, 128, 0.85)), url(${slide.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}
//         >
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain"
//                 />
//             )}
//             <div className="text-center text-white p-8 max-w-2xl">
//                 <h2 className="text-4xl md:text-5xl font-bold mb-6">{slide.title}</h2>
//                 <p className="text-xl md:text-2xl mb-8">{slide.description}</p>
//                 <span className="text-lg">@{slide.footer}</span>
//             </div>
//         </div>
//     ),
// };


// const ImageTemplate4: ImageTemplate = {
//     id: 'modern-frame',
//     name: 'Modern Frame',
//     coverImageUrl: '/images/image-cover/cover4.png',
//     slides: [
//         {
//             title: 'CREATIVE VISION',
//             description: 'Bringing ideas to life through innovative design',
//             imageUrl: '/images/background17.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-black p-8">
//             <div className="border-2 border-white h-full flex flex-col justify-center items-center relative">
//                 <div
//                     className="absolute inset-4 opacity-50"
//                     style={{
//                         backgroundImage: `url(${slide.imageUrl})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                     }}
//                 />
//                 {addLogo && (
//                     <img
//                         src={defaultLogoUrl}
//                         alt="Logo"
//                         className="absolute top-4 right-4 w-32 object-contain z-10"
//                     />
//                 )}
//                 <div className="relative z-10 text-center text-white p-8 bg-black bg-opacity-70">
//                     <h2 className="text-4xl md:text-5xl font-bold mb-6">{slide.title}</h2>
//                     <p className="text-xl md:text-2xl">{slide.description}</p>
//                     <span className="block mt-6 text-lg">@{slide.footer}</span>
//                 </div>
//             </div>
//         </div>
//     ),
// };

// // Template 5: Circular Focus
// const ImageTemplate5: ImageTemplate = {
//     id: 'circular-focus',
//     name: 'Circular Focus',
//     coverImageUrl: '/images/image-cover/cover5.png',
//     slides: [
//         {
//             title: 'ENDLESS POSSIBILITIES',
//             description: 'Explore the boundaries of imagination',
//             imageUrl: '/images/background18.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-black flex items-center justify-center">
//             <div className="absolute w-[400px] h-[400px] rounded-full overflow-hidden">
//                 <div
//                     className="w-full h-full"
//                     style={{
//                         backgroundImage: `url(${slide.imageUrl})`,
//                         backgroundSize: 'cover',
//                         backgroundPosition: 'center',
//                     }}
//                 />
//             </div>
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain"
//                 />
//             )}
//             <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-8 text-white text-center">
//                 <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
//                 <p className="text-xl mb-4">{slide.description}</p>
//                 <span className="text-lg">@{slide.footer}</span>
//             </div>
//         </div>
//     ),
// };

// // Template 6: Dynamic Diagonal
// const ImageTemplate6: ImageTemplate = {
//     id: 'dynamic-diagonal',
//     name: 'Dynamic Diagonal',
//     coverImageUrl: '/images/image-cover/cover6.png',
//     slides: [
//         {
//             title: 'BOLD MOVES',
//             description: 'Breaking through conventional boundaries',
//             imageUrl: '/images/background19.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
//             <div
//                 className="absolute inset-0 transform -skew-x-12"
//                 style={{
//                     backgroundImage: `url(${slide.imageUrl})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
//                 <h2 className="text-5xl font-bold mb-6">{slide.title}</h2>
//                 <p className="text-2xl mb-8">{slide.description}</p>
//                 <span className="text-lg">@{slide.footer}</span>
//             </div>
//         </div>
//     ),
// };

// // Template 7: Floating Elements

// export const ImageTemplate7: ImageTemplate = {
//   id: 'floating-elements',
//   name: 'Floating Elements',
//   coverImageUrl: '/images/image-cover/cover7.png',
//   slides: [
//     {
//       title: 'CREATIVE FLOW',
//       description: 'Where imagination takes flight',
//       imageUrl: '/images/background20.jpg',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       materialTheme,
//       typography,
//       graphicStyle,
//       ensureContrast,
//       glowColor,
//       complementaryGlowColor,
//     } = colors;

//     // Validate colors with fallbacks
//     const safeComplementaryGlowColor = chroma.valid(complementaryGlowColor) ? complementaryGlowColor : '#33CCA8';
//     const safeGlowColor = chroma.valid(glowColor) ? glowColor : '#FF5733';
//     const safePrimary = chroma.valid(logoColors.primary) ? logoColors.primary : '#6200EA';
//     const safeSecondary = chroma.valid(logoColors.secondary) ? logoColors.secondary : '#03DAC6';
//     const safeAccent = logoColors.accent.length > 0 && logoColors.accent.every(c => chroma.valid(c))
//       ? logoColors.accent
//       : ['#BB86FC', '#FF0266', '#FF5733'];
//     const safeBackground = chroma.valid(materialTheme.background) ? materialTheme.background : '#FFFFFF';
//     const safeSurface = chroma.valid(materialTheme.surface) ? materialTheme.surface : '#FAFAFA';

//     // Log colors for debugging
//     console.log('renderSlide colors:', {
//       complementaryGlowColor: safeComplementaryGlowColor,
//       glowColor: safeGlowColor,
//       primary: safePrimary,
//       secondary: safeSecondary,
//       accent: safeAccent,
//       background: safeBackground,
//       surface: safeSurface,
//     });

//     // Responsive layout adjustments
//     const isLongText = slide.description.length > 100;
//     const hasImage = !!slide.imageUrl;
//     const titleLength = slide.title.length;

//     // Dynamic font size based on title length
//     const titleFontSize = titleLength > 20 ? `calc(${typography.fontSize} * 0.8)` : typography.fontSize;

//     // Compute font colors based on complementaryGlowColor
//     const titleColor = ensureContrast(
//       chroma(safeComplementaryGlowColor).luminance(0.8).hex(),
//       hasImage ? chroma(safeBackground).alpha(0.3).hex() : safeBackground
//     );
//     const descriptionColor = ensureContrast(
//       chroma(safeComplementaryGlowColor).luminance(0.7).hex(),
//       hasImage ? chroma(safeBackground).alpha(0.3).hex() : safeBackground
//     );
//     const footerColor = ensureContrast(
//       chroma(safeComplementaryGlowColor).set('hsl.s', '*0.5').luminance(0.6).hex(),
//       chroma(safeSurface).alpha(0.2).hex()
//     );

//     return (
//       <div
//         className={cn(
//           'relative w-[1080px] h-[1080px] flex flex-col justify-center bg-cover bg-center',
//           {
//             'rounded-lg': graphicStyle.borderRadius !== '0px',
//           }
//         )}
//         style={{
//           backgroundImage: hasImage ? `url(${slide.imageUrl})` : `linear-gradient(135deg, ${safePrimary} 0%, ${safeSecondary} 100%)`,
//           backgroundSize: 'cover',
//           fontFamily: `${typography.fontFamily}, sans-serif`,
//           fontWeight: typography.fontWeight,
//           boxShadow: `0 0 20px ${chroma(safeGlowColor).alpha(0.5).css()}`,
//         }}
//       >
//         {/* Floating Elements (Blurred Circles) */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div
//             className="absolute w-40 h-40 rounded-full blur-3xl -top-10 -left-10 opacity-30"
//             style={{ backgroundColor: safeAccent[0] || chroma(safePrimary).set('hsl.l', 0.6).hex() }}
//           />
//           <div
//             className="absolute w-40 h-40 rounded-full blur-3xl top-1/2 right-10 opacity-30"
//             style={{ backgroundColor: safeAccent[1] || chroma(safeSecondary).set('hsl.l', 0.6).hex() }}
//           />
//           <div
//             className="absolute w-40 h-40 rounded-full blur-3xl bottom-10 left-1/2 opacity-30"
//             style={{ backgroundColor: safeAccent[2] || chroma(safePrimary).set('hsl.h', '+30').hex() }}
//           />
//         </div>

//         {/* Adaptive Semi-transparent Overlay */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundColor: chroma(safeBackground).alpha(0.3).css(),
//           }}
//         />

//         {/* Logo with Glow Effect */}
//         {addLogo && (
//           <img
//             src={defaultLogoUrl}
//             alt="Logo"
//             className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
//             style={{
//               filter: graphicStyle.filter || 'none',
//               boxShadow: `0 0 15px ${chroma(safeComplementaryGlowColor).luminance(0.7).alpha(0.7).css()}`,
//             }}
//             onError={() => console.warn(`Failed to load logo: ${defaultLogoUrl}`)}
//           />
//         )}

//         {/* Content Section with M3 Typography and Color */}
//         <div
//           className={cn(
//             'relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center',
//             isLongText ? 'space-y-4' : 'space-y-6'
//           )}
//         >
//           {/* Title with Dynamic Sizing and Complementary Color */}
//           <h2
//             className={cn('font-bold uppercase tracking-wide', {
//               'text-6xl': !isLongText && titleLength <= 20,
//               'text-5xl': isLongText || titleLength > 20,
//             })}
//             style={{
//               color: titleColor,
//               fontSize: titleFontSize,
//               textShadow: `0 2px 4px ${chroma(safeComplementaryGlowColor).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Description with Dynamic Sizing and Complementary Color */}
//           <p
//             className={cn('font-medium', {
//               'text-3xl': !isLongText,
//               'text-2xl': isLongText,
//             })}
//             style={{
//               color: descriptionColor,
//               fontSize: `calc(${typography.fontSize} * 0.6)`,
//               textShadow: `0 2px 4px ${chroma(safeComplementaryGlowColor).alpha(0.3).css()}`,
//             }}
//           >
//             {slide.description}
//           </p>
//         </div>

//         {/* Footer with Complementary Color */}
//         <div
//           className="relative z-10 flex justify-end p-6"
//           style={{
//             backgroundColor: chroma(safeSurface).alpha(0.2).css(),
//             borderRadius: graphicStyle.borderRadius || '0px',
//           }}
//         >
//           <a
//             href={slide.websiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-lg font-medium"
//             style={{
//               color: footerColor,
//               textShadow: `0 2px 4px ${chroma(safeComplementaryGlowColor).alpha(0.3).css()}`,
//             }}
//           >
//             @{slide.footer}
//           </a>
//         </div>
//       </div>
//     );
//   },
// };
// // Template 8: Minimal Typography
// const ImageTemplate8: ImageTemplate = {
//     id: 'minimal-typography',
//     name: 'Minimal Typography',
//     coverImageUrl: '/images/image-cover/cover8.png',
//     slides: [
//         {
//             title: 'LESS IS MORE',
//             description: 'Embracing the power of simplicity',
//             imageUrl: '/images/background21.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-white">
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain"
//                 />
//             )}
//             <div className="h-full flex flex-col justify-center items-center p-8">
//                 <h2 className="text-6xl font-bold mb-8 tracking-tight">{slide.title}</h2>
//                 <p className="text-2xl mb-12 max-w-2xl text-center">{slide.description}</p>
//                 <span className="text-lg text-gray-600">@{slide.footer}</span>
//             </div>
//             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
//         </div>
//     ),
// };

// // Template 9: Retro Vibes
// const ImageTemplate9: ImageTemplate = {
//     id: 'retro-vibes',
//     name: 'Retro Vibes',
//     coverImageUrl: '/images/image-cover/cover9.png',
//     slides: [
//         {
//             title: 'VINTAGE CHARM',
//             description: 'Bringing back the golden era',
//             imageUrl: '/images/background22.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div
//             className="relative w-full h-[600px] md:h-[700px]"
//             style={{
//                 backgroundImage: `url(${slide.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//             }}
//         >
//             <div className="absolute inset-0 bg-yellow-900/30" />
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//                 <div className="border-4 border-white p-8 text-white text-center">
//                     <h2 className="text-5xl font-bold mb-6">{slide.title}</h2>
//                     <p className="text-2xl mb-6">{slide.description}</p>
//                     <span className="text-lg">@{slide.footer}</span>
//                 </div>
//             </div>
//         </div>
//     ),
// };


// // Template 11: Neon Glow
// const ImageTemplate11: ImageTemplate = {
//     id: 'neon-glow',
//     name: 'Neon Glow',
//     coverImageUrl: '/images/image-cover/cover11.png',
//     slides: [
//         {
//             title: 'ELECTRIC DREAMS',
//             description: 'Illuminating the future with bold ideas',
//             imageUrl: '/images/background24.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-black flex items-center justify-center">
//             <div className="absolute inset-0 opacity-50"
//                 style={{
//                     backgroundImage: `url(${slide.imageUrl})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 text-center p-8">
//                 <h2 className="text-5xl font-bold mb-6 text-white shadow-[0_0_20px_rgba(255,255,255,0.5)]">
//                     {slide.title}
//                 </h2>
//                 <p className="text-2xl mb-8 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">
//                     {slide.description}
//                 </p>
//                 <span className="text-lg text-white shadow-[0_0_5px_rgba(255,255,255,0.3)]">
//                     @{slide.footer}
//                 </span>
//             </div>
//         </div>
//     ),
// };

// // Template 12: Nature Inspired
// const ImageTemplate12: ImageTemplate = {
//     id: 'nature-inspired',
//     name: 'Nature Inspired',
//     coverImageUrl: '/images/image-cover/cover12.png',
//     slides: [
//         {
//             title: 'ORGANIC BEAUTY',
//             description: 'Finding inspiration in natural harmony',
//             imageUrl: '/images/background25.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
//             <div
//                 className="absolute inset-0"
//                 style={{
//                     backgroundImage: `url(${slide.imageUrl})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             />
//             <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
//                 <div className="bg-white/10 backdrop-blur-md p-12 rounded-lg text-white text-center">
//                     <h2 className="text-5xl font-bold mb-6">{slide.title}</h2>
//                     <p className="text-2xl mb-6">{slide.description}</p>
//                     <span className="text-lg">@{slide.footer}</span>
//                 </div>
//             </div>
//         </div>
//     ),
// };

// const ImageTemplate16: ImageTemplate = {
//     id: 'neon-glow',
//     name: 'Neon Glow',
//     coverImageUrl: '/images/image-cover/cover11.png',
//     slides: [
//         {
//             title: 'ELECTRIC DREAMS',
//             description: 'Illuminating the future with bold ideas',
//             imageUrl: '/images/background24.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-gray-800 flex items-center justify-center">
//             <div
//                 className="absolute inset-0 opacity-50"
//                 style={{
//                     backgroundImage: `url(${slide.imageUrl})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                 }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-br from-[#D8BFD8]/50 to-[#F5F5F5]/50" />
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 text-center p-8">
//                 <h2 className="text-5xl font-bold mb-6 text-[#5A2D82] shadow-[0_0_20px_#A66EB2]">
//                     {slide.title}
//                 </h2>
//                 <p className="text-2xl mb-8 text-[#5A2D82] shadow-[0_0_10px_#A66EB2]">
//                     {slide.description}
//                 </p>
//                 <span className="text-lg text-[#5A2D82] shadow-[0_0_5px_#A66EB2]">
//                     @{slide.footer}
//                 </span>
//             </div>
//         </div>
//     ),
// };

export const ImageTemplate17: ImageTemplate = {
  id: 'floating-elements',
  name: 'Floating Elements',
  coverImageUrl: '/images/image-cover/cover7.png',
  slides: [
    {
      title: 'CREATIVE FLOW',
      description: 'Where imagination takes flight',
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
      glowColor,
      complementaryGlowColor,
    } = colors;

    console.log("Colors: ", colors)

    // Responsive layout adjustments
    const isLongText = slide.description.length > 100;
    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Dynamic font size based on title length
    const titleFontSize = titleLength > 20 ? `calc(${typography.fontSize} * 0.8)` : typography.fontSize;

    // // Compute font colors based on complementaryGlowColor
    // const titleColor = ensureContrast(
    //   chroma(complementaryGlowColor).luminance(0.8).hex(),
    //   hasImage ? chroma(materialTheme.background).alpha(0.3).hex() : materialTheme.background
    // );
    // const descriptionColor = ensureContrast(
    //   chroma(complementaryGlowColor).luminance(0.7).hex(),
    //   hasImage ? chroma(materialTheme.background).alpha(0.3).hex() : materialTheme.background
    // );
    // const footerColor = ensureContrast(
    //   chroma(complementaryGlowColor).set('hsl.s', '*0.5').luminance(0.6).hex(),
    //   chroma(materialTheme.surface).alpha(0.2).hex()
    // );

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    // textColor = '#000000'
    console.log("Text Color", textColor)
    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center bg-cover bg-center',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          backgroundImage: hasImage ? `url(${slide.imageUrl})` : `linear-gradient(135deg, ${logoColors.primary} 0%, ${logoColors.secondary} 100%)`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          boxShadow: `0 0 20px ${chroma(glowColor).alpha(0.5).css()}`,
          mixBlendMode: 'overlay',
          opacity: 0.8,
        }}
      >
        {/* Floating Elements (Blurred Circles) */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl -top-10 -left-10 opacity-30"
            style={{ backgroundColor: logoColors.accent[0] || chroma(logoColors.primary).set('hsl.l', 0.6).hex() }}
          />
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl top-1/2 right-10 opacity-30"
            style={{ backgroundColor: logoColors.accent[1] || chroma(logoColors.secondary).set('hsl.l', 0.6).hex() }}
          />
          <div
            className="absolute w-40 h-40 rounded-full blur-3xl bottom-10 left-1/2 opacity-30"
            style={{ backgroundColor: logoColors.accent[2] || chroma(logoColors.primary).set('hsl.h', '+30').hex() }}
          />
        </div>

        {/* Adaptive Semi-transparent Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: chroma(materialTheme.background).alpha(0.3).css(),
          }}
        />

        {/* Logo with Glow Effect */}
        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"

          />
        )}

        {/* Content Section with M3 Typography and Color */}
        <div
          className={cn(
            'relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center',
            isLongText ? 'space-y-4' : 'space-y-6'
          )}
        >
          {/* Title with Dynamic Sizing and Complementary Color */}
          <h2
            className={cn('font-bold uppercase tracking-wide', {
              'text-6xl': !isLongText && titleLength <= 20,
              'text-5xl': isLongText || titleLength > 20,
            })}
            style={{
              color: textColor,
              fontSize: titleFontSize,

            }}
          >
            {slide.title}
          </h2>

          {/* Description with Dynamic Sizing and Complementary Color */}
          <p
            className={cn('font-medium', {
              'text-3xl': !isLongText,
              'text-2xl': isLongText,
            })}
            style={{
              color: textColor,
              fontSize: `calc(${typography.fontSize} * 0.6)`,

            }}
          >
            {slide.description}
          </p>
        </div>

        {/* Footer with Complementary Color */}
        <div
          className="absolute bottom-8 w-full flex justify-between items-center z-10 px-12"
          style={{
            backgroundColor: chroma(materialTheme.surface).alpha(0.2).css(),
            borderRadius: graphicStyle.borderRadius,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium"
            style={{
              color: textColor,

            }}
          >
            @{slide.websiteUrl}
          </a>

          <p
            className="text-xl font-medium tracking-wide"
            style={{ color: textColor }}
          >
            @{slide.footer}
          </p>
        </div>
      </div>
    );
  },
};

// Template 2: Minimalist Split
export const ImageTemplate18: ImageTemplate = {
  id: 'minimalist-split',
  name: 'Minimalist Split',
  coverImageUrl: '/images/image-cover/cover2.png',
  slides: [
    {
      title: 'SIMPLICITY',
      description: 'Less is more',
      imageUrl: '/images/background15.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
    } = colors;

    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Clean, high-contrast colors
    const bgColor = chroma(materialTheme.background).luminance(0.95).hex();
    let textColor = chroma(materialTheme.onBackground).luminance(0.1).hex();
    const accentColor = chroma(logoColors.primary).saturate(1).hex();

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex bg-white',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          fontFamily: typography.fontFamily,
          backgroundColor: bgColor,
          overflow: 'hidden',
        }}
      >
        {/* Left panel - Image or Color */}
        <div
          className="w-1/2 h-full relative"
          style={{
            backgroundImage: hasImage ? `url(${slide.imageUrl})` : `linear-gradient(135deg, ${logoColors.primary} 0%, ${logoColors.secondary} 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle overlay for better text contrast if needed */}
          {hasImage && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: chroma(materialTheme.background).alpha(0.1).css(),
              }}
            />
          )}
        </div>

        {/* Right panel - Content */}
        <div className="w-1/2 h-full flex flex-col justify-between p-12">
          {/* Logo */}
          {addLogo && (
            <div className="flex justify-end mb-12">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-48 h-24 object-contain"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Accent line */}
            <div
              className="w-16 h-1 mb-8"
              style={{ backgroundColor: accentColor }}
            />

            <h2
              className={cn('font-bold mb-6', {
                'text-6xl': titleLength <= 15,
                'text-5xl': titleLength > 15,
              })}
              style={{ color: textColor }}
            >
              {slide.title}
            </h2>

            <p
              className="text-2xl font-light"
              style={{ color: textColor }}
            >
              {slide.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t" style={{ borderColor: chroma(textColor).alpha(0.1).css() }}>
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg"
              style={{ color: textColor }}
            >
              {slide.websiteUrl}
            </a>
            <p
              className="text-xl font-medium tracking-wide"
              style={{ color: textColor }}
            >
              @{slide.footer}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Template 3: Geometric Bold
export const ImageTemplate19: ImageTemplate = {
  id: 'geometric-bold',
  name: 'Geometric Bold',
  coverImageUrl: '/images/image-cover/cover3.png',
  slides: [
    {
      title: 'BOLD VISION',
      description: 'Breaking boundaries with design',
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
    } = colors;

    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Bold, vibrant colors
    const primaryColor = chroma(logoColors.primary).saturate(1.5).hex();
    const secondaryColor = chroma(logoColors.secondary).saturate(1.5).hex();
    const bgColor = chroma(materialTheme.background).luminance(0.05).hex();
    let textColor = chroma(materialTheme.onBackground).luminance(0.95).hex();

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >

        {/* Image overlay if available */}
        {hasImage && (
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
              opacity: 0.4,
            }}
          />
        )}

        {/* Content container */}
        <div className="relative z-20 flex flex-col h-full p-16">
          {/* Logo */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-40 h-20 object-contain"
              />
            </div>
          )}

          {/* Main content */}
          <div className="mb-auto mt-auto">
            <h2
              className={cn('font-black uppercase tracking-wider mb-6', {
                'text-7xl': titleLength <= 10,
                'text-6xl': titleLength > 10 && titleLength <= 20,
                'text-5xl': titleLength > 20,
              })}
              style={{ color: textColor }}
            >
              {slide.title}
            </h2>

            <p
              className="text-3xl font-medium max-w-2xl"
              style={{ color: textColor }}
            >
              {slide.description}
            </p>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 w-full flex justify-between items-center z-10 px-8">
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-medium tracking-wide hover:underline"
              style={{ color: textColor }}
            >
              {slide.websiteUrl}
            </a>
            <p
              className="text-xl font-medium tracking-wide"
              style={{ color: textColor }}
            >
              @{slide.footer}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Template 4: Vintage Retro
export const ImageTemplate20: ImageTemplate = {
  id: 'vintage-retro',
  name: 'Vintage Retro',
  coverImageUrl: '/images/image-cover/cover4.png',
  slides: [
    {
      title: 'TIMELESS',
      description: 'Inspired by the classics',
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
      ensureContrast,
      glowColor,
      complementaryGlowColor,
    } = colors;

    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Vintage color palette
    const primaryColor = chroma(logoColors.primary).desaturate(0.5).hex();
    const secondaryColor = chroma(logoColors.secondary).desaturate(0.3).hex();
    const bgColor = chroma('#f5f2e9').hex(); // Vintage paper color
    let textColor = chroma('#2a2522').hex(); // Vintage dark brown

    // const titleColor = ensureContrast(
    //   chroma(complementaryGlowColor).luminance(0.8).hex(),
    //   hasImage ? chroma(materialTheme.background).alpha(0.3).hex() : materialTheme.background
    // );
    // const descriptionColor = ensureContrast(
    //   chroma(complementaryGlowColor).luminance(0.7).hex(),
    //   hasImage ? chroma(materialTheme.background).alpha(0.3).hex() : materialTheme.background
    // );
    // const footerColor = ensureContrast(
    //   chroma(complementaryGlowColor).set('hsl.s', '*0.5').luminance(0.6).hex(),
    //   chroma(materialTheme.surface).alpha(0.2).hex()
    // );

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',

        }}
      >
        {/* Vintage texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581377342297-a09d6bf2eea1?q=80&w=1000)',
            backgroundSize: 'cover',
            opacity: 0.1,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Vintage border */}
        <div
          className="absolute inset-12 border-8 border-double"
          style={{ borderColor: chroma(primaryColor).alpha(0.3).css() }}
        />

        {/* Image if available */}
        {hasImage && (
          <div className="absolute inset-24 overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'sepia(0.3) contrast(0.9)',
                opacity: 0.7,
              }}
            />

            {/* Vignette effect */}
            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        )}

        {/* Content container */}
        <div className="relative z-10 flex flex-col h-full p-32">
          {/* Logo */}
          {addLogo && (
            <div className="absolute top-22 right-13 z-20">
              <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
            </div>
          )}

          {/* Decorative element */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div className="h-px w-16" style={{ backgroundColor: primaryColor }}></div>
              <div className="mx-4 text-2xl" style={{ color: primaryColor }}>✦</div>
              <div className="h-px w-16" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </div>

          {/* Main content */}
          <div className="text-center mb-auto mt-auto">
            <h2
              className={cn('font-bold uppercase tracking-widest mb-6', {
                'text-6xl': titleLength <= 10,
                'text-5xl': titleLength > 10 && titleLength <= 15,
                'text-4xl': titleLength > 15,
              })}
              style={{
                color: textColor,
                letterSpacing: '0.15em',
              }}
            >
              {slide.title}
            </h2>

            <p
              className="text-2xl font-normal mx-auto max-w-xl"
              style={{
                color: textColor,
                fontSize: `calc(${typography.fontSize} * 0.6)`,

              }}
            >
              {slide.description}
            </p>
          </div>

          {/* Decorative element */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="flex items-center">
              <div className="h-px w-16" style={{ backgroundColor: primaryColor }}></div>
              <div className="mx-4 text-2xl" style={{ color: primaryColor }}>✦</div>
              <div className="h-px w-16" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center ">
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg"
              style={{
                color: textColor,
                letterSpacing: '0.1em',
              }}

            >
              {slide.websiteUrl}
            </a>
            <p
              className="text-xl font-medium tracking-wide"
              style={{ color: textColor }}
            >
              @{slide.footer}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Template 5: Organic Nature
export const ImageTemplate21: ImageTemplate = {
  id: 'organic-nature',
  name: 'Organic Nature',
  coverImageUrl: '/images/image-cover/cover5.png',
  slides: [
    {
      title: 'NATURAL HARMONY',
      description: 'In balance with the world around us',
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
    } = colors;

    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Nature-inspired colors
    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#8a9b68').hex(); // Sage
    const accentColor = chroma('#e8c547').hex(); // Sunflower
    const bgColor = chroma('#f8f4e9').hex(); // Cream
    let textColor = chroma('#2d3033').hex(); // Dark slate

    // Use brand colors if they're nature-like (green/brown tones)
    interface IsNatureColorFn {
      (color: string): boolean;
    }

    const isNatureColor: IsNatureColorFn = (color: string): boolean => {
      const hue = chroma(color).get('hsl.h');
      return (hue > 60 && hue < 180); // Green/brown spectrum
    };

    const usePrimary = isNatureColor(logoColors.primary) ? logoColors.primary : primaryColor;
    const useSecondary = isNatureColor(logoColors.secondary) ? logoColors.secondary : secondaryColor;

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    textColor = ensureContrast(c1, c2)
    textColor = '#000000'
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Organic shapes */}
        <div className="absolute inset-0">
          {/* Leaf-like shape */}
          <svg
            className="absolute top-0 right-0 w-1/2 h-1/2 opacity-10"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill={usePrimary}
              d="M44.7,-76.4C58.9,-69.8,71.8,-59.2,79.6,-45.3C87.4,-31.3,90.2,-14.1,88.1,2C86,18.2,79,33.3,69.3,46.5C59.7,59.7,47.4,71,33.2,77.7C19,84.3,2.8,86.3,-12.4,83.5C-27.7,80.8,-42,73.3,-54.3,63C-66.7,52.7,-77.1,39.7,-82.6,24.7C-88.1,9.7,-88.7,-7.3,-83.8,-22C-78.9,-36.7,-68.4,-49.2,-55.6,-56.1C-42.7,-63,-27.5,-64.3,-13.2,-70.5C1.1,-76.7,30.5,-83,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>

          {/* Wave-like shape */}
          <svg
            className="absolute bottom-0 left-0 w-full h-1/3 opacity-10"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill={useSecondary}
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill={usePrimary}
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill={useSecondary}
            />
          </svg>
        </div>

        {/* Image if available */}
        {hasImage && (
          <div className="absolute inset-0 z-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.8,
              }}
            />

            {/* Natural gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${chroma(usePrimary).alpha(0.4).css()} 0%, transparent 100%)`,
              }}
            />
          </div>
        )}

        {/* Content container */}
        <div className="relative z-20 flex flex-col h-full p-16">
          {/* Logo */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-40 h-20 object-contain"
              />
            </div>
          )}

          {/* Main content */}
          <div className="mb-auto mt-auto max-w-2xl">
            {/* Accent element */}
            <div
              className="w-24 h-1 mb-8 rounded-full"
              style={{ backgroundColor: accentColor }}
            />

            <h2
              className={cn('font-semibold mb-6', {
                'text-6xl': titleLength <= 15,
                'text-5xl': titleLength > 15 && titleLength <= 25,
                'text-4xl': titleLength > 25,
              })}
              style={{
                color: textColor,

              }}
            >
              {slide.title}
            </h2>

            <p
              className="text-2xl font-light"
              style={{
                color: textColor,

              }}
            >
              {slide.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-between">
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg inline-flex items-center"
              style={{ color: textColor }}

            >
              <span className="mr-2">•</span>
              {slide.websiteUrl}
            </a>
            <p
              className="text-lg inline-flex items-center"
              style={{ color: textColor }}
            >
              @{slide.footer}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// Template 6: Tech Grid
export const ImageTemplate22: ImageTemplate = {
  id: 'tech-grid',
  name: 'Tech Grid',
  coverImageUrl: '/images/image-cover/cover6.png',
  slides: [
    {
      title: 'DIGITAL FRONTIER',
      description: 'Exploring the future of technology',
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const {
      logoColors,
      materialTheme,
      typography,
      graphicStyle,
    } = colors;

    const hasImage = !!slide.imageUrl;
    const titleLength = slide.title.length;

    // Tech-inspired colors
    const primaryColor = chroma(logoColors.primary).brighten(0.2).saturate(0.5).hex();
    const secondaryColor = chroma(logoColors.secondary).brighten(0.2).saturate(0.5).hex();
    const bgColor = chroma('#0a0e17').hex(); // Dark tech blue
    let textColor = chroma('#ffffff').hex(); // White
    const gridColor = chroma('#3a4cb9').alpha(0.15).css(); // Glowing blue

    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col',
          {
            'rounded-lg': graphicStyle.borderRadius !== '0px',
          }
        )}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Tech grid background */}
        <div className="absolute inset-0">
          {/* Horizontal lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px"
              style={{
                top: `${(i + 1) * 5}%`,
                backgroundColor: gridColor,
                boxShadow: i % 5 === 0 ? `0 0 8px ${gridColor}` : 'none',
              }}
            />
          ))}

          {/* Vertical lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${(i + 1) * 5}%`,
                backgroundColor: gridColor,
                boxShadow: i % 5 === 0 ? `0 0 8px ${gridColor}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Glowing accent elements */}
        <div className="absolute inset-0">
          <div
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              backgroundColor: chroma(primaryColor).alpha(0.2).css(),
              top: '20%',
              right: '10%',
            }}
          />

          <div
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              backgroundColor: chroma(secondaryColor).alpha(0.15).css(),
              bottom: '10%',
              left: '5%',
            }}
          />
        </div>

        {/* Image if available */}
        {hasImage && (
          <div className="absolute inset-0 z-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.4,
                mixBlendMode: 'screen',
              }}
            />
          </div>
        )}

        {/* Content container */}
        <div className="relative z-20 flex flex-col h-full p-16">
          {/* Logo */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-40 h-20 object-contain"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))',
                }}
              />
            </div>
          )}

          {/* Main content */}
          <div className="mb-auto mt-auto max-w-2xl">
            {/* Tech-inspired decorative element */}
            <div className="flex items-center mb-8">
              <div
                className="w-12 h-1"
                style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }}
              />
              <div
                className="ml-4 text-sm font-mono opacity-70"
                style={{ color: primaryColor }}
              >

              </div>
            </div>

            <h2
              className={cn('font-bold uppercase tracking-wider mb-6', {
                'text-6xl': titleLength <= 15,
                'text-5xl': titleLength > 15 && titleLength <= 25,
                'text-4xl': titleLength > 25,
              })}
              style={{
                color: textColor,
                letterSpacing: '0.05em',
              }}
            >
              {slide.title}
            </h2>

            <p
              className="text-2xl font-light"
              style={{
                color: textColor,
              }}
            >
              {slide.description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center">


            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-mono"
              style={{ color: textColor }}
            >
              {slide.websiteUrl}
            </a>

            <p
              className="text-xl font-medium tracking-wide"
              style={{ color: textColor }}
            >
              @{slide.footer}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const imageTemplates: ImageTemplate[] = [
  // ImageTemplate1,

  // ImageTemplate3,
  // ImageTemplate4,
  // ImageTemplate5,
  // ImageTemplate6,
  // ImageTemplate7,
  // ImageTemplate8,
  // ImageTemplate9,

  // ImageTemplate11,
  // ImageTemplate12,
  // ImageTemplate13,
  // ImageTemplate14,
  // ImageTemplate15,
  // ImageTemplate16

  ImageTemplate17,
  ImageTemplate18,
  ImageTemplate19,
  ImageTemplate20,
  ImageTemplate21,
  ImageTemplate22
];

