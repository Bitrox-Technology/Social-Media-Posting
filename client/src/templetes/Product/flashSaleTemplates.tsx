import chroma from "chroma-js";
import cn from 'classnames';

export interface FlashSaleSlide {
    title: string;
    offer: string;
    validUntil: string;
    pricesStartingAt: string;
    imagesUrl: string[];
    footer: string;
    websiteUrl: string;
    description?: string; // Optional description field
}

export interface Colors {
    logoColors: { primary: string; secondary: string; accent: string[] };
    imageColors: string[];
    glowColor: string;
    complementaryGlowColor: string;
    ensureContrast: (color1: string, color2: string) => string;
    vibrantLogoColor: string;
    vibrantTextColor: string;
    footerColor: string;
    backgroundColor: string;
    typography: { fontFamily: string; fontWeight: number; fontSize: string };
    graphicStyle: { borderRadius: string; iconStyle: string; filter: string };
    materialTheme: { [key: string]: string };
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
            title: 'SUMMER FASHION FLASH SALE',
            offer: 'Buy 1 Get 2',
            validUntil: '31 July 2025',
            pricesStartingAt: '399',
            imagesUrl: [
                "https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",
            ],
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            description: 'Steal the season’s hottest styles with our Buy 1 Get 2 offer—starting at just $399!',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
        const { logoColors, materialTheme, typography, graphicStyle } = colors;

        // Color scheme for a vibrant fashion flash sale
        const primaryColor = chroma('#ff6f61').hex(); // Coral pink
        const secondaryColor = chroma('#1b263b').hex(); // Navy blue
        const accentColor = chroma('#fff').hex(); // White
        const bgColor = chroma('#f5f5f5').hex(); // Light gray
        const textColor = chroma('#1b263b').hex(); // Navy blue

        const usePrimary = logoColors.primary || primaryColor;
        const useSecondary = logoColors.secondary || secondaryColor;

        // Calculate days remaining until the sale ends
        const currentDate = new Date('2025-06-17T13:52:00+05:30'); // Current date and time (IST)
        const endDate = new Date('2025-07-31T23:59:59+05:30'); // End date (11:59 PM IST)
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

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
                    <div className="absolute top-8 right-8 z-20">
                        <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
                    </div>
                )}

                {/* Left Side: Image */}
                <div className="w-1/2 h-full p-4">
                    <img
                        src={slide.imagesUrl[0]}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                        style={{ objectPosition: 'center' }}
                    />
                </div>

                {/* Right Side: Text */}
                <div
                    className="w-1/2 h-full flex flex-col justify-center items-start p-20"
                    style={{ backgroundColor: chroma(usePrimary).alpha(0.9).css() }}
                >
                    {/* Title */}
                    <h2
                        className="text-5xl font-bold mb-6 leading-tight"
                        style={{ color: accentColor, maxWidth: '90%', textAlign: 'left' }}
                    >
                        {slide.title}
                    </h2>

                    {/* Offer */}
                    <p
                        className="text-4xl font-semibold mb-4"
                        style={{ color: accentColor, fontWeight: 600, textAlign: 'left' }}
                    >
                        {slide.offer}
                    </p>

                    {/* Description */}
                    <p
                        className="text-xl leading-relaxed mb-4"
                        style={{ color: chroma(accentColor).alpha(0.9).css(), maxWidth: '85%', textAlign: 'left' }}
                    >
                        {slide.description}
                    </p>

                    {/* Days Remaining */}
                    <p
                        className="text-lg font-medium mb-4"
                        style={{ color: accentColor, textAlign: 'left' }}
                    >
                        Hurry! Only few days left!
                    </p>

                    {/* Valid Until */}
                    <p
                        className="text-lg font-medium mb-6"
                        style={{ color: chroma(accentColor).alpha(0.8).css(), textAlign: 'left' }}
                    >
                        Valid until {slide.validUntil}
                    </p>

                    {/* Prices Starting At */}
                    <p
                        className="text-lg font-medium mb-8"
                        style={{ color: accentColor, textAlign: 'left' }}
                    >
                        Starting at ${slide.pricesStartingAt}
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
                        Grab Yours Before It’s Gone!
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


export const FlashSaleTemplate2: FlashSaleTemplate = {
    id: 'beverage-split-sale',
    name: 'Beverage Split Sale',
    coverImageUrl: '/images/image-cover/beverage-split-sale.png',
    slides: [
        {
            title: 'WEEKEND FLASH SALE',
            offer: 'Buy 1 Get 2',
            validUntil: '31 July 2025',
            pricesStartingAt: '399',
            imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg"],
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            description: "Don't Miss It",
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
                        <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full h-full" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)', backgroundColor: usePrimary }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-16">
                    <h2 className="text-5xl font-bold mb-4" style={{ color: accentColor }}>{slide.title}</h2>
                    <p className="text-2xl mb-4" style={{ color: accentColor }}>{slide.offer}</p>
                    <p className="text-lg mb-4" style={{ color: chroma(accentColor).alpha(0.8).css() }}>
                        Starting at ${slide.pricesStartingAt}
                    </p>
                    <p className="text-lg mb-4" style={{ color: chroma(accentColor).alpha(0.8).css() }}>
                        {slide.description}
                    </p>
                    <p className="text-lg mb-6" style={{ color: chroma(accentColor).alpha(0.8).css() }}>
                        Valid until {slide.validUntil}
                    </p>
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
            offer: 'Buy 1 Get 2',
            validUntil: '31 July 2025',
            pricesStartingAt: '399',
            imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg"],
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            description: 'Buy 1 Get 2, Start From $399', // Adjusted to match the template's format
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
                <h3 className="text-5xl font-bold mb-4">{slide.offer}</h3>
                <p className="text-2xl mb-4">{`Starting at $${slide.pricesStartingAt}`}</p>
                <div className="relative z-10 mb-8">
                    <img src={slide.imagesUrl[0]} alt="Product" className="w-64 h-64 object-contain" />
                </div>
                <p className="text-lg mb-6">{slide.validUntil}</p>
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
            title: 'WEEKEND FLASH SALE',
            offer: 'Buy 1 Get 2',
            validUntil: '31 July 2025',
            pricesStartingAt: '399',
            imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg"],
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            description: 'Fauget Restaurant Pizza Promotion',
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
                    <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full overflow-hidden">
                    <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <h2 className="text-3xl font-semibold mb-4">{slide.description}</h2>
                <h3 className="text-5xl font-bold mb-4">{slide.offer}</h3>
                <p className="text-lg mb-4">Starting at ${slide.pricesStartingAt}</p>
                <p className="text-lg mb-6">Valid until {slide.validUntil}</p>
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
            title: 'WEEKEND FLASH SALE',
            offer: 'Buy 1 Get 2',
            validUntil: '31 July 2025',
            pricesStartingAt: '399',
            imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg"],
            footer: 'reallygreatsite.com',
            websiteUrl: 'https://reallygreatsite.com',
            description: '#SummerSkincare Event',
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
                <h3 className="text-5xl font-bold mb-4">{slide.offer}</h3>
                <p className="text-lg mb-4">Starting at ${slide.pricesStartingAt}</p>
                <div className="relative z-10 mb-8">
                    <img src={slide.imagesUrl[0]} alt="Product" className="w-64 h-64 object-contain" />
                </div>
                <p className="text-lg mb-6">Valid until {slide.validUntil}</p>
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
    
];