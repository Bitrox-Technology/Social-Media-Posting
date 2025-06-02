import chroma from "chroma-js";
import cn from 'classnames';

export interface LiveEventSlide {
    title: string;
    eventName: string;
    imageUrl?: string;
    footer: string;
    websiteUrl: string;
    countdown: string;
    eventDetails?: {
        date: string;
        time: string;
        platform: string;
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

export interface LiveEventTemplate {
    id: string;
    name: string;
    slides: LiveEventSlide[];
    renderSlide: (slide: LiveEventSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
    coverImageUrl?: string;
}

export const LiveEventTemplate1: LiveEventTemplate = {
    id: 'live-event-blue-countdown',
    name: 'Live Event Blue Countdown',
    coverImageUrl: '/images/image-cover/live-event-blue-countdown.png',
    slides: [
        {
            title: 'JOIN US LIVE!',
            eventName: 'AI in 2025: Live Webinar',
            eventDetails: {
                date: 'June 1, 2025',
                time: '11:00 AM IST',
                platform: 'Zoom',
            },
            countdown: 'Happening in 3 Days!',
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
                        <p className="text-lg font-semibold">Platform: {slide.eventDetails?.platform}</p>
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
                        Join Now
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

export const LiveEventTemplate2: LiveEventTemplate = {
    id: 'live-event-purple-wave',
    name: 'Live Event Purple Wave',
    coverImageUrl: '/images/image-cover/live-event-purple-wave.png',
    slides: [
        {
            title: 'LIVE EVENT ALERT!',
            eventName: 'Product Launch Live Stream',
            eventDetails: {
                date: 'June 2, 2025',
                time: '3:00 PM IST',
                platform: 'YouTube Live',
            },
            countdown: 'Tomorrow!',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#7B1FA2').hex(); // Purple (Energetic)
        const secondaryColor = chroma('#FFFFFF').hex(); // White
        const textColor = chroma('#FFFFFF').hex(); // White
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
                {/* Wave Pattern */}
                <svg
                    className="absolute top-0 left-0 w-full"
                    viewBox="0 0 1080 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 200C0 200 240 0 540 0C840 0 1080 200 1080 200H0Z"
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
                    <h3 className="text-3xl font-semibold" style={{ color: textColor }}>
                        {slide.eventName}
                    </h3>
                </div>

                {/* Event Details */}
                <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
                        <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
                        <p className="text-lg font-semibold">Platform: {slide.eventDetails?.platform}</p>
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
                        Save Your Spot
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

// Template 39: Live Event - Modern Green with Icon
export const LiveEventTemplate3: LiveEventTemplate = {
    id: 'live-event-green-icon',
    name: 'Live Event Green Icon',
    coverImageUrl: '/images/image-cover/live-event-green-icon.png',
    slides: [
        {
            title: 'GO LIVE WITH US!',
            eventName: 'Sustainability Talk: Live',
            eventDetails: {
                date: 'June 3, 2025',
                time: '10:00 AM IST',
                platform: 'Google Meet',
            },
            countdown: 'In 5 Days!',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#388E3C').hex(); // Green (Eco-friendly)
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

                {/* Header with Live Icon */}
                <div className="text-center pt-12">
                    <div className="flex justify-center items-center mb-2">
                        <svg
                            className="w-8 h-8 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="12" cy="12" r="10" fill={usePrimary} />
                            <circle cx="12" cy="12" r="4" fill={secondaryColor} />
                        </svg>
                        <h2 className="text-5xl font-bold" style={{ color: usePrimary }}>
                            {slide.title}
                        </h2>
                    </div>
                    <h3 className="text-3xl font-semibold">{slide.eventName}</h3>
                </div>

                {/* Event Details */}
                <div className="flex-1 flex flex-col justify-center items-center space-y-4 px-12">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
                        <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
                        <p className="text-lg font-semibold">Platform: {slide.eventDetails?.platform}</p>
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
                        Join the Live Event
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

// Template 40: Live Event - Dark Gradient with Red Accents
export const LiveEventTemplate4: LiveEventTemplate = {
    id: 'live-event-dark-gradient',
    name: 'Live Event Dark Gradient',
    coverImageUrl: '/images/image-cover/live-event-dark-gradient.png',
    slides: [
        {
            title: 'LIVE NOW!',
            eventName: 'Gaming Tournament Stream',
            eventDetails: {
                date: 'May 29, 2025',
                time: '6:00 PM IST',
                platform: 'Twitch',
            },
            countdown: 'Happening Today!',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#D32F2F').hex(); // Red (Urgency)
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
                    <div className="text-center">
                        <p className="text-lg font-semibold">Date: {slide.eventDetails?.date}</p>
                        <p className="text-lg font-semibold">Time: {slide.eventDetails?.time}</p>
                        <p className="text-lg font-semibold">Platform: {slide.eventDetails?.platform}</p>
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
                        Watch Live
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

// Template 41: Live Event - Minimalist White with Orange Accents
export const LiveEventTemplate5: LiveEventTemplate = {
    id: 'live-event-minimalist-orange',
    name: 'Live Event Minimalist Orange',
    coverImageUrl: '/images/image-cover/live-event-minimalist-orange.png',
    slides: [
        {
            title: 'LIVE Q&A SESSION!',
            eventName: 'Ask Me Anything: Tech Edition',
            eventDetails: {
                date: 'June 5, 2025',
                time: '1:00 PM IST',
                platform: 'Instagram Live',
            },
            countdown: 'In 1 Week!',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#F57C00').hex(); // Orange (Engaging)
        const secondaryColor = chroma('#FFFFFF').hex(); // White
        const textColor = chroma('#000000').hex(); // Black
        const bgColor = chroma('#FFFFFF').hex(); // White

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
                        <p className="text-lg font-semibold">Platform: {slide.eventDetails?.platform}</p>
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
                        Set a Reminder
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
export const LiveEventTemplates: LiveEventTemplate[] = [
    LiveEventTemplate1,
    LiveEventTemplate2,
    LiveEventTemplate3,
    LiveEventTemplate4,
    LiveEventTemplate5,
];