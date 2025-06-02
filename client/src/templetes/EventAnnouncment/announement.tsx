import chroma from "chroma-js";
import cn from 'classnames';

export interface AnnouncementSlide {
  title: string;
  description: string;
  imageUrl?: string;
  footer: string;
  websiteUrl: string;
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

export interface AnnoucementTemplate {
  id: string;
  name: string;
  slides: AnnouncementSlide[];
  renderSlide: (slide: AnnouncementSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
} 


// Template 29: Conference Announcement - Professional Blue Design
export const AnnoucementTemplate1: AnnoucementTemplate = {
  id: 'conference-announcement-blue',
  name: 'Conference Announcement Blue',
  coverImageUrl: '/images/image-cover/conference-announcement-blue.png',
  slides: [
    {
      title: 'ANNUAL BUSINESS CONFERENCE 2025',
      description: 'Join Industry Leaders to Shape the Future',
      eventDetails: {
        date: 'June 15, 2025',
        time: '9:00 AM - 5:00 PM IST',
        location: 'Mumbai Convention Center',
      },
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#1976D2').hex(); // Blue (Professional)
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
          <p className="text-xl">{slide.description}</p>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            {slide.eventDetails && (
              <>
                {slide.eventDetails && (
                  <>
                    <p className="text-lg font-semibold">Date: {slide.eventDetails.date}</p>
                    <p className="text-lg font-semibold">Time: {slide.eventDetails.time}</p>
                    <p className="text-lg font-semibold">Location: {slide.eventDetails.location}</p>
                  </>
                )}
              </>
            )}
          </div>
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
            Register Now
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

// Template 30: Webinar Announcement - Virtual Event with Purple Gradient
export const AnnoucementTemplate2: AnnoucementTemplate = {
  id: 'webinar-announcement-gradient',
  name: 'Webinar Announcement Gradient',
  coverImageUrl: '/images/image-cover/webinar-announcement-gradient.png',
  slides: [
    {
      title: 'WEBINAR: THE FUTURE OF TECH',
      description: 'Insights on AI and Innovation',
      eventDetails: {
        date: 'June 10, 2025',
        time: '2:00 PM - 3:30 PM IST',
        location: 'Online (Zoom)',
      },
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#7B1FA2').hex(); // Purple (Tech/Webinar)
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White
    const bgGradient = `linear-gradient(135deg, ${chroma('#7B1FA2').hex()} 0%, ${chroma('#AB47BC').hex()} 100%)`;

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
          <h2 className="text-5xl font-bold mb-2">{slide.title}</h2>
          <p className="text-xl">{slide.description}</p>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            {slide.eventDetails && (
              <>
                {slide.eventDetails && (
                  <>
                    <p className="text-lg font-semibold">Date: {slide.eventDetails.date}</p>
                    <p className="text-lg font-semibold">Time: {slide.eventDetails.time}</p>
                    <p className="text-lg font-semibold">Location: {slide.eventDetails.location}</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
            style={{ backgroundColor: secondaryColor, color: usePrimary }}
          >
            Join the Webinar
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

// Template 31: Summer Event Announcement - Warm Tones with Image Background
export const AnnoucementTemplate3: AnnoucementTemplate = {
  id: 'summer-event-image',
  name: 'Summer Event Image',
  coverImageUrl: '/images/image-cover/summer-event-image.png',
  slides: [
    {
      title: 'SUMMER FESTIVAL 2025',
      description: 'Celebrate with Music and Fun!',
      imageUrl: '/images/summer-festival.jpg',
      eventDetails: {
        date: 'July 5, 2025',
        time: '12:00 PM - 8:00 PM IST',
        location: 'Goa Beachfront',
      },
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FF6F00').hex(); // Orange (Summer)
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White

    const usePrimary = logoColors.primary || primaryColor;

    return (
      <div
        className={cn('relative w-[1080px] h-[1080px] flex flex-col', {
          'rounded-lg': graphicStyle.borderRadius !== '0px',
        })}
        style={{
          fontFamily: typography.fontFamily,
          color: textColor,
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Overlay */}
        {/* <div className="absolute inset-0">
          <img src={slide.imageUrl} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div> */}

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="relative text-center pt-12">
          <h2 className="text-5xl font-bold mb-2">{slide.title}</h2>
          <p className="text-xl">{slide.description}</p>
        </div>

        {/* Event Details */}
        <div className="relative flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            {slide.eventDetails && (
              <>
                {slide.eventDetails && (
                  <>
                    <p className="text-lg font-semibold">Date: {slide.eventDetails.date}</p>
                    <p className="text-lg font-semibold">Time: {slide.eventDetails.time}</p>
                    <p className="text-lg font-semibold">Location: {slide.eventDetails.location}</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="relative text-center mb-8">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            Get Tickets
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

// Export all templates in an array
export const AnnoucementTemplates: AnnoucementTemplate[] = [
    AnnoucementTemplate1,
    AnnoucementTemplate2,
    AnnoucementTemplate3,
];