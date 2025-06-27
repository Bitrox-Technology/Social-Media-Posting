import chroma from "chroma-js";
import cn from 'classnames';
import { blendColors, ensureContrast } from "../Utilities/colorContraxt";
import { checkLogoContrast } from "../Utilities/colorExtractor";


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


// 1. Updated Diwali Template - Aligned with New Aesthetic
export const DiwaliGlowTemplate: FestivalTemplate = {
  id: 'diwali-glow-elegance',
  name: 'Diwali - Glow Elegance',
  coverImageUrl: '/images/festival-covers/diwali-cover.png',
  slides: [
    {
      title: 'Happy Diwali',
      description: 'Illuminate your life with the light of joy and prosperity! Celebrate the festival of lights with us.',
      date: '2026-11-08', // Diwali 2026 (future date)
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide: FestivalSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => {
    console.log("Colors on template: ", colors)
    const bgColor = chroma('#f5f5f5').hex();

    let c1 = blendColors('#000000', bgColor);
    let c2 = blendColors('#ffffff', bgColor);

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex', {
          'rounded-lg overflow-hidden': colors.graphicStyle.borderRadius !== '0px',
        })}
        style={{
          fontFamily: colors.typography.fontFamily,
          backgroundColor: bgColor,
        }}
      >
        {/* Left Panel - Image with Glow Overlay */}
        <div
          className="w-1/2 h-full relative"
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute inset-0"
          />
        </div>

        {/* Right Panel - Content */}
        <div
          className="w-1/2 h-full flex flex-col justify-center p-16"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {/* Logo in Top-Right */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
            </div>
          )}

          {/* Title */}
          <h2
            className="text-5xl font-bold mb-6 "
            style={{
              color: textColor.suggestedTextColor,
              fontFamily: colors.typography.fontFamily,
              marginTop: '20rem'
            }}
          >
            {slide.title}
          </h2>

          {/* Accent Line */}
          <div
            className="w-24 h-1 mb-8"
            style={{
              backgroundColor: textColor.suggestedTextColor,
              fontFamily: colors.typography.fontFamily,
            }}
          />

          {/* Description */}
          <p
            className="text-xl leading-relaxed mb-6"
            style={{
              color: textColor.suggestedTextColor,
              fontFamily: colors.typography.fontFamily,
            }}
          >
            {slide.description}
          </p>

          {/* Date */}
          <p
            className="text-lg font-medium mb-8"
            style={{
              color: textColor.suggestedTextColor,
              fontFamily: colors.typography.fontFamily,
            }}
          >
            Date: {slide.date}
          </p>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center">
            <span
              className="text-lg"
              style={{
                color: textColor.suggestedTextColor,
                fontFamily: colors.typography.fontFamily,
              }}
            >
              @{slide.footer}
            </span>
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:underline"
              style={{
                color: textColor.suggestedTextColor,
                fontFamily: colors.typography.fontFamily,
              }}
            >
              {slide.websiteUrl}
            </a>
          </div>
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
    const bgColor = '#F5F5DC'; // Khaki / Light Beige


    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn(
          'relative w-[1080px] h-[1080px] flex flex-col bg-cover bg-center overflow-hidden',
          { 'rounded-lg': colors.graphicStyle.borderRadius !== '0px' }
        )}
        style={{
          backgroundImage: `url(${slide.imageUrl})`,
          backgroundSize: 'cover',
          fontFamily: colors.typography.fontFamily,
          fontWeight: colors.typography.fontWeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Dynamic gradient overlay based on image presence */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(180deg, ${chroma(colors.logoColors.secondary).alpha(0.3).css()} 0%, ${chroma(colors.logoColors.primary).alpha(0.2).css()} 100%)`,
          mixBlendMode: 'multiply',
          opacity: 0.8
        }} />
        <div className="absolute inset-0" style={{ backgroundColor: chroma(bgColor).alpha(0.3).css() }} />

        {/* Abstract Wheat/Folk elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400 rounded-full opacity-30 blur-2xl" />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500 rounded-full opacity-30 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-24 h-24 transform rotate-45" style={{ backgroundColor: colors.logoColors.primary, opacity: 0.4, borderRadius: colors.graphicStyle.borderRadius }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col flex-1 p-16 justify-between items-center text-center">
          {/* Logo */}
          {addLogo && (
            <div className="w-full flex justify-end">
              <img
                src={defaultLogoUrl}
                alt="Logo"
                className="w-48 h-24 object-contain mb-12"

              />
            </div>
          )}

          {/* Main Title & Description */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <h2
              className="text-8xl font-extrabold uppercase mb-6 tracking-tight"
              style={{
                color: textColor.suggestedTextColor,
                fontFamily: colors.typography.fontFamily,
              }}

            >
              {slide.title}
            </h2>
            <p
              className="text-3xl font-medium max-w-3xl leading-relaxed"
              style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
            >
              {slide.description}
            </p>
          </div>

          {/* Decorative Harvest Line */}
          <div className="flex items-center space-x-6 mt-16">
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: colors.logoColors.primary }} />
            <span className="text-4xl" style={{ color: colors.logoColors.secondary }}>🌾</span> {/* Wheat ear unicode */}
            <span className="text-4xl" style={{ color: colors.logoColors.accent[0] }}>💃</span> {/* Dancing person unicode */}
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: colors.logoColors.primary }} />
          </div>

          {/* Footer */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider mt-12"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.title}
          </h2>
          <p
            className="text-3xl font-normal max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
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
            style={{ color: textColor.suggestedTextColor }}
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

    const bgColor = chroma('#f5f5f5').hex(); // Light gray for the overall background
    // let textColor = chroma('#1b263b').hex(); // Navy blue for footer text

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


    let c1 = blendColors('#000000', bgColor[0]);
    let c2 = blendColors('#ffffff', bgColor[1]);

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex', {
          'rounded-lg': colors.graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: colors.typography.fontFamily,
          color: textColor.suggestedTextColor,
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

          />
        </div>

        {/* Right Side: Content */}
        <div
          className="w-1/2 h-full flex flex-col justify-center items-start p-20"
          style={{ backgroundColor: bgColor }}
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
            style={{ color: textColor.suggestedTextColor, maxWidth: '90%', textAlign: 'left', fontFamily: colors.typography.fontFamily, }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-xl leading-relaxed mb-4"
            style={{ color: textColor.suggestedTextColor, maxWidth: '85%', textAlign: 'left', fontFamily: colors.typography.fontFamily, }}
          >
            {slide.description}
          </p>

          {/* Date */}
          <p
            className="text-lg font-medium mb-4"
            style={{ color: textColor.suggestedTextColor, textAlign: 'left', fontFamily: colors.typography.fontFamily, }}
          >
            On the Date: {slide.date}
          </p>

          {/* Days Remaining */}
          <p
            className="text-lg font-medium mb-8"
            style={{ color: textColor.suggestedTextColor, textAlign: 'left', fontFamily: colors.typography.fontFamily, }}
          >
            Celebrate with us!
          </p>

          {/* Call-to-Action Button */}

        </div>

        {/* Bottom Section: Website URL and Footer */}
        <div className="absolute bottom-8 w-full flex justify-between items-center z-10 px-12">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-medium tracking-wide hover:underline"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
          >
            {slide.websiteUrl}
          </a>
          <p
            className="text-xl font-medium tracking-wide"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.title}
          </h2>
          <p
            className="text-3xl font-normal max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
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
            style={{ color: textColor.suggestedTextColor }}
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
  id: 'raksha-bandhan-sacred-thread',
  name: 'Raksha Bandhan - Sacred Thread',
  coverImageUrl: '/images/festival-covers/rakhi-cover.png',
  slides: [
    {
      title: 'Happy Rakhi',
      description: 'Celebrating the unbreakable bond of love between siblings!',
      date: '2025-08-15', // Approximate Rakhi date in 2025
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg',// Example: Rakhi thread and hands background
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FF69B4'; // Hot Pink (for Rakhi)
    const secondaryColor = '#FFD700'; // Gold (for thread)
    const accentColor = '#FFFFFF'; // White (for purity)
    const bgColor = '#F8EDEB'; // Light Pink
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
        {/* Subtle overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-50" />

        {/* Thread-like elements */}
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-yellow-300 blur-2xl opacity-40" style={{ backgroundColor: secondaryColor }} />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-pink-400 blur-2xl opacity-30" style={{ backgroundColor: primaryColor }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: 'drop-shadow(0 0 5px white)' }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-extrabold uppercase mb-6 tracking-wide"
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-light max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.description}
          </p>

          {/* Decorative Thread */}
          <div className="flex items-center space-x-6 mb-12">
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span className="text-5xl" style={{ color: primaryColor }}>💞</span> {/* Heart unicode */}
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{ backgroundColor: chroma(bgColor).alpha(0.7).css() }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-light max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
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
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-medium max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
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
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
              color: textColor.suggestedTextColor,
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-4xl font-medium max-w-3xl leading-relaxed"
            style={{
              color: textColor.suggestedTextColor,
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
              color: textColor.suggestedTextColor,
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
            style={{ color: textColor.suggestedTextColor }}
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
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
              color: textColor.suggestedTextColor,
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
            style={{ color: textColor.suggestedTextColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// export const DoYouKnowTemplate2: DoYouKnowTemplate = {
//   id: 'do-you-know-modern-split',
//   name: 'Modern Split',
//   coverImageUrl: '/images/doyouknow-cover/cover2.png',
//   slides: [
//     {
//       title: 'DO YOU KNOW?',
//       fact: 'Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.',
//       imageUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924',
//       footer: 'bitrox.tech',
//       websiteUrl: 'https://bitrox.tech',
//       slideNumber: 1,
//     },
//   ],
//   renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
//     const {
//       logoColors,
//       glowColor,
//       complementaryTextColor,
//       ensureContrast,
//       vibrantAccentColor,
//       backgroundColor,
//       typography,
//       graphicStyle,
//     } = colors;

//     // Color setup
//     const primaryColor = logoColors.primary;
//     const accentColor = vibrantAccentColor;
//     const bgColor = backgroundColor;
//     const textColor = ensureContrast(complementaryTextColor, bgColor);

//     const hasImage = !!slide.imageUrl && slide.imageUrl !== 'https://via.placeholder.com/1080';
//     const isLongFact = slide.fact.length > 120;

//     return (
//       <div
//         className={cn('relative w-[1080px] h-[1080px] flex', {
//           'rounded-lg overflow-hidden': graphicStyle.borderRadius !== '0px',
//         })}
//         style={{
//           fontFamily: typography.fontFamily,
//           backgroundColor: chroma(bgColor).darken(0.5).hex(),
//         }}
//       >
//         {/* Left Panel - Image or Color */}
//         <div 
//           className="w-1/2 h-full relative"
//           style={{
//             backgroundImage:  `linear-gradient(135deg, ${primaryColor} 0%, ${chroma(primaryColor).brighten(1).hex()} 100%)`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         >
//           {/* Subtle overlay for better text contrast */}
//           <div 
//             className="absolute inset-0"
//             style={{
//               backgroundColor: hasImage ? chroma(bgColor).alpha(0.2).css() : 'transparent',
//             }}
//           />

//           {/* Slide Number */}
//           <div 
//             className="absolute top-8 left-8 w-16 h-16 flex items-center justify-center rounded-full"
//             style={{
//               backgroundColor: chroma(accentColor).alpha(0.9).css(),
//               boxShadow: `0 4px 12px ${chroma(accentColor).alpha(0.5).css()}`,
//             }}
//           >
//             <span 
//               className="text-3xl font-bold"
//               style={{
//                 color: ensureContrast('#FFFFFF', accentColor),
//               }}
//             >
//               {slide.slideNumber}
//             </span>
//           </div>


//         </div>

//         {/* Right Panel - Content */}
//         <div 
//           className="w-1/2 h-full flex flex-col justify-center p-16"
//           style={{
//             backgroundColor: chroma(bgColor).hex(),
//           }}
//         >
//           {/* Question Mark Icon */}
//           <div 
//             className="w-16 h-16 mb-8 flex items-center justify-center rounded-full"
//             style={{
//               backgroundColor: chroma(accentColor).alpha(0.15).css(),
//             }}
//           >
//             <span 
//               className="text-3xl font-bold"
//               style={{
//                 color: accentColor,
//               }}
//             >
//               ?
//             </span>
//           </div>

//            {addLogo && (
//             <div className="absolute top-8 right-8 z-20">
//               <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
//             </div>
//           )}

//           {/* Title */}
//           <h2
//             className="text-4xl font-bold mb-8"
//             style={{
//               color: chroma(textColor).alpha(0.5).css(),
//             }}
//           >
//             {slide.title}
//           </h2>

//           {/* Accent Line */}
//           <div 
//             className="w-24 h-1 mb-8"
//             style={{
//               backgroundColor: accentColor,
//             }}
//           />

//           {/* Fact */}
//           <p
//             className={cn('leading-relaxed mb-12', {
//               'text-2xl': !isLongFact,
//               'text-xl': isLongFact,
//             })}
//             style={{
//               color: chroma(textColor).alpha(0.9).css(),
//             }}
//           >
//             {slide.fact}
//           </p>

//           {/* Footer */}
//           <div className="mt-auto flex justify-between items-center">
//             <span
//               className="text-lg"
//               style={{
//                 color: chroma(textColor).alpha(0.6).css(),
//               }}
//             >
//               @{slide.footer}
//             </span>

//             <a
//               href={slide.websiteUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-lg"
//               style={{
//                 color: accentColor,
//               }}
//             >
//               {slide.websiteUrl}
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   },
// };


export const EidTemplate: FestivalTemplate = {
  id: 'eid-crescent-glow',
  name: 'Eid - Crescent Glow',
  coverImageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg',
  slides: [
    {
      title: 'Eid Mubarak',
      description: 'Wishing you peace, joy, and prosperity on this blessed occasion!',
      date: '2025-06-30', // Approximate Eid date in 2025
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg', // Example: a crescent moon and mosque background
      footer: 'Ludhiana Celebrates',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { typography, graphicStyle } = colors;

    const primaryColor = '#FFD700'; // Gold (for moon glow)
    const secondaryColor = '#4A2C2A'; // Dark Red (for richness)
    const accentColor = '#FFFFFF'; // White (for purity)
    const bgColor = '#1C2520'; // Dark Teal
    let c1 = blendColors('#000000', colors.imageColors[0]);
    let c2 = blendColors('#ffffff', colors.imageColors[1]);

    console.log("C1: ", c1, " C2: ", c2)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

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
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Crescent Moon Glow */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-yellow-300 blur-3xl opacity-40" style={{ backgroundColor: primaryColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-red-800 blur-2xl opacity-30" style={{ backgroundColor: secondaryColor }} />

        {/* Content Section */}
        <div className="relative z-10 flex flex-col items-center text-center p-16">
          {/* Logo */}
          {addLogo && (
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="mb-12 w-48 h-24 object-contain"
              style={{ filter: 'brightness(1.5)' }}
            />
          )}

          {/* Title */}
          <h2
            className="text-8xl font-extrabold uppercase mb-6 tracking-wide"
            style={{ color: textColor.suggestedTextColor, textShadow: `0 0 15px ${chroma(primaryColor).alpha(0.6).css()}` }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-3xl font-light max-w-3xl leading-relaxed mb-12"
            style={{ color: textColor.suggestedTextColor }}
          >
            {slide.description}
          </p>

          {/* Decorative Crescent */}
          <div className="flex items-center space-x-6 mb-12">
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            <span className="text-5xl" style={{ color: accentColor }}>🌙</span> {/* Crescent moon unicode */}
            <div className="w-24 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative z-10 w-full p-8 text-center"
          style={{ backgroundColor: chroma(bgColor).alpha(0.6).css() }}
        >
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-semibold tracking-wider"
            style={{ color: textColor.suggestedTextColor }}
          >
            @{slide.footer}
          </a>
        </div>
      </div>
    );
  },
};


export const ChristmasCheerTemplate: FestivalTemplate = {
  id: 'christmas-cheer-modern',
  name: 'Christmas - Cheer Modern',
  coverImageUrl: '/images/festival-covers/christmas-cover.png',
  slides: [
    {
      title: 'Merry Christmas',
      description: 'Spread joy and warmth this holiday season! Join us for a festive celebration filled with love and cheer.',
      date: '2025-12-25', // Christmas 2025
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1750150785/festival_images/festival_image_1750150783593.jpg',
      footer: 'bitrox.tech',
      websiteUrl: 'https://bitrox.tech',
    },
  ],
  renderSlide: (slide: FestivalSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => {
    console.log("Colors: ", colors)
    const bgColor = chroma('#f5f5f5').hex();

    let c1 = blendColors('#000000', bgColor);
    let c2 = blendColors('#ffffff', bgColor);

    let imageContast = checkLogoContrast(colors.imageColors, colors.logoColors.primary, colors.glowColor)
    console.log("image contast", imageContast)

    let textColor = ensureContrast(c1, c2)
    console.log("Text Color", textColor)

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg overflow-hidden': colors.graphicStyle.borderRadius !== '0px',
        })}
        style={{
          fontFamily: colors.typography.fontFamily,
          backgroundColor: bgColor,
        }}
      >
        {/* Top Section - Image */}
        <div
          className="w-full h-1/2 relative"
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: imageContast.needsEnhancement ? imageContast.suggestedGradient : 'none',
            }}
          />
          {/* Logo in Top-Right */}
          {addLogo && (
            <div className="absolute top-8 right-8 z-20">
              <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" style={{
                background: imageContast.needsEnhancement ? imageContast.suggestedLogoEffect.background : 'none',
                // border: imageContast.needsEnhancement ? imageContast.suggestedLogoEffect.border : 'none',
                // boxShadow: imageContast.needsEnhancement ? imageContast.suggestedLogoEffect.shadow : 'none'
              }} />
            </div>
          )}
        </div>

        {/* Bottom Section - Content */}
        <div
          className="w-full h-1/2 flex flex-col justify-center p-16"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {/* Title */}
          <h2
            className="text-5xl font-bold mb-6"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
          >
            {slide.title}
          </h2>

          {/* Description */}
          <p
            className="text-xl leading-relaxed mb-6"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
          >
            {slide.description}
          </p>

          {/* Date */}
          <p
            className="text-lg font-medium mb-8"
            style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
          >
            Date: {slide.date}
          </p>

          {/* Footer */}
          <div className="mt-auto flex justify-between items-center">
            <span
              className="text-lg"
              style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
            >
              @{slide.footer}
            </span>
            <a
              href={slide.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:underline"
              style={{ color: textColor.suggestedTextColor, fontFamily: colors.typography.fontFamily, }}
            >
              {slide.websiteUrl}
            </a>
          </div>
        </div>
      </div>
    );
  },
};

export const FestivalTemplates: FestivalTemplate[] = [
  DiwaliGlowTemplate,
  ChristmasCheerTemplate,
  HoliTemplate,
  // BaisakhiTemplate,
  // LohriTemplate,
  // DussehraTemplate,
  // RakshaBandhanTemplate,
  // EidTemplate,
  // ChristmasTemplate
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
