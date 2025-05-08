
import chroma from 'chroma-js';

export interface ImageSlide {
    title: string;
    description: string;
    imageUrl: string; // Background image (default or AI-generated)
    footer: string;
    websiteUrl: string;
}

export interface Colors {
    logoColors?: string[];
    imageColors?: string[];
    ensureContrast?: (color1: string, color2: string) => string;
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
//     coverImageUrl: '/images/image-cover/cover1.png', // Thumbnail for the template
//     slides: [
//         {
//             title: 'ENCOURAGING WORDS',
//             description: '"Is it too soon to say \'I love you\'?"',
//             imageUrl: '/images/background14.jpg', // Default background image
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
//                 <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center uppercase">
//                     {slide.title}
//                 </h2>

//                 {/* Description */}
//                 <p className="text-lg md:text-xl text-center italic">
//                     {slide.description}
//                 </p>

//                 {/* Footer (Bottom-Right) */}
//                 <div className="flex justify-end mt-4">
//                     <span className="text-sm md:text-base text-gray-300">
//                         @{slide.footer}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     ),
// };

// const ImageTemplate2: ImageTemplate = {
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

const ImageTemplate3: ImageTemplate = {
    id: 'dna-mystery',
    name: 'DNA Mystery',
    coverImageUrl: '/images/image-cover/cover2.png',
    slides: [
      {
        title: 'A MYSTERIOUS DISCOVERY',
        description: '"Unraveling the secrets of ancient DNA hidden within us."',
        imageUrl: '/images/background16.jpg',
        footer: 'bitrox.tech',
        websiteUrl: 'https://bitrox.tech',
      },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
      // Fallback colors if extraction fails
      const logoColors = colors?.logoColors || ['#FF5733', '#33FF57', '#5733FF', '#FFFFFF', '#000000'];
      const imageColors = colors?.imageColors || ['#A0A0A0', '#D3D3D3', '#4A4A4A', '#FFFFFF', '#000000'];
      const ensureContrast = colors?.ensureContrast ?? ((textColor: string) => textColor);
        
  
      // Select colors for styling
      const backgroundColor = imageColors[0]; // Use image's dominant color for background
      const textColor = logoColors[0];
      const accentColor = logoColors[1]; // Use logo's secondary color for accents
      const footerColor = imageColors[2]; // Use image's tertiary color for footer
  
      // Ensure text readability
      const adjustedTextColor = ensureContrast(textColor, backgroundColor);
    const adjustedFooterColor = ensureContrast(footerColor, backgroundColor);
      return (
        <div
          className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-end text-white"
          style={{
            backgroundImage: slide.imageUrl ? `url(${slide.imageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: backgroundColor, 
          }}
        >
          {/* Logo (Top-Right) */}
          {addLogo && (
            <div
              className="absolute top-4 right-4 w-32 h-12 md:w-40 md:h-16 flex items-center justify-center z-20"
              style={{
                // backgroundColor: chroma(accentColor).alpha(0.8).css(), // Semi-transparent accent background
                borderRadius: '8px',
                padding: '4px',
              }}
            >
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
  
          {/* Content Section (Bottom) */}
          <div className="relative z-10 bg-black bg-opacity-60 p-6 md:p-8">
            {/* Title */}
            <h2
              className="text-3xl md:text-5xl font-extrabold mb-3 text-center uppercase tracking-wide"
              style={{ color: adjustedTextColor }}
            >
              {slide.title}
            </h2>
  
            {/* Description */}
            <p
              className="text-lg md:text-2xl text-center font-light"
              style={{ color: adjustedTextColor }}
            >
              {slide.description}
            </p>
  
            {/* Footer (Bottom-Right) */}
            <div className="flex justify-end mt-4">
              <span
                className="text-sm md:text-base"
                style={{ color: adjustedFooterColor }}
              >
                @{slide.footer}
              </span>
            </div>
          </div>
        </div>
      );
    },
  };


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
// const ImageTemplate7: ImageTemplate = {
//     id: 'floating-elements',
//     name: 'Floating Elements',
//     coverImageUrl: '/images/image-cover/cover7.png',
//     slides: [
//         {
//             title: 'CREATIVE FLOW',
//             description: 'Where imagination takes flight',
//             imageUrl: '/images/background20.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-gradient-to-br from-purple-900 to-blue-900">
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute w-40 h-40 bg-blue-500 rounded-full blur-3xl -top-10 -left-10 opacity-30" />
//                 <div className="absolute w-40 h-40 bg-purple-500 rounded-full blur-3xl top-1/2 right-10 opacity-30" />
//                 <div className="absolute w-40 h-40 bg-pink-500 rounded-full blur-3xl bottom-10 left-1/2 opacity-30" />
//             </div>
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
//             <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center p-8">
//                 <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
//                     {slide.title}
//                 </h2>
//                 <p className="text-2xl mb-8">{slide.description}</p>
//                 <span className="text-lg">@{slide.footer}</span>
//             </div>
//         </div>
//     ),
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

// // Template 10: Modern Grid
// const ImageTemplate10: ImageTemplate = {
//     id: 'modern-grid',
//     name: 'Modern Grid',
//     coverImageUrl: '/images/image-cover/cover10.png',
//     slides: [
//         {
//             title: 'STRUCTURED BEAUTY',
//             description: 'Finding harmony in organization',
//             imageUrl: '/images/background23.jpg',
//             footer: 'bitrox.tech',
//             websiteUrl: 'https://bitrox.tech',
//         },
//     ],
//     renderSlide: (slide, addLogo, defaultLogoUrl) => (
//         <div className="relative w-full h-[600px] md:h-[700px] bg-gray-900 grid grid-cols-2 grid-rows-2 gap-1 p-1">
//             <div
//                 className="bg-cover bg-center"
//                 style={{ backgroundImage: `url(${slide.imageUrl})` }}
//             />
//             <div className="bg-gray-800 flex items-center justify-center">
//                 <h2 className="text-4xl font-bold text-white">{slide.title}</h2>
//             </div>
//             <div className="bg-gray-800 flex items-center justify-center p-6">
//                 <p className="text-xl text-white text-center">{slide.description}</p>
//             </div>
//             <div className="bg-gray-800 flex items-center justify-center">
//                 <span className="text-lg text-white">@{slide.footer}</span>
//             </div>
//             {addLogo && (
//                 <img
//                     src={defaultLogoUrl}
//                     alt="Logo"
//                     className="absolute top-4 right-4 w-32 object-contain z-10"
//                 />
//             )}
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

export const imageTemplates: ImageTemplate[] = [
    // ImageTemplate1,
    // ImageTemplate2,
    ImageTemplate3,
    // ImageTemplate4,
    // ImageTemplate5,
    // ImageTemplate6,
    // ImageTemplate7,
    // ImageTemplate8,
    // ImageTemplate9,
    // ImageTemplate10,
    // ImageTemplate11,
    // ImageTemplate12,
    // ImageTemplate13,
    // ImageTemplate14,
    // ImageTemplate15,
    // ImageTemplate16
];

