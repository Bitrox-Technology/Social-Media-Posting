import chroma from "chroma-js";
import cn from 'classnames';

export interface FlashSaleSlide {
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

export interface FlashSaleTemplate {
    id: string;
    name: string;
    slides: FlashSaleSlide[];
    renderSlide: (slide: FlashSaleSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
    coverImageUrl?: string;
}

export const FlashSaleTemplate1: FlashSaleTemplate = {
    id: 'fashion-flash-sale',
    name: 'Fashion Flash Sale',
    coverImageUrl: '/images/image-cover/fashion-flash-sale.png',
    slides: [
        {
            title: 'BUY 1 GET 1 FREE',
            description: '21 - 31 July 2028',
            imageUrl: '/images/fashion-flash.jpg',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        const primaryColor = chroma('#d4b8a1').hex(); // Beige
        const secondaryColor = chroma('#2d3033').hex(); // Dark slate
        const accentColor = chroma('#fff').hex(); // White
        const bgColor = chroma('#fff').hex(); // White
        const textColor = chroma('#2d3033').hex(); // Dark slate

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

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
                {/* Logo */}
                {addLogo && (
                    <div className="absolute top-4 right-4 z-20">
                        <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
                    </div>
                )}

                {/* Left Side: Image */}
                <div className="w-1/2 h-full">
                    <img src={slide.imageUrl} alt="Product" className="w-full h-full object-cover" />
                </div>

                {/* Right Side: Text */}
                <div className="w-1/2 h-full flex flex-col justify-center items-center p-16" style={{ backgroundColor: usePrimary }}>
                    <h2 className="text-5xl font-bold mb-4" style={{ color: accentColor }}>{slide.title}</h2>
                    <p className="text-xl mb-6" style={{ color: accentColor }}>Only $49</p>
                    <p className="text-lg mb-6" style={{ color: chroma(accentColor).alpha(0.8).css() }}>{slide.description}</p>
                    <a
                        href={slide.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 rounded-full text-lg"
                        style={{ backgroundColor: useSecondary, color: accentColor }}
                    >
                        Shop Now!
                    </a>
                    <a
                        href={slide.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm"
                        style={{ color: accentColor }}
                    >
                        {slide.footer}
                    </a>
                </div>
            </div>
        );
    },
};

export const FlashSaleTemplate2: FlashSaleTemplate = {
    id: 'beverage-split-sale',
    name: 'Beverage Split Sale',
    coverImageUrl: '/images/image-cover/beverage-split-sale.png',
    slides: [
        {
            title: 'BUY 1 GET 1',
            description: "Don't Miss It",
            imageUrl: '/images/beverage1.jpg',
            footer: 'Boba Push',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        const primaryColor = chroma('#f5c107').hex(); // Yellow
        const secondaryColor = chroma('#2d3033').hex(); // Dark slate
        const accentColor = chroma('#fff').hex(); // White
        const bgColor = chroma('#fff').hex(); // White
        const textColor = chroma('#2d3033').hex(); // Dark slate

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

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
                {/* Logo */}
                {addLogo && (
                    <div className="absolute top-4 right-4 z-20">
                        <img src={defaultLogoUrl} alt="Logo" className="w-32 h-16 object-contain" />
                    </div>
                )}

                {/* Diagonal Split */}
                <div className="absolute inset-0">
                    <div className="w-full h-full" style={{ clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)', backgroundColor: accentColor }}>
                        <img src={slide.imageUrl} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full h-full" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', backgroundColor: usePrimary }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-16">
                    <h2 className="text-5xl font-bold mb-4" style={{ color: accentColor }}>{slide.title}</h2>
                    <p className="text-2xl mb-4" style={{ color: accentColor }}>Only $5</p>
                    <p className="text-lg mb-6" style={{ color: chroma(accentColor).alpha(0.8).css() }}>{slide.description}</p>
                    <p className="text-lg mb-6" style={{ color: chroma(accentColor).alpha(0.8).css() }}>Every Monday</p>
                    <a
                        href={slide.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 rounded-full text-lg"
                        style={{ backgroundColor: useSecondary, color: accentColor }}
                    >
                        Order Now
                    </a>
                    <p className="mt-4 text-sm" style={{ color: accentColor }}>{slide.footer}</p>
                </div>
            </div>
        );
    },
};

export const FlashSaleTemplate3: FlashSaleTemplate = {
    id: 'skincare-flash-sale',
    name: 'Skincare Flash Sale',
    coverImageUrl: '/images/image-cover/skincare-flash-sale.png',
    slides: [
        {
            title: 'WEEKEND FLASH SALE',
            description: 'Buy 1 Get 2, Start From $5.00',
            imageUrl: '/images/skincare1.jpg',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        const primaryColor = chroma('#a3cffa').hex(); // Light blue
        const secondaryColor = chroma('#2d3033').hex(); // Dark slate
        const accentColor = chroma('#fff').hex(); // White
        const bgColor = chroma('#a3cffa').hex(); // Light blue
        const textColor = chroma('#2d3033').hex(); // Dark slate

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

        return (
            <div
                className={cn('relative w-[1080px] h-[1080px] flex flex-col items-center justify-center', {
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

                {/* Content */}
                <h2 className="text-3xl font-semibold mb-4">{slide.title}</h2>
                <h3 className="text-5xl font-bold mb-4">{slide.description.split(',')[0]}</h3>
                <p className="text-2xl mb-6">{slide.description.split(',')[1]}</p>
                <div className="relative z-10 mb-8">
                    <img src={slide.imageUrl} alt="Product" className="w-64 h-64 object-contain" />
                </div>
                <p className="text-lg mb-6">30-31 March</p>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-full text-lg"
                    style={{ backgroundColor: useSecondary, color: accentColor }}
                >
                    Shop Now
                </a>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm"
                    style={{ color: textColor }}
                >
                    {slide.footer}
                </a>
            </div>
        );
    },
};

export const FlashSaleTemplate4: FlashSaleTemplate = {
    id: 'pizza-promotion',
    name: 'Pizza Promotion',
    coverImageUrl: '/images/image-cover/pizza-promotion.png',
    slides: [
        {
            title: 'BUY ONE GET ONE',
            description: 'Fauget Restaurant Pizza Promotion',
            imageUrl: '/images/pizza1.jpg',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        const primaryColor = chroma('#e63946').hex(); // Red
        const secondaryColor = chroma('#2d3033').hex(); // Dark slate
        const accentColor = chroma('#fff').hex(); // White
        const bgColor = chroma('#e63946').hex(); // Red
        const textColor = chroma('#fff').hex(); // White

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

        return (
            <div
                className={cn('relative w-[1080px] h-[1080px] flex flex-col items-center justify-center', {
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

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-24 h-24 rounded-full overflow-hidden">
                    <img src={slide.imageUrl} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full overflow-hidden">
                    <img src={slide.imageUrl} alt="Product" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <h2 className="text-3xl font-semibold mb-4">{slide.description}</h2>
                <h3 className="text-5xl font-bold mb-4">{slide.title}</h3>
                <p className="text-lg mb-6">Valid Until 5 March</p>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-full text-lg bg-white"
                    style={{ color: usePrimary }}
                >
                    Order Now
                </a>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm"
                    style={{ color: textColor }}
                >
                    {slide.footer}
                </a>
            </div>
        );
    },
};

export const FlashSaleTemplate5: FlashSaleTemplate = {
    id: 'skincare-summer-sale',
    name: 'Skincare Summer Sale',
    coverImageUrl: '/images/image-cover/skincare-summer-sale.png',
    slides: [
        {
            title: 'BUY 1 GET 1',
            description: '#SummerSkincare Event',
            imageUrl: '/images/skincare2.jpg',
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        const primaryColor = chroma('#4a7c59').hex(); // Forest green
        const secondaryColor = chroma('#fff').hex(); // White
        const accentColor = chroma('#2d3033').hex(); // Dark slate
        const bgColor = chroma('#d4f4dd').hex(); // Light green
        const textColor = chroma('#2d3033').hex(); // Dark slate

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

        return (
            <div
                className={cn('relative w-[1080px] h-[1080px] flex flex-col items-center justify-center', {
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

                {/* Content */}
                <h2 className="text-2xl font-semibold mb-4">{slide.description}</h2>
                <h3 className="text-5xl font-bold mb-4">{slide.title}</h3>
                <div className="relative z-10 mb-8">
                    <img src={slide.imageUrl} alt="Product" className="w-64 h-64 object-contain" />
                </div>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-full text-lg"
                    style={{ backgroundColor: usePrimary, color: useSecondary }}
                >
                    Order Now
                </a>
                <a
                    href={slide.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm"
                    style={{ color: textColor }}
                >
                    {slide.footer}
                </a>
            </div>
        );
    },
};


export const FlashSaleTemplates: FlashSaleTemplate[] = [
    FlashSaleTemplate1,
    FlashSaleTemplate2,
    FlashSaleTemplate3,
    FlashSaleTemplate4,
    FlashSaleTemplate5,
];