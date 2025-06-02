import chroma from "chroma-js";
import cn from 'classnames';

export interface ThanksMessageSlide {
  title: string;
  eventName: string;
  imageUrl?: string;
  footer: string;
  websiteUrl: string;
  highlight: string;
  ctaText: string;
  eventDetails?: {
    date: string;
    
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

export interface ThanksMessageTemplate {
  id: string;
  name: string;
  slides: ThanksMessageSlide[];
  renderSlide: (slide: ThanksMessageSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
}  


// Template 42: Thank You - Warm Gold with Confetti
export const ThanksMessageTemplate1: ThanksMessageTemplate = {
  id: 'thank-you-gold-confetti',
  name: 'Thank You Gold Confetti',
  coverImageUrl: '/images/image-cover/thank-you-gold-confetti.png',
  slides: [
    {
      title: 'THANK YOU FOR JOINING US!',
      eventName: 'AI in 2025: Live Webinar',
      eventDetails: {
        date: 'May 29, 2025',
      },
      highlight: 'Over 500 Attendees!',
      ctaText: 'Follow Us for More Events',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FFB300').hex(); // Warm Gold
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FFF8E1').hex(); // Light Amber

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
        {/* Confetti Background */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1080 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="10" fill={usePrimary} opacity="0.5" />
          <circle cx="980" cy="200" r="8" fill={usePrimary} opacity="0.5" />
          <rect x="150" y="800" width="15" height="15" fill={usePrimary} opacity="0.5" transform="rotate(45 150 800)" />
          <rect x="900" y="600" width="12" height="12" fill={usePrimary} opacity="0.5" transform="rotate(45 900 600)" />
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
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.highlight}
          </p>
          <p className="text-lg text-center">We’re so grateful for your participation!</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
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

// Template 43: Thank You - Pastel Pink with Hearts
export const ThanksMessageTemplate2: ThanksMessageTemplate = {
  id: 'thank-you-pink-hearts',
  name: 'Thank You Pink Hearts',
  coverImageUrl: '/images/image-cover/thank-you-pink-hearts.png',
  slides: [
    {
      title: 'WE’RE GRATEFUL FOR YOU!',
      eventName: 'Product Launch Live Stream',
      eventDetails: {
        date: 'May 29, 2025',
      },
      highlight: 'A Huge Success!',
      ctaText: 'Join Our Newsletter',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#F06292').hex(); // Pastel Pink
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FCE4EC').hex(); // Light Pink

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
        {/* Hearts Background */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1080 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 80 C80 40, 120 40, 100 80 C80 120, 60 80, 100 80"
            fill={usePrimary}
            opacity="0.3"
          />
          <path
            d="M980 150 C960 110, 1000 110, 980 150 C960 190, 940 150, 980 150"
            fill={usePrimary}
            opacity="0.3"
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
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.highlight}
          </p>
          <p className="text-lg text-center">Your support means the world to us!</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
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

// Template 44: Thank You - Teal with Wave Pattern
export const ThanksMessageTemplate3: ThanksMessageTemplate = {
  id: 'thank-you-teal-wave',
  name: 'Thank You Teal Wave',
  coverImageUrl: '/images/image-cover/thank-you-teal-wave.png',
  slides: [
    {
      title: 'THANK YOU FOR BEING WITH US!',
      eventName: 'Sustainability Talk: Live',
      eventDetails: {
        date: 'May 29, 2025',
      },
      highlight: 'Inspiring Discussions!',
      ctaText: 'Stay Connected',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#26A69A').hex(); // Teal
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#E0F2F1').hex(); // Light Teal

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
        {/* Wave Pattern */}
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
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.highlight}
          </p>
          <p className="text-lg text-center">We hope to see you at our next event!</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
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

// Template 45: Thank You - Dark Gradient with Purple Accents
export const ThanksMessageTemplate4: ThanksMessageTemplate = {
  id: 'thank-you-dark-gradient',
  name: 'Thank You Dark Gradient',
  coverImageUrl: '/images/image-cover/thank-you-dark-gradient.png',
  slides: [
    {
      title: 'A BIG THANK YOU!',
      eventName: 'Gaming Tournament Stream',
      eventDetails: {
        date: 'May 29, 2025',
      },
      highlight: 'Epic Moments!',
      ctaText: 'Follow for Updates',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#AB47BC').hex(); // Purple
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White
    const bgGradient = `linear-gradient(135deg, ${chroma('#212121').hex()} 0%, ${chroma('#424242').hex()} 100%)`;

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
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.highlight}
          </p>
          <p className="text-lg text-center">Thanks for making it unforgettable!</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
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

// Template 46: Thank You - Minimalist Blue with Icon
export const ThanksMessageTemplate5: ThanksMessageTemplate = {
  id: 'thank-you-minimalist-blue',
  name: 'Thank You Minimalist Blue',
  coverImageUrl: '/images/image-cover/thank-you-minimalist-blue.png',
  slides: [
    {
      title: 'THANK YOU FOR ATTENDING!',
      eventName: 'Ask Me Anything: Tech Edition',
      eventDetails: {
        date: 'May 29, 2025',
      },
      highlight: 'Great Questions!',
      ctaText: 'See You Next Time',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#0288D1').hex(); // Blue
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
        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header with Heart Icon */}
        <div className="text-center pt-12">
          <div className="flex justify-center items-center mb-2">
            <svg
              className="w-8 h-8 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C12 21 3 15 3 9C3 3 9 3 12 6C15 3 21 3 21 9C21 15 12 21 12 21Z"
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
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.highlight}
          </p>
          <p className="text-lg text-center">We appreciate your support!</p>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
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
export const ThanksMessageTemplates: ThanksMessageTemplate[] = [
    ThanksMessageTemplate1,
    ThanksMessageTemplate2,
    ThanksMessageTemplate3,
    ThanksMessageTemplate4,
    ThanksMessageTemplate5,
];