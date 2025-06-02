import chroma from "chroma-js";
import cn from 'classnames';

export interface KeyMomentSlide {
  title: string;
  eventName: string;
  imageUrl?: string;
  footer: string;
  websiteUrl: string;
    photos?: string[]; 
    ctaText: string;
  eventDetails?: {
    date: string;
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

export interface KeyMomentTemplate {
  id: string;
  name: string;
  slides: KeyMomentSlide[];
  renderSlide: (slide: KeyMomentSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
} 

// Template 52: After Event - Photo Collage with Confetti
export const KeyMomentTemplate1: KeyMomentTemplate = {
  id: 'after-event-photo-collage',
  name: 'After Event Photo Collage',
  coverImageUrl: '/images/image-cover/after-event-photo-collage.png',
  slides: [
    {
      title: 'RELIVE THE MAGIC!',
      eventName: 'AI Summit 2025',
      eventDetails: {
        date: 'May 25, 2025',
        location: 'Virtual Event',
      },
      photos: [
        'https://via.placeholder.com/300x300.png?text=Photo+1',
        'https://via.placeholder.com/300x300.png?text=Photo+2',
        'https://via.placeholder.com/300x300.png?text=Photo+3',
        'https://via.placeholder.com/300x300.png?text=Photo+4',
      ],
      ctaText: 'See More Photos',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FFD700').hex(); // Gold
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FFF8E1').hex(); // Light Gold

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
          <rect x="100" y="50" width="10" height="30" fill={usePrimary} opacity="0.5" transform="rotate(45 100 50)" />
          <rect x="900" y="150" width="10" height="30" fill={usePrimary} opacity="0.5" transform="rotate(-45 900 150)" />
          <rect x="200" y="800" width="10" height="30" fill={usePrimary} opacity="0.5" transform="rotate(30 200 800)" />
          <rect x="850" y="700" width="10" height="30" fill={usePrimary} opacity="0.5" transform="rotate(-30 850 700)" />
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
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">{slide.eventDetails?.location}</p>
        </div>

        {/* Photo Collage */}
        <div className="flex-1 flex items-center justify-center px-12 py-8">
          <div className="grid grid-cols-2 gap-4">
            {slide.photos?.map((photo, index) => (
              <div
                key={index}
                className="relative w-[400px] h-[400px] rounded-lg overflow-hidden shadow-lg"
                style={{
                  transform: `rotate(${index % 2 === 0 ? '-5deg' : '5deg'})`,
                }}
              >
                <img
                  src={photo}
                  alt={`Event Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
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

// Template 53: After Event - Album Style with Border
export const KeyMomentTemplate2: KeyMomentTemplate = {
  id: 'after-event-album-style',
  name: 'After Event Album Style',
  coverImageUrl: '/images/image-cover/after-event-album-style.png',
  slides: [
    {
      title: 'EVENT HIGHLIGHTS',
      eventName: 'Product Launch 2025',
      eventDetails: {
        date: 'May 20, 2025',
        location: 'Mumbai Convention Center',
      },
      photos: [
        'https://via.placeholder.com/600x400.png?text=Photo+1',
        'https://via.placeholder.com/600x400.png?text=Photo+2',
      ],
      ctaText: 'View Full Album',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#8E24AA').hex(); // Purple
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#F3E5F5').hex(); // Light Purple

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
        {/* Border Effect */}
        <div
          className="absolute inset-0"
          style={{
            border: `10px solid ${usePrimary}`,
            borderRadius: graphicStyle.borderRadius,
            opacity: 0.3,
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
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">{slide.eventDetails?.location}</p>
        </div>

        {/* Album Layout */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 py-8 space-y-4">
          {slide.photos?.map((photo, index) => (
            <div
              key={index}
              className="relative w-[800px] h-[300px] rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={photo}
                alt={`Event Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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

// Template 54: After Event - Single Highlight Moment
export const KeyMomentTemplate3: KeyMomentTemplate = {
  id: 'after-event-highlight-moment',
  name: 'After Event Highlight Moment',
  coverImageUrl: '/images/image-cover/after-event-highlight-moment.png',
  slides: [
    {
      title: 'A MOMENT TO REMEMBER',
      eventName: 'Tech Workshop 2025',
      eventDetails: {
        date: 'May 22, 2025',
        location: 'Bangalore Tech Hub',
      },
      photos: ['https://via.placeholder.com/700x700.png?text=Highlight+Moment'],
      ctaText: 'See More Moments',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FF5722').hex(); // Deep Orange
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#FFECB3').hex(); // Light Amber

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

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">{slide.eventDetails?.location}</p>
        </div>

        {/* Highlight Photo */}
        <div className="flex-1 flex items-center justify-center px-12 py-8">
          <div className="relative w-[700px] h-[700px] rounded-full overflow-hidden shadow-lg border-8 border-white">
            <img
              src={slide.photos?.[0]}
              alt="Highlight Moment"
              className="w-full h-full object-cover"
            />
          </div>
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

// Template 55: After Event - Polaroid Style Collage
export const KeyMomentTemplate4: KeyMomentTemplate = {
  id: 'after-event-polaroid-collage',
  name: 'After Event Polaroid Collage',
  coverImageUrl: '/images/image-cover/after-event-polaroid-collage.png',
  slides: [
    {
      title: 'MEMORIES CAPTURED',
      eventName: 'Gaming Expo 2025',
      eventDetails: {
        date: 'May 15, 2025',
        location: 'Online Stream',
      },
      photos: [
        'https://via.placeholder.com/300x300.png?text=Photo+1',
        'https://via.placeholder.com/300x300.png?text=Photo+2',
        'https://via.placeholder.com/300x300.png?text=Photo+3',
      ],
      ctaText: 'Explore More',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#1976D2').hex(); // Blue
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#000000').hex(); // Black
    const bgColor = chroma('#E3F2FD').hex(); // Light Blue

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

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">{slide.eventDetails?.location}</p>
        </div>

        {/* Polaroid Collage */}
        <div className="flex-1 flex items-center justify-center px-12 py-8">
          <div className="flex flex-wrap justify-center gap-8">
            {slide.photos?.map((photo, index) => (
              <div
                key={index}
                className="relative w-[300px] h-[350px] bg-white shadow-lg"
                style={{
                  transform: `rotate(${index * 5 - 5}deg)`,
                }}
              >
                <img
                  src={photo}
                  alt={`Event Photo ${index + 1}`}
                  className="w-[280px] h-[280px] object-cover m-2"
                />
                <div className="text-center text-sm font-handwritten">Moment #{index + 1}</div>
              </div>
            ))}
          </div>
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

// Template 56: After Event - Memory Reel Summary
export const KeyMomentTemplate5: KeyMomentTemplate = {
  id: 'after-event-memory-reel',
  name: 'After Event Memory Reel',
  coverImageUrl: '/images/image-cover/after-event-memory-reel.png',
  slides: [
    {
      title: 'THANKS FOR THE MEMORIES!',
      eventName: 'Sustainability Talk 2025',
      eventDetails: {
        date: 'May 18, 2025',
        location: 'Online Webinar',
      },
      
      photos: ['https://via.placeholder.com/500x300.png?text=Highlight+Photo'],
      ctaText: 'Join Us Next Time',
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

        {/* Header */}
        <div className="text-center pt-12">
          <h2 className="text-5xl font-bold mb-2" style={{ color: usePrimary }}>
            {slide.title}
          </h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Held on {slide.eventDetails?.date}</p>
          <p className="text-lg font-semibold">{slide.eventDetails?.location}</p>
        </div>

        {/* Highlight Photo */}
        <div className="px-12 py-4">
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-lg">
            <img
              src={slide.photos?.[0]}
              alt="Highlight Photo"
              className="w-full h-full object-cover"
            />
          </div>
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
export const KeyMomentTemplates: KeyMomentTemplate[] = [
    KeyMomentTemplate1,
    KeyMomentTemplate2,
    KeyMomentTemplate3,
    KeyMomentTemplate4,
    KeyMomentTemplate5,
      
 
];