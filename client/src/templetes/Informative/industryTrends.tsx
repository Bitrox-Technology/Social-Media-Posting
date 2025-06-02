import chroma from "chroma-js";
import cn from 'classnames';

export interface IndustryTrendSlide {
    title: string;
    description: string;
    imageUrl?: string;
    footer: string;
    websiteUrl: string;
    benefits?: { text: string; icon: string }[];
    trends?: any[]; // Can be a string array or an object array with text and icon
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

export interface IndustryTrendTemplate {
    id: string;
    name: string;
    slides: IndustryTrendSlide[];
    renderSlide: (slide: IndustryTrendSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
    coverImageUrl?: string;
}


// Template 24: Finance Trends - Clean List with Green Accents
export const IndustryTrendTemplate1: IndustryTrendTemplate = {
    id: 'finance-trends-list',
    name: 'Finance Trends List',
    coverImageUrl: '/images/image-cover/finance-trends-list.png',
    slides: [
        {
            title: 'TOP INVESTMENT TRENDS 2025',
            description: 'Insights from Our Experts',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            trends: [
                'Sustainable Investments Gain Momentum',
                'AI-Driven Financial Tools on the Rise',
                'Cryptocurrency Regulations Tighten',
            ],
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#2E7D32').hex(); // Green (Finance)
        const secondaryColor = chroma('#FFFFFF').hex(); // White
        const textColor = chroma('#000000').hex(); // Black
        const bgColor = chroma('#F5F5F5').hex(); // Light Gray

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

                {/* Trends List */}
                <div className="flex-1 flex flex-col justify-center px-12 space-y-6">
                    {slide.trends?.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <span className="text-3xl font-bold" style={{ color: usePrimary }}>
                                {index + 1}.
                            </span>
                            <p className="text-lg">{trend}</p>
                        </div>
                    ))}
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
                        Read More
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

// Template 25: Technology Trends - Futuristic Design with Blue Gradient
export const IndustryTrendTemplate2: IndustryTrendTemplate = {
    id: 'tech-trends-futuristic',
    name: 'Tech Trends Futuristic',
    coverImageUrl: '/images/image-cover/tech-trends-futuristic.png',
    slides: [
        {
            title: 'THE FUTURE OF AI IN 2025',
            description: 'What Businesses Need to Know',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            trends: [
                'Generative AI Expands into New Industries',
                'Ethics and Regulation Take Center Stage',
                'AI-Powered Automation Boosts Efficiency',
            ],
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#0288D1').hex(); // Blue (Tech)
        const secondaryColor = chroma('#FFFFFF').hex(); // White
        const textColor = chroma('#FFFFFF').hex(); // White
        const bgGradient = `linear-gradient(135deg, ${chroma('#0288D1').hex()} 0%, ${chroma('#4FC3F7').hex()} 100%)`;

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

                {/* Trends List */}
                <div className="flex-1 flex flex-col justify-center px-12 space-y-6">
                    {slide.trends?.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <span className="text-2xl font-bold">•</span>
                            <p className="text-lg">{trend}</p>
                        </div>
                    ))}
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
                        Discover More
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

// Template 26: Fashion Trends - Earthy Tones with Image Background
export const IndustryTrendTemplate3: IndustryTrendTemplate = {
    id: 'fashion-trends-earthy',
    name: 'Fashion Trends Earthy',
    coverImageUrl: '/images/image-cover/fashion-trends-earthy.png',
    slides: [
        {
            title: 'SUSTAINABLE FASHION TRENDS 2025',
            description: 'Dominating the Industry',
            imageUrl: '/images/fashion-trend.jpg',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            trends: [
                'Upcycled Fabrics Lead the Way',
                'Neutral Tones Make a Comeback',
                'Eco-Friendly Accessories Rise',
            ],
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#8D6E63').hex(); // Brown (Fashion)
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
                    <p className="text-xl">{slide.description}</p>
                </div>

                {/* Trends List */}
                <div className="relative flex-1 flex flex-col justify-center px-12 space-y-6">
                    {slide.trends?.map((trend, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <span className="text-2xl font-bold" style={{ color: usePrimary }}>
                                {index + 1}.
                            </span>
                            <p className="text-lg">{trend}</p>
                        </div>
                    ))}
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
                        See the Trends
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

// Template 27: General Trends - Minimalist with Highlighted Boxes
export const IndustryTrendTemplate4: IndustryTrendTemplate = {
    id: 'trends-highlighted-boxes',
    name: 'Trends Highlighted Boxes',
    coverImageUrl: '/images/image-cover/trends-highlighted-boxes.png',
    slides: [
        {
            title: 'INDUSTRY TRENDS TO WATCH',
            description: 'Stay Ahead in 2025',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            trends: [
                'Trend 1: Innovation Drives Growth',
                'Trend 2: Sustainability Becomes Key',
                'Trend 3: Digital Transformation Accelerates',
            ],
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#F5A623').hex(); // Yellow
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
                    <h2 className="text-5xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-xl">{slide.description}</p>
                </div>

                {/* Trends List with Highlighted Boxes */}
                <div className="flex-1 flex flex-col justify-center px-12 space-y-6">
                    {slide.trends?.map((trend, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: chroma(usePrimary).alpha(0.1).hex() }}
                        >
                            <p className="text-lg">{trend}</p>
                        </div>
                    ))}
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
                        Learn More
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

// Template 28: Trends with Icons - Professional and Clean
export const IndustryTrendTemplate5: IndustryTrendTemplate = {
    id: 'trends-icons',
    name: 'Trends with Icons',
    coverImageUrl: '/images/image-cover/trends-icons.png',
    slides: [
        {
            title: '2025 INDUSTRY INSIGHTS',
            description: 'Key Trends to Understand',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            trends: [
                { text: 'Trend 1: Focus on Innovation', icon: '/icons/innovation.png' },
                { text: 'Trend 2: Shift to Sustainability', icon: '/icons/sustainability.png' },
                { text: 'Trend 3: Technology Integration', icon: '/icons/technology.png' },
            ],
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, typography, graphicStyle } = colors;
        const primaryColor = chroma('#D81B60').hex(); // Pink (General)
        const secondaryColor = chroma('#FFFFFF').hex(); // White
        const textColor = chroma('#000000').hex(); // Black
        const bgColor = chroma('#F5F5F5').hex(); // Light Gray

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
                    <h2 className="text-5xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-xl">{slide.description}</p>
                </div>

                {/* Trends List with Icons */}
                <div className="flex-1 flex flex-col justify-center items-center space-y-8 px-12">
                    {slide.trends?.map((trend, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <img src={trend.icon} alt="Trend Icon" className="w-12 h-12" />
                            <p className="text-lg font-medium">{trend.text}</p>
                        </div>
                    ))}
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
                        Dive Deeper
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
export const IndustryTrendTemplates: IndustryTrendTemplate[] = [
    IndustryTrendTemplate1,
    IndustryTrendTemplate2,
    IndustryTrendTemplate3,
    IndustryTrendTemplate4,
    IndustryTrendTemplate5,

];