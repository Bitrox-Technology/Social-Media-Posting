import chroma from "chroma-js";
import cn from 'classnames';

export interface FestivalSlide {
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  footer: string;
  websiteUrl: string;
}

export interface Colors {
  logoColors: { primary: string; secondary: string; accent: string[] };
  imageColors: string[];
  glowColor: string;
  complementaryTextColor: string;
  ensureContrast: (color1: string, color2: string) => string;
  vibrantLogoColor: string;
  vibrantTextColor: string;
  footerColor: string;
  backgroundColor: string;
  typography: { fontFamily: string; fontWeight: number; fontSize: string };
  graphicStyle: { borderRadius: string; iconStyle: string; filter: string };
  materialTheme: { [key: string]: string };
}

export interface FestivalTemplate {
  id: string;
  name: string;
  slides: FestivalSlide[];
  renderSlide: (slide: FestivalSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
}

const ensureContrast = (color1: string, color2: string) => {
  const c1 = chroma(color1);
  const c2 = chroma(color2);
  if (chroma.contrast(c1, c2) < 4.5) { // WCAG AA standard
    return c1.luminance() > c2.luminance() ? c1.darken(0.5).hex() : c1.brighten(0.5).hex();
  }
  return c1.hex();
};

// 1. Updated Diwali Template - Aligned with New Aesthetic
export const DiwaliTemplate: FestivalTemplate = {
  id: 'diwali-happy-ludhiana',
  name: 'Diwali - Happy Ludhiana',
  coverImageUrl: '/images/festival-covers/diwali-cover.png',
  slides: [
    {
      title: 'Happy Diwali',
      description: 'May your life be filled with endless light!',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/diwali-bg.jpg', // Example: a bokeh light background
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FFD700'; // Gold
    const secondaryColor = '#FF4500'; // Orange-Red
    const bgColor = '#1A1A1A'; // Deep Dark
    const textColor = '#FFFFFF'; // White
    const accentColor = '#FFC107'; // Amber

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
          boxShadow: `0 0 40px ${chroma(primaryColor).alpha(0.7).css()}`,
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.4).css() }} />

