import chroma from "chroma-js";
import cn from 'classnames';

export interface ProductBenefitSlide {
    title: string;
    description: string;
    imageUrl: string;
    footer: string;
    websiteUrl: string;
    benefits: { text: string; icon: string }[];
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

export interface ProductBenefitTemplate {
    id: string;
    name: string;
    slides: ProductBenefitSlide[];
    renderSlide: (slide: ProductBenefitSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
    coverImageUrl?: string;
}


// Template 1: Icon-Based Benefits List
export const ProductBenefitTemplate1: ProductBenefitTemplate = {
  id: 'product-benefits-icons',
  name: 'Product Benefits with Icons',
  coverImageUrl: '/images/image-cover/product-benefits-icons.png',
  slides: [
    {
      title: 'WHY CHOOSE OUR PRODUCT?',
      description: 'Discover the Benefits',
      imageUrl: '/images/product.jpg',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      benefits: [
        { text: 'Long-Lasting Durability', icon: '/icons/durability.png' },
        { text: 'Eco-Friendly Materials', icon: '/icons/eco-friendly.png' },
        { text: 'Easy to Use', icon: '/icons/easy-to-use.png' },
      ],
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#4A90E2').hex(); // Blue
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

        {/* Product Image */}
        <div className="flex justify-center my-8">
          <img src={slide.imageUrl} alt="Product" className="w-64 h-64 object-contain" />
        </div>

        {/* Benefits List with Icons */}
        <div className="flex flex-col items-center space-y-6 px-12">
          {slide.benefits?.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img src={benefit.icon} alt="Benefit Icon" className="w-12 h-12" />
              <p className="text-lg font-medium">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
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

// Template 2: Split Layout with Benefits on the Right
export const ProductBenefitTemplate2: ProductBenefitTemplate = {
  id: 'product-benefits-split',
  name: 'Product Benefits Split Layout',
  coverImageUrl: '/images/image-cover/product-benefits-split.png',
  slides: [
    {
      title: 'KEY BENEFITS',
      description: 'See Why Our Product Stands Out',
      imageUrl: '/images/product.jpg',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      benefits: [
        { text: 'Improves Efficiency', icon: '' },
        { text: 'Saves Time', icon: '' },
        { text: 'Cost-Effective', icon: '' },
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

        {/* Left Side: Product Image */}
        <div className="w-1/2 h-full">
          <img src={slide.imageUrl} alt="Product" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Benefits */}
        <div className="w-1/2 h-full flex flex-col justify-center p-12">
          <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg mb-6">{slide.description}</p>
          <ul className="space-y-4">
            {slide.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-2xl font-bold" style={{ color: usePrimary }}>
                  {index + 1}.
                </span>
                <p className="text-lg">{benefit.text}</p>
              </li>
            ))}
          </ul>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full text-lg mt-8"
            style={{ backgroundColor: usePrimary, color: secondaryColor }}
          >
            Shop Now
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm"
            style={{ color: textColor }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

// Template 3: Minimalist Benefits with Focus on Text
export const ProductBenefitTemplate3: ProductBenefitTemplate = {
  id: 'product-benefits-minimal',
  name: 'Product Benefits Minimalist',
  coverImageUrl: '/images/image-cover/product-benefits-minimal.png',
  slides: [
    {
      title: 'PRODUCT BENEFITS',
      description: 'Experience the Difference',
      imageUrl: '/images/product.jpg',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      benefits: [
        { text: 'High Quality Materials', icon: '' },
        { text: 'Designed for Comfort', icon: '' },
        { text: 'Affordable Pricing', icon: '' },
      ],
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, typography, graphicStyle } = colors;
    const primaryColor = chroma('#2D3033').hex(); // Dark Slate
    const secondaryColor = chroma('#FFFFFF').hex(); // White
    const textColor = chroma('#FFFFFF').hex(); // White
    const bgColor = chroma('#4A90E2').hex(); // Blue

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

        {/* Benefits List */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-12">
          {slide.benefits?.map((benefit, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-semibold">{benefit.text}</p>
              <div className="h-1 w-16 mx-auto mt-2" style={{ backgroundColor: secondaryColor }} />
            </div>
          ))}
        </div>

        {/* Product Image */}
        <div className="flex justify-center mb-8">
          <img src={slide.imageUrl} alt="Product" className="w-48 h-48 object-contain" />
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

// Export all templates in an array
export const ProductBenefitTemplates: ProductBenefitTemplate[] = [
    ProductBenefitTemplate1,
    ProductBenefitTemplate2,
    ProductBenefitTemplate3,
];