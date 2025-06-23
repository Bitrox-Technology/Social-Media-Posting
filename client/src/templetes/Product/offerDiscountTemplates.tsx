import chroma from "chroma-js";
import cn from 'classnames';

export interface OfferSlide {
  title: string;
  description: string;
  offer: number;
  imagesUrl: string[];
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
  materialTheme: { [key: string]: string };

}

export interface OfferTemplate {
  id: string;
  name: string;
  slides: OfferSlide[];
  renderSlide: (slide: OfferSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
}

export const OfferTemplate1: OfferTemplate = {
  id: 'fashion-split-layout',
  name: 'Fashion Split Layout',
  coverImageUrl: '/images/image-cover/fashion-split-layout.png',
  slides: [
    {
      title: 'SPECIAL OFFER',
      description: 'Up to 30% Discount',
      offer: 34,
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
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
        <div className="w-1/2 h-full relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gray-200 opacity-20" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}></div>
          <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Text */}
        <div className="w-1/2 h-full flex flex-col justify-center items-center p-16">
          <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
          <p className="text-3xl font-semibold mb-6" style={{ color: useSecondary }}>{slide.description}</p>
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
      </div>
    );
  },
};

export const OfferTemplate2: OfferTemplate = {
  id: 'fashion-collage',
  name: 'Fashion Collage',
  coverImageUrl: '/images/image-cover/fashion-collage.png',
  slides: [
    {
      title: 'SPECIAL OFFER',
      description: 'Up to 50%',
      offer: 25,
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
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

        {/* Collage Background */}
        <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img src={slide.imagesUrl[0]} alt="Product 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img src={slide.imagesUrl[1]} alt="Product 2" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img src={slide.imagesUrl[2]} alt="Product 3" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-16">
          <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
          <p className="text-3xl font-semibold mb-6" style={{ color: useSecondary }}>{slide.description}</p>
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
      </div>
    );
  },
};

export const OfferTemplate3: OfferTemplate = {
  id: 'bold-fashion-sale',
  name: 'Bold Fashion Sale',
  coverImageUrl: '/images/image-cover/bold-fashion-sale.png',
  slides: [
    {
      title: 'HAPPY HOUR SALE',
      description: 'Get 50% Off!! Shop Our Crazy Clearance Sale. Huge Discount On Selected Items.',
      offer: 50,
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#000').hex(); // Black
    const secondaryColor = chroma('#fff').hex(); // White
    const accentColor = chroma('#d4b8a1').hex(); // Beige
    const bgColor = chroma('#000').hex(); // Black
    const textColor = chroma('#fff').hex(); // White

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
          <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Text */}
        <div className="w-1/2 h-full flex flex-col justify-center p-16">
          <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg mb-6" style={{ color: chroma(textColor).alpha(0.8).css() }}>{slide.description}</p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
            style={{ backgroundColor: useSecondary, color: usePrimary }}
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
      </div>
    );
  },
};

export const OfferTemplate4: OfferTemplate = {
  id: 'circular-fashion-offer',
  name: 'Circular Fashion Offer',
  coverImageUrl: '/images/image-cover/circular-fashion-offer.png',
  slides: [
    {
      title: 'SPECIAL OFFER',
      description: 'Get a special discount today. This discount is limited. Do not miss this opportunity.',
      offer: 50,
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: '@reallygreatsite',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#2d3033').hex(); // Dark slate
    const secondaryColor = chroma('#d4b8a1').hex(); // Beige
    const accentColor = chroma('#fff').hex(); // White
    const bgColor = chroma('#2d3033').hex(); // Dark slate
    const textColor = chroma('#fff').hex(); // White

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

        {/* Left Side: Discount Badge */}
        <div className="w-1/3 h-full flex items-center justify-center">
          <div className="w-48 h-48 rounded-full flex items-center justify-center" style={{ backgroundColor: useSecondary }}>
            <p className="text-4xl font-bold" style={{ color: usePrimary }}>50% OFF</p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-2/3 h-full flex flex-col justify-center p-16">
          <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg mb-6" style={{ color: chroma(textColor).alpha(0.8).css() }}>{slide.description}</p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg"
            style={{ backgroundColor: accentColor, color: usePrimary }}
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

        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full overflow-hidden">
            <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  },
};

export const OfferTemplate5: OfferTemplate = {
  id: 'food-discount',
  name: 'Food Discount',
  coverImageUrl: '/images/image-cover/food-discount.png',
  slides: [
    {
      title: 'Special Offer',
      offer: 40,
      description: 'Up to 40% Discount. Delight your senses with our special offer. Indulge in exceptional flavors at an exclusive price. Don’t miss out!',
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg"],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#fff').hex(); // White
    const accentColor = chroma('#fff').hex(); // White for text on primary background
    const bgColor = chroma('#f5f5f5').hex(); // Light gray background
    const textColor = chroma('#1a1a1a').hex(); // Darker text for readability

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
          <div className="absolute top-8 right-8 z-20">
            <img src={defaultLogoUrl} alt="Logo" className="w-40 h-20 object-contain" />
          </div>
        )}

        {/* Left Side: Image */}
        <div className="w-1/2 h-full">
          <img
            src={slide.imagesUrl[0]}
            alt="Product"
            className="w-full h-full object-cover"
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
            Up to {slide.offer}% Off
          </p>

          {/* Description */}
          <p
            className="text-xl leading-relaxed mb-8"
            style={{ color: chroma(accentColor).alpha(0.9).css(), maxWidth: '85%', textAlign: 'left' }}
          >
            {slide.description}
          </p>

          {/* Shop Now Button */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-xl font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: useSecondary,
              color: usePrimary,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            Shop Now
          </a>
        </div>

        {/* Bottom Section: Website URL and Footer */}
        <div className="absolute bottom-8 w-full flex justify-between items-center z-10 px-12">
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-medium tracking-wide hover:underline"
            style={{
              color: chroma(textColor).alpha(0.9).css(),
            }}
          >
            {slide.websiteUrl}
          </a>

          <p
            className="text-xl font-medium tracking-wide"
            style={{
              color: chroma(textColor).alpha(0.9).css(),
            }}
          >
            @{slide.footer}
          </p>
        </div>
      </div>
    );
  },
};
export const OfferTemplates: OfferTemplate[] = [
  // OfferTemplate1,
  // OfferTemplate2,
  // OfferTemplate3,
  // OfferTemplate4,
  OfferTemplate5,

];