        {/* Decorative Light Glows (layered) */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-50" style={{ backgroundColor: primaryColor }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-40" style={{ backgroundColor: secondaryColor }} />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-3xl opacity-60" style={{ backgroundColor: accentColor }} />

        {/* Central Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: 'brightness(1.5)', boxShadow: `0 0 20px ${chroma(primaryColor).alpha(0.8).css()}` }}
            />
          )}

          {/* Title with extra glow */}
          <h2
            className="text-8xl font-black uppercase mb-6 tracking-wide"
            style={{
              color: ensureContrast(textColor, bgColor),
              textShadow: `0 0 20px ${chroma(accentColor).alpha(0.8).css()}, 0 0 30px ${chroma(primaryColor).alpha(0.6).css()}`,
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-light max-w-3xl mb-12"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor),
              textShadow: `0 0 10px ${chroma(primaryColor).alpha(0.4).css()}`,
            }}
          >
            {slide.description}
          </p>

          {/* Decorative Diya Line */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-20 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span className="text-5xl" style={{ color: accentColor }}>🪔</span> {/* Diya unicode character */}
            <div className="w-20 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-right"
          style={{
            backgroundColor: chroma(bgColor).alpha(0.6).css(),
            borderTop: `1px solid ${chroma(primaryColor).alpha(0.3).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-medium tracking-wider"
            style={{
              color: ensureContrast(accentColor, bgColor),
              textShadow: `0 0 8px ${chroma(accentColor).alpha(0.5).css()}`,
            }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 2. Baisakhi: Harvest Hues
export const BaisakhiTemplate: FestivalTemplate = {
  id: 'baisakhi-harvest-hues',
  name: 'Baisakhi - Harvest Hues',
  coverImageUrl: '/images/festival-covers/baisakhi-cover.png',
  slides: [
    {
      title: 'Happy Baisakhi',
      description: 'Celebrating the golden harvest and new beginnings!',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/baisakhi-bg.jpg', // Example: fields of wheat
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FFD700'; // Gold (for wheat/sun)
    const secondaryColor = '#4CAF50'; // Green (for fields)
    const accentColor = '#FF9800'; // Amber (for warmth)
    const bgColor = '#F5F5DC'; // Khaki / Light Beige
    const textColor = '#3E2723'; // Dark Brown

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Dynamic gradient overlay based on image presence */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, ${chroma(secondaryColor).alpha(0.3).css()} 0%, ${chroma(primaryColor).alpha(0.2).css()} 100%)`,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }} />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.3).css() }} />

        {/* Abstract Wheat/Folk elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400 rounded-full opacity-30 blur-2xl" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500 rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 transform rotate-45" style={{ backgroundColor: primaryColor, opacity: 0.4, borderRadius: graphicStyle.borderRadius }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col flex-1 p-16 justify-between items-center text-center">
          {/* Logo */}
          {addLogo && (
            <div className="w-full flex justify-end">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-48 h-24 object-contain mb-12"
                style={{ filter: 'grayscale(0.3)' }}
              />
            </div>
          )}

          {/* Main Title & Description */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <h2
              className="text-8xl font-extrabold uppercase mb-6 tracking-tight"
              style={{ color: ensureContrast(textColor, bgColor), textShadow: `2px 2px 4px ${chroma(primaryColor).alpha(0.4).css()}` }}
            >
              {slide.title}
            </h2>
            <p
              className="text-3xl font-medium max-w-3xl leading-relaxed"
              style={{ color: ensureContrast(chroma(textColor).alpha(0.9).hex(), bgColor) }}
            >
              {slide.description}
            </p>
          </div>

          {/* Decorative Harvest Line */}
          <div className="flex items-center space-x-6 mt-16">
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span className="text-4xl" style={{ color: secondaryColor }}>🌾</span> {/* Wheat ear unicode */}
            <span className="text-4xl" style={{ color: accentColor }}>💃</span> {/* Dancing person unicode */}
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>

          {/* Footer */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider mt-12"
            style={{ color: ensureContrast(secondaryColor, bgColor) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 3. Lohri: Bonfire Glow
export const LohriTemplate: FestivalTemplate = {
  id: 'lohri-bonfire-glow',
  name: 'Lohri - Bonfire Glow',
  coverImageUrl: '/images/festival-covers/lohri-cover.png',
  slides: [
    {
      title: 'Happy Lohri',
      description: 'May the bonfire of Lohri burn all your sorrows and bring warmth, joy, and prosperity!',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/lohri-bg.jpg', // Example: a blurred bonfire background
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FF4500'; // OrangeRed
    const secondaryColor = '#FFA500'; // DarkOrange
    const accentColor = '#8B4513'; // SaddleBrown
    const bgColor = '#2C0F05'; // Very Dark Brown
    const textColor = '#FFD700'; // Gold

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-end bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Top gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-70" />

        {/* Abstract fire/ember elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-800 via-orange-700 to-transparent opacity-70" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-60" style={{ backgroundColor: primaryColor }} />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-3xl opacity-50" style={{ backgroundColor: secondaryColor }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col p-16 pt-32 text-center items-center">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="absolute top-16 right-16 w-40 h-20 object-contain"
              style={{ filter: 'brightness(1.8)' }}
            />
          )}

          {/* Main Title & Description */}
          <h2
            className="text-8xl font-extrabold uppercase mb-6 tracking-wide"
            style={{ color: ensureContrast(textColor, bgColor), textShadow: `0 0 20px ${chroma(primaryColor).alpha(0.7).css()}` }}
          >
            {slide.title}
          </h2>
          <p
            className="text-3xl font-normal max-w-3xl leading-relaxed mb-12"
            style={{ color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor) }}
          >
            {slide.description}
          </p>

          {/* Festive Icons (Peanuts, Rewari, Gur) */}
          <div className="flex space-x-8 text-5xl mb-16">
            <span style={{ color: secondaryColor }}>🥜</span>
            <span style={{ color: primaryColor }}>🍬</span>
            <span style={{ color: accentColor }}>🍯</span>
          </div>
        </div>

        {/* Footer at the very bottom, close to the fire */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(bgColor).alpha(0.4).css(),
            borderTop: `2px solid ${chroma(primaryColor).alpha(0.6).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, bgColor) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 4. Holi: Chromatic Splash

export const HoliTemplate: FestivalTemplate = {
  id: 'holi-chromatic-splash',
  name: 'Holi - Chromatic Splash',
  coverImageUrl: '/images/festival-covers/holi-cover.png',
  slides: [
    {
      title: 'Happy Holi',
      description: 'May your life be painted with colors of joy and happiness! Join us to celebrate the festival of colors with love and laughter.',
      date: '2026-03-19', // Updated to Holi 2026 (future date)
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg', // Background image
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    // Define colors for a vibrant Holi theme
    const primaryColor = chroma('#ff6f61').hex(); // Coral pink (used in FlashSaleTemplate1)
    const secondaryColor = chroma('#1b263b').hex(); // Navy blue (for the button)
    const accentColor = chroma('#fff').hex(); // White for text
    const bgColor = chroma('#f5f5f5').hex(); // Light gray for the overall background
    const textColor = chroma('#1b263b').hex(); // Navy blue for footer text

    const usePrimary = logoColors.primary || primaryColor;
    const useSecondary = logoColors.secondary || secondaryColor;

    const splashColors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
      '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    ];

    // Calculate days remaining until the festival
    const currentDate = new Date('2025-06-17T14:31:00+05:30'); // Current date and time (IST)
    const festivalDate = new Date('2026-03-19T23:59:59+05:30'); // Festival date (end of day)
    const timeDiff = festivalDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Left Side: Image with Color Splashes */}
        <div className="w-1/2 h-full relative">
          <img
            src={slide.imageUrl}
            alt="Holi Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          
          <div
            className="absolute inset-0"
            style={{ backgroundColor: chroma(materialTheme.background).alpha(0.3).css() }}
          />
        </div>

        {/* Right Side: Content */}
        <div
          className="w-1/2 h-full flex flex-col justify-center items-start p-20"
          style={{ backgroundColor: chroma(usePrimary).alpha(0.9).css() }}
        >
          {/* Logo in Top-Right */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
            </div>
          )}

          {/* Title */}
          <h2
            className="text-5xl font-bold mb-6 leading-tight"
            style={{ color: accentColor, maxWidth: '90%', textAlign: 'left' }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-xl leading-relaxed mb-4"
            style={{ color: chroma(accentColor).alpha(0.9).css(), maxWidth: '85%', textAlign: 'left' }}
          >
            {slide.description}
          </p>

          {/* Date */}
          <p
            className="text-lg font-medium mb-4"
            style={{ color: accentColor, textAlign: 'left' }}
          >
            On the Date: {slide.date}
          </p>

          {/* Days Remaining */}
          <p
            className="text-lg font-medium mb-8"
            style={{ color: accentColor, textAlign: 'left' }}
          >
            Few days to go!
          </p>

          {/* Call-to-Action Button */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: useSecondary,
              color: accentColor,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            Celebrate Now
          </a>
        </div>

        {/* Bottom Section: Website URL and Footer */}
        <div className="absolute bottom-8 w-full flex justify-between items-center z-10 px-12">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-medium tracking-wide hover:underline"
            style={{ color: chroma(textColor).alpha(0.9).css() }}
          >
            {slide.websiteUrl}
          </a>
          <p
            className="text-xl font-medium tracking-wide"
            style={{ color: chroma(textColor).alpha(0.9).css() }}
          >
            @{slide.footer}
          </p>
        </div>
      </div>
    );
  },
};
// 5. Dussehra: Triumphant Arch
export const DussehraTemplate: FestivalTemplate = {
  id: 'dussehra-triumphant-arch',
  name: 'Dussehra - Triumphant Arch',
  coverImageUrl: '/images/festival-covers/dussehra-cover.png',
  slides: [
    {
      title: 'Happy Dussehra',
      description: 'Celebrate the victory of good over evil!',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/dussehra-bg.jpg', // Example: abstract fire/smoke or traditional arch
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#B71C1C'; // Dark Red (for valor)
    const secondaryColor = '#FF9800'; // Amber (for energy/fire)
    const accentColor = '#FFD700'; // Gold (for triumph)
    const bgColor = '#1A0A0A'; // Very Dark Red/Brown
    const textColor = '#FFFFFF'; // White

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-end bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Dynamic Arches / Geometric Overlays */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>
        <div
          className="absolute bottom-0 w-full h-3/4"
          style={{
            background: `linear-gradient(to right, ${chroma(primaryColor).alpha(0.5).css()} 0%, transparent 20%, transparent 80%, ${chroma(primaryColor).alpha(0.5).css()} 100%)`,
            maskImage: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, black 100%)`,
            maskMode: 'alpha',
            opacity: 0.7,
            transform: 'scaleY(1.2) translateY(20%)',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 transform rotate-45" style={{ backgroundColor: secondaryColor, opacity: 0.2, borderRadius: graphicStyle.borderRadius }} />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-2xl opacity-30" style={{ backgroundColor: accentColor }} />


        {/* Content Section */}
        <div className="relative z-10 flex flex-col p-16 pt-32 text-center items-center">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="absolute top-16 right-16 w-40 h-20 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
            />
          )}

          {/* Main Title & Description */}
          <h2
            className="text-8xl font-black uppercase mb-6 tracking-wide"
            style={{ color: ensureContrast(textColor, bgColor), textShadow: `0 0 15px ${accentColor}, 0 0 25px ${primaryColor}` }}
          >
            {slide.title}
          </h2>
          <p
            className="text-3xl font-normal max-w-3xl leading-relaxed mb-12"
            style={{ color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor) }}
          >
            {slide.description}
          </p>

          {/* Bow and Arrow Icon */}
          <span className="text-9xl mt-12 mb-16" style={{ color: accentColor }}>🏹</span>
        </div>

        {/* Footer at the bottom */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.4).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.6).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.4).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 6. Raksha Bandhan: Threaded Affection
export const RakshaBandhanTemplate: FestivalTemplate = {
  id: 'raksha-bandhan-threaded-affection',
  name: 'Raksha Bandhan - Threaded Affection',
  coverImageUrl: '/images/festival-covers/rakhi-cover.png',
  slides: [
    {
      title: 'Happy Raksha Bandhan',
      description: 'Celebrating the unbreakable bond of siblings',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/rakhi-bg.jpg', // Example: soft focus background with traditional elements
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#E91E63'; // Pink (for affection)
    const secondaryColor = '#81C784'; // Light Green (for harmony)
    const accentColor = '#FFC107'; // Amber (for warmth)
    const bgColor = '#FFF8E1'; // Very Light Yellow/Cream
    const textColor = '#3E2723'; // Dark Brown

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Soft, swirling patterns reminiscent of threads */}
        <div className="absolute inset-0 opacity-50" style={{
          background: `radial-gradient(circle at top left, ${chroma(primaryColor).alpha(0.2).css()}, transparent 50%),
                         radial-gradient(circle at bottom right, ${chroma(secondaryColor).alpha(0.2).css()}, transparent 50%)`
        }} />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.3).css() }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-7xl font-bold uppercase mb-6 tracking-wide"
            style={{ color: ensureContrast(textColor, bgColor) }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-light max-w-3xl leading-relaxed mb-12"
            style={{ color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor) }}
          >
            {slide.description}
          </p>

          {/* Rakhi/Bracelet Icon */}
          <span className="text-9xl mt-12 mb-16" style={{ color: primaryColor }}>🎗️</span>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.1).css(),
            borderTop: `1px solid ${chroma(secondaryColor).alpha(0.3).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-medium tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.1).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 7. Karwa Chauth: Lunar Grace
export const KarwaChauthTemplate: FestivalTemplate = {
  id: 'karwa-chauth-lunar-grace',
  name: 'Karwa Chauth - Lunar Grace',
  coverImageUrl: '/images/festival-covers/karwa-chauth-cover.png',
  slides: [
    {
      title: 'Happy Karwa Chauth',
      description: 'Fasting with devotion for a blessed bond',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/moon-bg.jpg', // Example: subtle night sky/moon background
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#880E4F'; // Deep Pink/Maroon
    const secondaryColor = '#4A148C'; // Deep Purple
    const accentColor = '#FFD700'; // Gold (for moon/stars)
    const bgColor = '#0F0F2A'; // Very Dark Blue
    const textColor = '#FFFAF0'; // Floral White

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Celestial elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-50" style={{ backgroundColor: accentColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ backgroundColor: primaryColor }} />

        {/* Traditional Patterns (subtle) */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="${chroma(primaryColor).alpha(0.5).hex()}" stroke-width="2"/><path d="M50 10 L60 20 L50 30 L40 20 Z" fill="${chroma(secondaryColor).alpha(0.5).hex()}"/></svg>')`,
          backgroundSize: '200px 200px',
          mixBlendMode: 'overlay',
          opacity: 0.1
        }} />


        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-7xl font-bold uppercase mb-6 tracking-wide"
            style={{ color: ensureContrast(textColor, bgColor), textShadow: `0 0 15px ${accentColor}, 0 0 25px ${primaryColor}` }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-light max-w-3xl leading-relaxed mb-12"
            style={{ color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor) }}
          >
            {slide.description}
          </p>

          {/* Moon and Sieve Icons */}
          <div className="flex space-x-8 text-7xl mt-12 mb-16">
            <span style={{ color: accentColor }}>🌕</span>
            <span style={{ color: primaryColor }}>🧺</span> {/* Sieve emoji, if available, otherwise just use a subtle pattern */}
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.3).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.5).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-medium tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.3).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// 8. Punjabi Spirit (Broader Cultural Theme)
export const PunjabiSpiritTemplate: FestivalTemplate = {
  id: 'punjabi-spirit',
  name: 'Punjabi Spirit - Cultural',
  coverImageUrl: '/images/festival-covers/punjabi-cover.png',
  slides: [
    {
      title: 'Colours of Punjab',
      description: 'Celebrating the vibrant culture and rich heritage of Punjab',
      date: '2025-06-10',
      imageUrl: '/images/festival-backgrounds/punjabi-bg.jpg', // Example: traditional Punjabi pattern or folk art
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FFC107'; // Amber (Gold)
    const secondaryColor = '#8BC34A'; // Light Green
    const accentColor = '#673AB7'; // Deep Purple (for intricate details)
    const bgColor = '#F5F5DC'; // Khaki / Light Beige
    const textColor = '#3E2723'; // Dark Brown

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Traditional Phulkari-like patterns or abstract geometric shapes */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" fill="${chroma(primaryColor).alpha(0.5).hex()}"/><rect x="20" y="20" width="20" height="20" fill="${chroma(secondaryColor).alpha(0.5).hex()}"/><rect x="40" y="40" width="20" height="20" fill="${chroma(accentColor).alpha(0.5).hex()}"/></svg>')`,
          backgroundSize: '150px 150px',
          mixBlendMode: 'multiply',
          opacity: 0.2
        }} />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.3).css() }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${primaryColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-7xl font-extrabold uppercase mb-6 tracking-wide"
            style={{ color: ensureContrast(textColor, bgColor), textShadow: `2px 2px 0px ${primaryColor}` }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-medium max-w-3xl leading-relaxed mb-12"
            style={{ color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor) }}
          >
            {slide.description}
          </p>

          {/* Cultural Icons (Bhangra/Gidda dancers) */}
          <div className="flex space-x-12 text-8xl mt-12 mb-16">
            <span style={{ color: primaryColor }}>🕺</span>
            <span style={{ color: secondaryColor }}>💃</span>
          </div>
        </div>

        {/* Footer with a traditional pattern line */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.1).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.4).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.1).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const BusinessEventTemplate: FestivalTemplate = {
  id: 'business-event-announcement',
  name: 'Business Event Announcement',
  coverImageUrl: '/images/business-covers/event-announcement-cover.png',
  slides: [
    {
      title: 'Annual Business Summit',
      description: 'Join us for a day of networking and insights!',
      date: '2025-06-10',
      imageUrl: '/images/business-backgrounds/event-bg.jpg', // Abstract geometric background
      footer: 'Your Business Name',
      websiteUrl: 'https://yourbusiness.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FFD700'; // Gold
    const secondaryColor = '#1E3A8A'; // Deep Navy
    const accentColor = '#F59E0B'; // Amber
    const bgColor = '#1E1E2F'; // Dark Slate
    const textColor = '#FFFFFF'; // White

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          backgroundColor: bgColor,
          boxShadow: `0 0 40px ${chroma(primaryColor).alpha(0.7).css()}`,
        }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.4).css() }} />

        {/* Abstract Light Bursts */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-50" style={{ backgroundColor: primaryColor }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-40" style={{ backgroundColor: accentColor }} />

        {/* Central Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: 'brightness(1.5)', boxShadow: `0 0 20px ${chroma(primaryColor).alpha(0.8).css()}` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-extrabold uppercase mb-6 tracking-wide"
            style={{
              color: ensureContrast(textColor, bgColor),
              textShadow: `0 0 20px ${chroma(accentColor).alpha(0.8).css()}`,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-light max-w-3xl mb-12"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor),
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Decorative Line */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-20 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
            <div className="w-20 h-1 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-right"
          style={{
            backgroundColor: chroma(bgColor).alpha(0.6).css(),
            borderTop: `1px solid ${chroma(primaryColor).alpha(0.3).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-medium tracking-wider"
            style={{
              color: ensureContrast(accentColor, bgColor),
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const ProductLaunchTemplate: FestivalTemplate = {
  id: 'product-launch-promotion',
  name: 'Product Launch Promotion',
  coverImageUrl: '/images/business-covers/product-launch-cover.png',
  slides: [
    {
      title: 'New Product Launch',
      description: 'Discover our latest innovation!',
      date: '2025-06-10',
      imageUrl: '/images/business-backgrounds/product-bg.jpg',
      footer: 'Your Business Name',
      websiteUrl: 'https://yourbusiness.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FF4081'; // Pink
    const secondaryColor = '#64B5F6'; // Blue
    const accentColor = '#FFD700'; // Yellow
    const bgColor = '#FFFFFF'; // White
    const textColor = '#212121'; // Dark Grey

    const splashColors = ['#F44336', '#E91E63', '#2196F3', '#FFEB3B'];

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          backgroundColor: bgColor,
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
        }}
      >
        {/* Abstract Geometric Shapes */}
        {splashColors.map((color, index) => (
          <div
            key={index}
            className="absolute rounded-full blur-2xl opacity-60 animate-pulse"
            style={{
              backgroundColor: color,
              width: `${150 + index * 30}px`,
              height: `${150 + index * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%)`,
              animationDelay: `${Math.random() * 1.5}s`,
              zIndex: 0,
            }}
          />
        ))}

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-bold uppercase mb-6 tracking-wide"
            style={{
              color: ensureContrast(textColor, bgColor),
              textShadow: `3px 3px 0px ${primaryColor}`,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-medium max-w-3xl leading-relaxed"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor),
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Call to Action Button */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 px-8 py-4 rounded-full text-2xl font-semibold"
            style={{
              backgroundColor: primaryColor,
              color: ensureContrast(bgColor, primaryColor),
            }}
          >
            Learn More
          </a>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.2).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.5).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.2).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const WebinarInviteTemplate: FestivalTemplate = {
  id: 'webinar-invite',
  name: 'Webinar Invitation',
  coverImageUrl: '/images/business-covers/webinar-cover.png',
  slides: [
    {
      title: 'Exclusive Webinar',
      description: 'Join us to learn the latest industry trends!',
      date: '2025-06-10',
      imageUrl: '/images/business-backgrounds/webinar-bg.jpg',
      footer: 'Your Business Name',
      websiteUrl: 'https://yourbusiness.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#B71C1C'; // Dark Red
    const secondaryColor = '#FFD700'; // Gold
    const accentColor = '#FFFFFF'; // White
    const bgColor = '#1A0A0A'; // Very Dark Red/Brown
    const textColor = '#FFFFFF'; // White

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-end bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          backgroundColor: bgColor,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent opacity-70" />

        {/* Abstract Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-2xl opacity-30" style={{ backgroundColor: secondaryColor }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col p-16 pt-32 text-center items-center">
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="absolute top-16 right-16 w-40 h-20 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${secondaryColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-bold uppercase mb-6 tracking-wide"
            style={{
              color: ensureContrast(textColor, bgColor),
              textShadow: `0 0 15px ${secondaryColor}`,
              fontFamily: 'Roboto, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          argumentation <p
            className="text-3xl font-normal max-w-3xl leading-relaxed mb-12"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor),
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Calendar Icon */}
          <span className="text-9xl mt-12 mb-16" style={{ color: secondaryColor }}>📅</span>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.4).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.6).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.4).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const SalesPromotionTemplate: FestivalTemplate = {
  id: 'sales-promotion',
  name: 'Sales Promotion',
  coverImageUrl: '/images/business-covers/sales-cover.png',
  slides: [
    {
      title: 'Big Sale Event',
      description: 'Up to 50% off on all products!',
      date: '2025-06-10',
      imageUrl: '/images/business-backgrounds/sales-bg.jpg',
      footer: 'Your Business Name',
      websiteUrl: 'https://yourbusiness.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FF1493'; // Deep Pink
    const secondaryColor = '#FFD700'; // Yellow
    const accentColor = '#FFFFFF'; // White
    const bgColor = '#F5F5F5'; // Light Grey
    const textColor = '#000000'; // Black

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          backgroundColor: bgColor,
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
        }}
      >
        {/* Kite-like Background Shape */}
        <div
          className="absolute w-[600px] h-[600px] transform rotate-45"
          style={{
            backgroundColor: primaryColor,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            opacity: 0.8,
          }}
        />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${secondaryColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-bold uppercase mb-6 tracking-wide"
            style={{
              color: ensureContrast(accentColor, primaryColor),
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-medium max-w-3xl leading-relaxed"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), primaryColor),
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Call to Action Button */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 px-8 py-4 rounded-full text-2xl font-semibold"
            style={{
              backgroundColor: secondaryColor,
              color: ensureContrast(textColor, secondaryColor),
            }}
          >
            Shop Now
          </a>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.2).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.5).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(textColor, chroma(primaryColor).alpha(0.2).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const NetworkingEventTemplate: FestivalTemplate = {
  id: 'networking-event',
  name: 'Networking Event',
  coverImageUrl: '/images/business-covers/networking-cover.png',
  slides: [
    {
      title: 'Networking Night',
      description: 'Connect with industry leaders!',
      date: '2025-06-10',
      imageUrl: '/images/business-backgrounds/networking-bg.jpg',
      footer: 'Your Business Name',
      websiteUrl: 'https://yourbusiness.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#00FFFF'; // Cyan
    const secondaryColor = '#FF00FF'; // Magenta
    const accentColor = '#FFFFFF'; // White
    const bgColor = '#1C2526'; // Dark Teal
    const textColor = '#FFFFFF'; // White

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col justify-center items-center bg-cover bg-center overflow-hidden',
          { 'rounded-lg': graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          backgroundColor: bgColor,
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />

        {/* Neon Glows */}
        <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-50" style={{ backgroundColor: primaryColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-40" style={{ backgroundColor: secondaryColor }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: `drop-shadow(0 0 10px ${primaryColor})` }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-bold uppercase mb-6 tracking-wide"
            style={{
              color: primaryColor,
              textShadow: `0 0 15px ${secondaryColor}`,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-light max-w-3xl leading-relaxed mb-12"
            style={{
              color: ensureContrast(chroma(textColor).alpha(0.8).hex(), bgColor),
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
            }}
          >
            {slide.description}
          </p>

          {/* Handshake Icon */}
          <span className="text-9xl mt-12 mb-16" style={{ color: accentColor }}>🤝</span>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{
            backgroundColor: chroma(primaryColor).alpha(0.3).css(),
            borderTop: `2px solid ${chroma(secondaryColor).alpha(0.5).css()}`,
          }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: ensureContrast(accentColor, chroma(primaryColor).alpha(0.3).hex()) }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};


export const FestivalTemplates: FestivalTemplate[] = [
  // DiwaliTemplate,
  // ChristmasTemplate,
  HoliTemplate,
  // BaisakhiTemplate,
  // LohriTemplate,
  // DussehraTemplate,
  // RakshaBandhanTemplate,
  // KarwaChauthTemplate,
  // PunjabiSpiritTemplate,
  // BusinessEventTemplate,
  // ProductLaunchTemplate,
  // WebinarInviteTemplate,
  // SalesPromotionTemplate,
  // NetworkingEventTemplate,
  // EidTemplate,
  // LunarNewYearTemplate,
  // GradientGlowTemplate,
  // TypographicFocusTemplate,
  // NaturesHarmonyTemplate,
  // ModernAbstractTemplate,
  // BoldStatementTemplate,
];
