import chroma from "chroma-js";
import cn from 'classnames';

export interface ReminderSlide {
  title: string;
  eventName: string;
  imageUrl?: string;
  footer: string;
  websiteUrl: string;
  countdown: string;
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

export interface ReminderTemplate {
  id: string;
  name: string;
  slides: ReminderSlide[];
  renderSlide: (slide: ReminderSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
} 


// Template 32: Event Reminder - Urgent Red Design
export const ReminderTemplate1: ReminderTemplate = {
  id: 'event-reminder-urgent-red',
  name: 'Event Reminder Urgent Red',
  coverImageUrl: '/images/image-cover/event-reminder-urgent-red.png',
  slides: [
    {
      title: 'EVENT REMINDER!',
      eventName: 'Annual Tech Summit 2025',
      eventDetails: {
        date: 'June 1, 2025',
        time: '9:00 AM - 5:00 PM IST',
        location: 'Mumbai Convention Center',
      },
      countdown: '3 Days Left!',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#D32F2F').hex(); // Red (Urgency)
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
          <div className="text-center">
            <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
            <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
            <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
          </div>
          <p className="text-2xl font-bold mt-4" style={{ color: usePrimary }}>
            {slide.countdown}
          </p>
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
            Add to Calendar
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

// Template 33: Event Reminder - Professional Blue with Countdown
export const ReminderTemplate2: ReminderTemplate = {
  id: 'event-reminder-blue-countdown',
  name: 'Event Reminder Blue Countdown',
  coverImageUrl: '/images/image-cover/event-reminder-blue-countdown.png',
  slides: [
    {
      title: 'DON’T MISS OUT!',
      eventName: 'Webinar: AI Innovations',
      eventDetails: {
        date: 'June 5, 2025',
        time: '2:00 PM - 3:30 PM IST',
        location: 'Online (Zoom)',
      },
      countdown: '1 Week Left!',
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
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
            <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
            <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
          </div>
          <div
            className="px-6 py-2 rounded-full"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            <p className="text-lg font-semibold">{slide.countdown}</p>
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

// Template 34: Event Reminder - Minimalist with Gradient
export const ReminderTemplate3: ReminderTemplate = {
  id: 'event-reminder-minimalist-gradient',
  name: 'Event Reminder Minimalist Gradient',
  coverImageUrl: '/images/image-cover/event-reminder-minimalist-gradient.png',
  slides: [
    {
      title: 'REMINDER: JOIN US!',
      eventName: 'Summer Networking Event',
      eventDetails: {
        date: 'June 10, 2025',
        time: '6:00 PM - 9:00 PM IST',
        location: 'Delhi Rooftop Lounge',
      },
      countdown: '12 Days Left!',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#388E3C').hex(); // Green (Networking)
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White
    const bgGradient = `linear-gradient(135deg, ${chroma('#388E3C').hex()} 0%, ${chroma('#66BB6A').hex()} 100%)`;

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
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
            <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
            <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
          </div>
          <p className="text-2xl font-bold">{slide.countdown}</p>
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
            Save the Date
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

// Template 35: Event Reminder - Image Background with Overlay
export const ReminderTemplate4: ReminderTemplate = {
  id: 'event-reminder-image-overlay',
  name: 'Event Reminder Image Overlay',
  coverImageUrl: '/images/image-cover/event-reminder-image-overlay.png',
  slides: [
    {
      title: 'EVENT REMINDER!',
      eventName: 'Summer Music Festival',
      imageUrl: '/images/music-festival.jpg',
      eventDetails: {
        date: 'June 15, 2025',
        time: '12:00 PM - 8:00 PM IST',
        location: 'Goa Beachfront',
      },
      countdown: '2 Weeks Left!',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#FBC02D').hex(); // Yellow (Festival)
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
        <div className="absolute inset-0">
          <img src={slide.imageUrl} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Logo */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
          </div>
        )}

        {/* Header */}
        <div className="relative text-center pt-12">
          <h2 className="text-5xl font-bold mb-2">{slide.title}</h2>
          <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
        </div>

        {/* Event Details */}
        <div className="relative flex-1 flex flex-col justify-center items-center space-y-4 px-12">
          <div className="text-center">
            <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
            <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
            <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.countdown}
          </p>
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

// Template 36: Event Reminder - Clean and Simple with Orange Accents
export const ReminderTemplate5: ReminderTemplate = {
  id: 'event-reminder-simple-orange',
  name: 'Event Reminder Simple Orange',
  coverImageUrl: '/images/image-cover/event-reminder-simple-orange.png',
  slides: [
    {
      title: 'REMINDER: DON’T FORGET!',
      eventName: 'Charity Gala 2025',
      eventDetails: {
        date: 'June 8, 2025',
        time: '7:00 PM - 10:00 PM IST',
        location: 'Bangalore Grand Hotel',
      },
      countdown: '10 Days Left!',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#F57C00').hex(); // Orange (Charity)
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
          <div className="text-center">
            <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
            <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
            <p className="text-lg font-semibold">Location: {slide.eventDetails?.location}</p>
          </div>
          <p className="text-2xl font-bold" style={{ color: usePrimary }}>
            {slide.countdown}
          </p>
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
            RSVP Now
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
export const ReminderTemplates: ReminderTemplate[] = [
    ReminderTemplate1,
    ReminderTemplate2,
    ReminderTemplate3,
    ReminderTemplate4,
    ReminderTemplate5,
];