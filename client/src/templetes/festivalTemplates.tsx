import chroma from "chroma-js";
import cn from 'classnames';

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

// 1. Updated Diwali Template - Aligned with New Aesthetic
export const DiwaliTemplate: ImageTemplate = {
  id: 'diwali-mandala',
  name: 'Diwali Celebration',
  coverImageUrl: '/images/festivals/diwali-cover.png',
  slides: [
    {
      title: 'HAPPY DIWALI',
      description: 'May the festival of lights bring joy and prosperity',
      imageUrl: '/images/festivals/diwali-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFD700', materialTheme.background); // Gold
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background); // White
    const footerColor = ensureContrast('#8B4513', materialTheme.surface); // Brown

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center bg-cover bg-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FFD700 50%, #8B4513 100%)', // Orange to gold to brown
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-60" />

        {/* Diya (Oil Lamp) Element */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full opacity-80" />
          <div className="w-4 h-4 bg-yellow-300 rounded-full mx-auto -mt-2 animate-pulse" />
        </div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: `drop-shadow(0 0 10px ${chroma('#FFD700').alpha(0.6).css()})`,
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wider"
            style={{
              color: titleColor,
              textShadow: `0 4px 8px ${chroma('#8B4513').alpha(0.4).css()}`,
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: `0 2px 4px ${chroma('#8B4513').alpha(0.3).css()}`,
              background: 'rgba(139,69,19,0.3)', // Subtle brown background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-orange-800/20 to-yellow-800/20 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-yellow-500/20 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 2. Updated Christmas Template - Aligned with New Aesthetic
export const ChristmasTemplate: ImageTemplate = {
  id: 'christmas-snow',
  name: 'Christmas Magic',
  coverImageUrl: '/images/festivals/christmas-cover.png',
  slides: [
    {
      title: 'MERRY CHRISTMAS',
      description: 'Wishing you a season of joy and love',
      imageUrl: '/images/festivals/christmas-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#FFD700', materialTheme.background);
    const footerColor = ensureContrast('#228B22', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #0D4F0F 100%)', // Blue to green
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Snowflakes */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-red-600 to-green-600 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-green-600 to-red-600 opacity-60" />

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 left-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              background: 'rgba(34,139,34,0.3)', // Subtle green background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-red-800/30 to-green-800/30 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-red-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 3. Updated Holi Template - Aligned with New Aesthetic
export const HoliTemplate: ImageTemplate = {
  id: 'holi-colors',
  name: 'Holi Festival',
  coverImageUrl: '/images/festivals/holi-cover.png',
  slides: [
    {
      title: 'HAPPY HOLI',
      description: 'May the colors of Holi fill your life with joy',
      imageUrl: '/images/festivals/holi-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#FF69B4', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF69B4 0%, #FFD700 50%, #00CED1 100%)', // Pink to yellow to cyan
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Color Splashes */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-400 rounded-full opacity-60 blur-xl" />
          <div className="absolute top-32 right-20 w-28 h-28 bg-yellow-400 rounded-full opacity-60 blur-xl" />
          <div className="absolute bottom-40 left-32 w-36 h-36 bg-blue-400 rounded-full opacity-60 blur-xl" />
        </div>

        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-500 to-pink-500 opacity-60" />

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wider"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(255,105,180,0.3)', // Subtle pink background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-purple-600/40 to-pink-600/40 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-purple-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 4. Updated Lunar New Year Template - Aligned with New Aesthetic
export const LunarNewYearTemplate: ImageTemplate = {
  id: 'lunar-new-year',
  name: 'Lunar New Year',
  coverImageUrl: '/images/festivals/lunar-cover.png',
  slides: [
    {
      title: '新年快乐',
      description: 'Wishing you prosperity and good fortune',
      imageUrl: '/images/festivals/lunar-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#DC143C', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #DC143C 0%, #FFD700 100%)', // Red to gold
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-red-600 to-yellow-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-500 to-red-600 opacity-60" />

        {/* Lantern Elements */}
        <div className="absolute top-12 left-12 w-16 h-24 bg-red-600 rounded-full opacity-80 border-2 border-yellow-500" />
        <div className="absolute top-12 right-12 w-16 h-24 bg-red-600 rounded-full opacity-80 border-2 border-yellow-500" />

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 left-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(220,20,60,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(220,20,60,0.3)', // Subtle red background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-red-800/50 to-yellow-600/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-yellow-500/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 5. Updated Oktoberfest Template - Aligned with New Aesthetic
export const OktoberfestTemplate: ImageTemplate = {
  id: 'oktoberfest-bavarian',
  name: 'Oktoberfest',
  coverImageUrl: '/images/festivals/oktoberfest-cover.png',
  slides: [
    {
      title: 'OKTOBERFEST',
      description: 'Prost! Celebrate Bavarian traditions with us',
      imageUrl: '/images/festivals/oktoberfest-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#FFD700', materialTheme.background);
    const footerColor = ensureContrast('#0F4C75', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F4C75 0%, #BBE1FA 100%)', // Blue to light blue
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-600 to-white opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-white to-blue-600 opacity-60" />

        {/* Beer Mug Icon */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-6xl opacity-70">🍺</div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold tracking-wider"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(15,76,117,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(15,76,117,0.3)', // Subtle blue background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-blue-800/60 to-blue-600/60 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-blue-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 6. Updated Día de los Muertos Template - Aligned with New Aesthetic
export const DiaDeLosMuertosTemplate: ImageTemplate = {
  id: 'dia-de-los-muertos',
  name: 'Día de los Muertos',
  coverImageUrl: '/images/festivals/dia-cover.png',
  slides: [
    {
      title: 'DÍA DE LOS MUERTOS',
      description: 'Honoring our loved ones with love and celebration',
      imageUrl: '/images/festivals/dia-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#FF4500', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2D1B69 0%, #FF4500 100%)', // Purple to orange
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-purple-600 to-orange-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-orange-500 to-purple-600 opacity-60" />

        {/* Floral Patterns */}
        <div className="absolute top-12 left-12 text-4xl text-orange-400 opacity-70">🌺</div>
        <div className="absolute bottom-12 right-12 text-4xl text-red-400 opacity-70">🌹</div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 left-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,69,0,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(45,27,105,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(45,27,105,0.3)', // Subtle purple background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-purple-800/50 to-orange-800/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-orange-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 7. Updated Eid al-Fitr Template - Aligned with New Aesthetic
export const EidAlFitrTemplate: ImageTemplate = {
  id: 'eid-al-fitr',
  name: 'Eid al-Fitr Celebration',
  coverImageUrl: '/images/festivals/eid-cover.png',
  slides: [
    {
      title: 'EID MUBARAK',
      description: 'Wishing you joy, peace, and prosperity',
      imageUrl: '/images/festivals/eid-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#2E8B57', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2E8B57 0%, #FFD700 100%)', // Green to gold
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-green-600 to-yellow-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-500 to-green-600 opacity-60" />

        {/* Crescent Moon and Star */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-6xl text-yellow-300 opacity-70">🌙</div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(46,139,87,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(46,139,87,0.3)', // Subtle green background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-green-800/50 to-yellow-600/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-green-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 8. New Ramadan Template
export const RamadanTemplate: ImageTemplate = {
  id: 'ramadan',
  name: 'Ramadan Kareem',
  coverImageUrl: '/images/festivals/ramadan-cover.png',
  slides: [
    {
      title: 'RAMADAN KAREEM',
      description: 'Wishing you a blessed month of fasting and reflection',
      imageUrl: '/images/festivals/ramadan-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#4682B4', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4682B4 0%, #FFD700 100%)', // Blue to gold
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-600 to-yellow-500 opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-yellow-500 to-blue-600 opacity-60" />

        {/* Crescent Moon and Lantern */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-6xl text-yellow-300 opacity-70">🌙</div>
        <div className="absolute top-12 left-12 w-16 h-24 bg-yellow-500 rounded-t-full rounded-b-md opacity-70 border-2 border-blue-600" />

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(70,130,180,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(70,130,180,0.3)', // Subtle blue background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-blue-800/50 to-yellow-600/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-blue-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 9. New Hanukkah Template
export const HanukkahTemplate: ImageTemplate = {
  id: 'hanukkah',
  name: 'Hanukkah Celebration',
  coverImageUrl: '/images/festivals/hanukkah-cover.png',
  slides: [
    {
      title: 'HAPPY HANUKKAH',
      description: 'Wishing you light, love, and miracles',
      imageUrl: '/images/festivals/hanukkah-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;

    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#FFD700', materialTheme.background);
    const footerColor = ensureContrast('#1E90FF', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E90FF 0%, #FFFFFF 100%)', // Blue to white
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-600 to-white opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-white to-blue-600 opacity-60" />

        {/* Menorah and Stars */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-6xl text-yellow-300 opacity-70">🕎</div>
        <div className="absolute top-12 left-12 text-4xl text-yellow-300 opacity-70">✡️</div>
        <div className="absolute top-12 right-12 text-4xl text-yellow-300 opacity-70">✡️</div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-6">
          <h2
            className="text-8xl font-bold uppercase tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 8px rgba(30,144,255,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-3xl font-medium italic"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              background: 'rgba(30,144,255,0.3)', // Subtle blue background
              padding: '12px 24px',
              borderRadius: '20px',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-blue-800/50 to-white/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-xl font-semibold px-6 py-2 rounded-full bg-blue-600/80 backdrop-blur-sm"
            style={{ color: footerColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const MahaShivratriTemplate: ImageTemplate = {
  id: 'maha-shivratri-divine',
  name: 'Maha Shivratri',
  coverImageUrl: '/images/festivals/shivratri-cover.png',
  slides: [
    {
      title: 'MAHA SHIVRATRI',
      description: 'Discover your hidden potential and inner strength',
      imageUrl: '/images/festivals/shivratri-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#87CEEB', materialTheme.background);
    const footerColor = ensureContrast('#4169E1', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #191970 0%, #483D8B 50%, #6A5ACD 100%)', // Deep blue to slate blue
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Cosmic Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-4 h-4 bg-white rounded-full opacity-80 animate-pulse" />
          <div className="absolute top-40 left-32 w-2 h-2 bg-cyan-300 rounded-full opacity-60 animate-pulse" />
          <div className="absolute bottom-32 right-40 w-3 h-3 bg-white rounded-full opacity-70 animate-pulse" />
        </div>

        {/* Trident Symbol */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-16 bg-gradient-to-b from-cyan-300 to-blue-400 mx-auto" />
          <div className="flex justify-center -mt-12">
            <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-300 transform rotate-45" />
            <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-300 transform -rotate-45" />
          </div>
        </div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(135,206,235,0.6))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-8">
          <h2
            className="text-7xl font-bold uppercase tracking-wide"
            style={{
              color: titleColor,
              textShadow: '0 4px 12px rgba(65,105,225,0.5)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-2xl font-medium leading-relaxed max-w-2xl"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 6px rgba(0,0,0,0.4)',
              background: 'rgba(72,61,139,0.4)',
              padding: '16px 28px',
              borderRadius: '25px',
              border: '1px solid rgba(135,206,235,0.3)',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-lg font-semibold px-6 py-3 rounded-full bg-blue-600/80 backdrop-blur-sm border border-cyan-400/30"
            style={{ color: '#FFFFFF' }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 7. Ram Navami Template - Inspired by the orange devotional theme
export const RamNavamiTemplate: ImageTemplate = {
  id: 'ram-navami-devotion',
  name: 'Ram Navami',
  coverImageUrl: '/images/festivals/ramnavami-cover.png',
  slides: [
    {
      title: 'JAI SHRI RAM',
      description: 'May Lord Rama bless you with strength and righteousness',
      imageUrl: '/images/festivals/ramnavami-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#8B0000', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #CD853F 100%)', // Orange red to tomato to tan
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Decorative Mandala Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-yellow-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-yellow-300 rounded-full" />
        </div>

        {/* Om Symbol */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div 
            className="text-4xl font-bold text-yellow-300 opacity-80"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            ॐ
          </div>
        </div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 left-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.7))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-8">
          <h2
            className="text-8xl font-bold uppercase tracking-wider"
            style={{
              color: titleColor,
              textShadow: '0 6px 12px rgba(139,0,0,0.6)',
              fontWeight: 900,
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-2xl font-medium leading-relaxed max-w-3xl"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              background: 'rgba(139,0,0,0.3)',
              padding: '16px 28px',
              borderRadius: '25px',
              border: '2px solid rgba(255,215,0,0.4)',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-lg font-semibold px-6 py-3 rounded-full bg-red-700/80 backdrop-blur-sm border border-yellow-400/40"
            style={{ color: '#FFD700' }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 8. Ganesh Chaturthi Template - Elegant purple and gold
export const GaneshChaturthiTemplate: ImageTemplate = {
  id: 'ganesh-chaturthi-elegant',
  name: 'Ganesh Chaturthi',
  coverImageUrl: '/images/festivals/ganesh-cover.png',
  slides: [
    {
      title: 'GANPATI BAPPA MORYA',
      description: 'May Lord Ganesha remove all obstacles from your path',
      imageUrl: '/images/festivals/ganesh-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#800080', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #4B0082 0%, #8A2BE2 50%, #DA70D6 100%)', // Indigo to blue violet to orchid
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Lotus Petals */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-32 bg-gradient-to-t from-pink-400 to-transparent rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '50% 100%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        {/* Modak Elements */}
        <div className="absolute top-20 left-20 w-8 h-8 bg-yellow-400 transform rotate-45 opacity-70" />
        <div className="absolute top-20 right-20 w-8 h-8 bg-yellow-400 transform rotate-45 opacity-70" />

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.8))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center space-y-6">
          <h2
            className="text-6xl font-bold uppercase tracking-wide leading-tight"
            style={{
              color: titleColor,
              textShadow: '0 4px 10px rgba(128,0,128,0.6)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-2xl font-medium leading-relaxed max-w-2xl"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 6px rgba(0,0,0,0.4)',
              background: 'rgba(128,0,128,0.4)',
              padding: '16px 28px',
              borderRadius: '30px',
              border: '2px solid rgba(255,215,0,0.3)',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-lg font-semibold px-6 py-3 rounded-full bg-purple-700/80 backdrop-blur-sm border border-gold/40"
            style={{ color: '#FFD700' }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 9. Eid Mubarak Template - Elegant green and gold
export const EidTemplate: ImageTemplate = {
  id: 'eid-mubarak-crescent',
  name: 'Eid Mubarak',
  coverImageUrl: '/images/festivals/eid-cover.png',
  slides: [
    {
      title: 'EID MUBARAK',
      description: 'May this blessed day bring peace and happiness',
      imageUrl: '/images/festivals/eid-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFD700', materialTheme.background);
    const descriptionColor = ensureContrast('#FFFFFF', materialTheme.background);
    const footerColor = ensureContrast('#228B22', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #006400 0%, #228B22 50%, #32CD32 100%)', // Dark green to forest green to lime green
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Islamic Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-gold rotate-45" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 border-4 border-gold rotate-45" />
          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 border-4 border-gold rotate-45" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-4 border-gold rotate-45" />
        </div>

        {/* Crescent and Star */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-yellow-300 rounded-full border-r-transparent transform rotate-45" />
            <div className="absolute -top-1 -right-2 text-yellow-300 text-sm">★</div>
          </div>
        </div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 left-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.7))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-8">
          <h2
            className="text-8xl font-bold uppercase tracking-wider"
            style={{
              color: titleColor,
              textShadow: '0 6px 12px rgba(34,139,34,0.6)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-2xl font-medium leading-relaxed max-w-2xl"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              background: 'rgba(34,139,34,0.4)',
              padding: '16px 28px',
              borderRadius: '25px',
              border: '2px solid rgba(255,215,0,0.4)',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-lg font-semibold px-6 py-3 rounded-full bg-green-700/80 backdrop-blur-sm border border-yellow-400/40"
            style={{ color: '#FFD700' }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 10. Birthday Celebration Template - Modern and vibrant
export const BirthdayTemplate: ImageTemplate = {
  id: 'birthday-celebration',
  name: 'Birthday Celebration',
  coverImageUrl: '/images/celebrations/birthday-cover.png',
  slides: [
    {
      title: 'HAPPY BIRTHDAY',
      description: 'Celebrating another year of amazing memories',
      imageUrl: '/images/celebrations/birthday-bg.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, ensureContrast, materialTheme } = colors;
    
    const titleColor = ensureContrast('#FFFFFF', materialTheme.background);
    const descriptionColor = ensureContrast('#FFD700', materialTheme.background);
    const footerColor = ensureContrast('#FF1493', materialTheme.surface);

    return (
      <div
        className="relative w-[1080px] h-[1080px] flex flex-col justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 25%, #FFD700 50%, #FF4500 75%, #8A2BE2 100%)',
          fontFamily: typography.fontFamily,
        }}
      >
        {/* Confetti Effect */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 opacity-80 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF69B4', '#00CED1', '#32CD32', '#FF4500'][Math.floor(Math.random() * 5)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Balloon Elements */}
        <div className="absolute top-12 left-12">
          <div className="w-8 h-12 bg-red-400 rounded-full opacity-80" />
          <div className="w-1 h-8 bg-gray-600 mx-auto" />
        </div>
        <div className="absolute top-16 left-24">
          <div className="w-8 h-12 bg-blue-400 rounded-full opacity-80" />
          <div className="w-1 h-8 bg-gray-600 mx-auto" />
        </div>

        {addLogo && (
          <img
            src={defaultLogoUrl}
            alt="Logo"
            className="absolute top-8 right-8 w-48 h-24 object-contain z-30"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))',
            }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-8 text-center space-y-8">
          <h2
            className="text-8xl font-bold uppercase tracking-wider"
            style={{
              color: titleColor,
              textShadow: '0 6px 12px rgba(255,20,147,0.6)',
            }}
          >
            {slide.title}
          </h2>
          
          <p
            className="text-2xl font-medium leading-relaxed max-w-2xl"
            style={{
              color: descriptionColor,
              textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              background: 'rgba(255,20,147,0.3)',
              padding: '16px 28px',
              borderRadius: '25px',
              border: '2px solid rgba(255,215,0,0.5)',
            }}
          >
            {slide.description}
          </p>
        </div>

        <div className="relative z-10 flex justify-center p-6 bg-gradient-to-r from-pink-900/50 to-purple-900/50 backdrop-blur-sm">
          <a
            href={slide.websiteUrl}
            className="text-lg font-semibold px-6 py-3 rounded-full bg-pink-600/80 backdrop-blur-sm border border-yellow-400/40"
            style={{ color: '#FFFFFF' }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};


// Export all templates
export const festivalTemplates: ImageTemplate[] = [
  DiwaliTemplate,
  ChristmasTemplate,
  HoliTemplate,
  LunarNewYearTemplate,
  OktoberfestTemplate,
  DiaDeLosMuertosTemplate,
  EidAlFitrTemplate,
  RamadanTemplate, // New
  HanukkahTemplate, // New
   DiwaliTemplate,
  ChristmasTemplate,
  HoliTemplate,
  LunarNewYearTemplate,
  MahaShivratriTemplate,
  RamNavamiTemplate,
  GaneshChaturthiTemplate,
  EidTemplate,
  BirthdayTemplate,
];