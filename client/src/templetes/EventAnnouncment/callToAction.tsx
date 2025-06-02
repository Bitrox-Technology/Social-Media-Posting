import chroma from "chroma-js";
import cn from 'classnames';

export interface CallToActionSlide {
  title: string;
  eventName: string;
  imageUrl?: string;
  footer: string;
  websiteUrl: string;
    ctaText: string;
  eventDetails?: {
    date: string;
    time: string;
    location: string;
  };
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

export interface CallToActionTemplate {
  id: string;
  name: string;
  slides: CallToActionSlide[];
  renderSlide: (slide: CallToActionSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
} 
// Template 47: CTA - Bold Red with Arrow
export const CallToActionTemplate1: CallToActionTemplate = {
  id: 'cta-bold-red-arrow',
  name: 'CTA Bold Red Arrow',
  coverImageUrl: '/images/image-cover/cta-bold-red-arrow.png',
  slides: [
    {
      title: 'DON’T MISS OUT!',
      eventName: 'AI Summit 2025',
      eventDetails: {
        date: 'June 1, 2025',
        time: '10:00 AM IST',
        location: 'Virtual Event',
      },
      ctaText: 'Register Now',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#D32F2F').hex(); // Bold Red
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FFEBEE').hex(); // Light Red

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Arrow Background */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1080 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 1080 L300 780 L200 780 L200 0 L0 0 Z"
            fill={usePrimary}
            opacity="0.2"
          />
          <path
            d="M1080 0 L780 300 L880 300 L880 1080 L1080 1080 Z"
            fill={usePrimary}
            opacity="0.2"
          />
        </svg>

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
          <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-bold shadow-lg"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            {slide.ctaText}
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm"
            style={{ color: textColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Template 48: CTA - Energetic Orange with Stars
export const CallToActionTemplate2: CallToActionTemplate = {
  id: 'cta-orange-stars',
  name: 'CTA Orange Stars',
  coverImageUrl: '/images/image-cover/cta-orange-stars.png',
  slides: [
    {
      title: 'JOIN US LIVE!',
      eventName: 'Product Launch 2025',
      eventDetails: {
        date: 'June 5, 2025',
        time: '2:00 PM IST',
        location: 'Zoom',
      },
      ctaText: 'Join Now',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FF9800').hex(); // Energetic Orange
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FFF3E0').hex(); // Light Orange

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Stars Background */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1080 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 100 L110 80 L120 100 L110 120 Z"
            fill={usePrimary}
            opacity="0.5"
          />
          <path
            d="M980 150 L990 130 L1000 150 L990 170 Z"
            fill={usePrimary}
            opacity="0.5"
          />
          <path
            d="M500 800 L510 780 L520 800 L510 820 Z"
            fill={usePrimary}
            opacity="0.5"
          />
        </svg>

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
          <p className="text-lg font-semibold">Platform: {slide.eventDetails?.location}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-bold shadow-lg"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            {slide.ctaText}
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm"
            style={{ color: textColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Template 49: CTA - Cool Blue with Wave
export const CallToActionTemplate3: CallToActionTemplate = {
  id: 'cta-blue-wave',
  name: 'CTA Blue Wave',
  coverImageUrl: '/images/image-cover/cta-blue-wave.png',
  slides: [
    {
      title: 'SAVE YOUR SPOT!',
      eventName: 'Tech Workshop 2025',
      eventDetails: {
        date: 'June 10, 2025',
        time: '11:00 AM IST',
        location: 'Mumbai Convention Center',
      },
      ctaText: 'Reserve Now',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#0288D1').hex(); // Cool Blue
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#E1F5FE').hex(); // Light Blue

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Wave Background */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1080 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0C0 0 240 200 540 200C840 200 1080 0 1080 0V200H0Z"
            fill={usePrimary}
            fillOpacity="0.1"
          />
        </svg>

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
          <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-bold shadow-lg"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            {slide.ctaText}
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm"
            style={{ color: textColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Template 50: CTA - Gradient Purple with Glow
export const CallToActionTemplate4: CallToActionTemplate = {
  id: 'cta-gradient-purple',
  name: 'CTA Gradient Purple',
  coverImageUrl: '/images/image-cover/cta-gradient-purple.png',
  slides: [
    {
      title: 'BE PART OF IT!',
      eventName: 'Gaming Expo 2025',
      eventDetails: {
        date: 'June 15, 2025',
        time: '1:00 PM IST',
        location: 'Online Stream',
      },
      ctaText: 'Sign Up Today',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#AB47BC').hex(); // Purple
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White
    const bgGradient = `linear-gradient(135deg, ${chroma('#4A148C').hex()} 0%, ${chroma('#AB47BC').hex()} 100%)`;

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          background: bgGradient,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Glow Effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`,
          }}
        />

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: secondaryColor }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
          <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-bold shadow-lg"
            style={{ backgroundColor: secondaryColor, color: usePrimary }}
          >
            {slide.ctaText}
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm"
            style={{ color: secondaryColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Template 51: CTA - Minimalist Green with Icon
export const CallToActionTemplate5: CallToActionTemplate = {
  id: 'cta-minimalist-green',
  name: 'CTA Minimalist Green',
  coverImageUrl: '/images/image-cover/cta-minimalist-green.png',
  slides: [
    {
      title: 'GET READY!',
      eventName: 'Sustainability Talk 2025',
      eventDetails: {
        date: 'June 20, 2025',
        time: '3:00 PM IST',
        location: 'Online Webinar',
      },
      ctaText: 'Join the Talk',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#4CAF50').hex(); // Green
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#E8F5E9').hex(); // Light Green

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          backgroundColor: bgColor,
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header with Icon */}
        <div className="text-center pt-12">
          <div className="flex justify-center items-center mb-2">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2 L15 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L9 9 Z"
                fill={usePrimary}
              />
            </svg>
            <h2 className="text-5xl font-bold" style={{ color: usePrimary }}>
              {slide.title}
            </h2>
          </div>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
          <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-bold shadow-lg"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            {slide.ctaText}
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-sm"
            style={{ color: textColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Export all templates in an array
export const CallToActionTemplates: CallToActionTemplate[] = [
    CallToActionTemplate1,
    CallToActionTemplate2,
    CallToActionTemplate3,
    CallToActionTemplate4,
    CallToActionTemplate5,
];