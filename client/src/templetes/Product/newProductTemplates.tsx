import chroma from "chroma-js";
import cn from 'classnames';

export interface NewProductSlide {
  title: string;
  description: string;
  imagesUrl: string[];
  price: string;
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

export interface NewProductTemplate {
  id: string;
  name: string;
  slides: NewProductSlide[];
  renderSlide: (slide: NewProductSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl?: string;
}

export const NewProductTemplate1: NewProductTemplate = {
  id: 'hexagonal-showcase',
  name: 'Hexagonal Showcase',
  coverImageUrl: '/images/product-covers/hexagonal-showcase.png',
  slides: [
    {
      title: 'Summer Shirt',
      description: 'Discover the latest summer styles with vibrant colours and trendy designs, perfect for any occasion!',
      imagesUrl: [
        "https://res.cloudinary.com/deuvfylc5/image/upload/v1750084381/product_images/imagesUrl_image_1750084379003.jpg",
        "https://res.cloudinary.com/deuvfylc5/image/upload/v1750084382/product_images/imagesUrl_image_1750084381218.jpg",
        "https://res.cloudinary.com/deuvfylc5/image/upload/v1750084383/product_images/imagesUrl_image_1750084382556.jpg",
      ],
      footer: 'bitrox.tech',
      websiteUrl: 'https://www.bitrox.tech',
      price: '599',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    // Colors inspired by the image
    const primaryColor = chroma('#f5c7c7').hex(); // Soft pink
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#fff').hex(); // Forest green (for button)
    const bgColor = chroma('#fff').hex(); // White background
    const textColor = chroma('#2d3033').hex(); // Dark slate for text

    // Use logoColors if provided, otherwise fall back to defined colors
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
        {/* Organic Leaf Shape (Decorative Element) */}
        <svg
          className="absolute top-0 left-0 w-1/3 h-1/3 opacity-20"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill={useSecondary}
            d="M44.7,-76.4C58.9,-69.8,71.8,-59.2,79.6,-45.3C87.4,-31.3,90.2,-14.1,88.1,2C86,18.2,79,33.3,69.3,46.5C59.7,59.7,47.4,71,33.2,77.7C19,84.3,2.8,86.3,-12.4,83.5C-27.7,80.8,-42,73.3,-54.3,63C-66.7,52.7,-77.1,39.7,-82.6,24.7C-88.1,9.7,-88.7,-7.3,-83.8,-22C-78.9,-36.7,-68.4,-49.2,-55.6,-56.1C-42.7,-63,-27.5,-64.3,-13.2,-70.5C1.1,-76.7,30.5,-83,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>

        {/* Hexagonal Frames for Images */}
        <div className="relative w-2/3 h-full flex items-center justify-center">
          {slide.imagesUrl && slide.imagesUrl.length >= 3 && (
            <>
              {/* Center Hexagon */}
              <div
                className="absolute w-64 h-64"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  backgroundColor: usePrimary,
                }}
              >
                <img
                  src={slide.imagesUrl[0]}
                  alt="Product 1"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Top-Right Hexagon */}
              <div
                className="absolute w-64 h-64 translate-x-32 -translate-y-32"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  backgroundColor: usePrimary,
                }}
              >
                <img
                  src={slide.imagesUrl[1]}
                  alt="Product 2"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Bottom-Left Hexagon */}
              <div
                className="absolute w-64 h-64 -translate-x-32 translate-y-32"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  backgroundColor: usePrimary,
                }}
              >
                <img
                  src={slide.imagesUrl[2]}
                  alt="Product 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          )}
        </div>

        {/* Text Panel */}
        <div
          className="w-1/3 h-full flex flex-col justify-center p-8"
          style={{ backgroundColor:  chroma(usePrimary).alpha(0.8).css() }}
        >
          <h2
            className="text-6xl font-extrabold mb-6 text-center leading-tight"
            style={{ color: chroma(accentColor).alpha(0.8).css() }}
          >
            {slide.title}
          </h2>
          <p
            className="text-lg mb-4"
            style={{ color: chroma(accentColor).alpha(0.8).css() }}
          >
            {slide.description}
          </p>
          {/* Add Price Here */}
          <p
            className="text-xl font-bold mb-6"
            style={{ color: accentColor }}
          >
            ${slide.price}
          </p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-full text-white text-lg font-semibold"
            style={{ backgroundColor: 'black' }}
          >
            Shop Now
          </a>
        </div>

        {/* Logo in Top-Right (Optional) */}
        {addLogo && (
          <div className="absolute top-4 right-4 z-20">
            <img
              src={defaultLogoUrl}
              alt="Logo"
              className="w-32 h-16 object-contain"
              style={{ filter: graphicStyle.filter }}
            />
          </div>
        )}

        <div className="absolute bottom-4 w-full flex justify-between items-center z-10 px-8">
          {/* Website URL - Bottom Left */}
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold tracking-wider"
            style={{
              color: chroma(textColor).alpha(0.8).css(),
            }}
          >
            {slide.websiteUrl}
          </a>

          {/* Footer - Bottom Right */}
          <p
            className="text-lg font-semibold tracking-wider"
            style={{
              color: chroma(textColor).alpha(0.8).css(),
            }}
          >
            @{slide.footer}
          </p>
        </div>
      </div>
    );
  },
};

export const NewProductTemplate2: NewProductTemplate = {
  id: 'collage-promotion',
  name: 'Collage Promotion',
  coverImageUrl: '/images/image-cover/collage-promotion.png',
  slides: [
    {
      title: 'THE NEW PRODUCT',
      description: 'Chase and get our new product which is very high quality and limited.',
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      price: '599',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
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
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img src={slide.imagesUrl[3]} alt="Product 4" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-16">
          <h2 className="text-5xl font-bold text-white mb-4">{slide.title}</h2>
          <p className="text-xl text-white mb-6 text-center">{slide.description}</p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-full text-white text-lg"
            style={{ backgroundColor: usePrimary }}
          >
            Shop Now
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm text-white"
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const NewProductTemplate3: NewProductTemplate = {
  id: 'centered-product-focus',
  name: 'Centered Product Focus',
  coverImageUrl: '/images/image-cover/centered-product-focus.png',
  slides: [
    {
      title: 'RAIN FOREST EAU DE PERFUME',
      description: 'Introducing Rain Forest Eau de Perfume',
      price: '399',
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
    const bgColor = chroma('#f8f4e9').hex(); // Cream
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
        {/* Natural Elements */}
        <div className="absolute inset-0">
          <svg
            className="absolute top-0 left-0 w-1/2 h-1/2 opacity-20"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill={usePrimary}
              d="M44.7,-76.4C58.9,-69.8,71.8,-59.2,79.6,-45.3C87.4,-31.3,90.2,-14.1,88.1,2C86,18.2,79,33.3,69.3,46.5C59.7,59.7,47.4,71,33.2,77.7C19,84.3,2.8,86.3,-12.4,83.5C-27.7,80.8,-42,73.3,-54.3,63C-66.7,52.7,-77.1,39.7,-82.6,24.7C-88.1,9.7,-88.7,-7.3,-83.8,-22C-78.9,-36.7,-68.4,-49.2,-55.6,-56.1C-42.7,-63,-27.5,-64.3,-13.2,-70.5C1.1,-76.7,30.5,-83,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Product Image */}
        <div className="relative z-10">
          <img src={slide.imagesUrl[0]} alt="Product" className="w-48 h-64 object-contain mb-8" />
        </div>

        {/* Text Content */}
        <h2 className="text-4xl font-bold mb-4 text-center">{slide.title}</h2>
        <p className="text-lg mb-6 text-center" style={{ color: chroma(textColor).alpha(0.8).css() }}>{slide.description}</p>
        <a
          href={slide.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-full text-white text-lg"
          style={{ backgroundColor: usePrimary }}
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

export const NewProductTemplate4: NewProductTemplate = {
  id: 'discount-highlight',
  name: 'Discount Highlight',
  coverImageUrl: '/images/image-cover/discount-highlight.png',
  slides: [
    {
      title: 'NEW PRODUCT',
      description: 'Get Discount Up to 50%',
      price: '449',
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
    const bgColor = chroma('#fff').hex(); // White
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
        {/* Natural Elements */}
        <div className="absolute inset-0">
          <svg
            className="absolute top-0 left-0 w-1/3 h-1/3 opacity-20"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill={usePrimary}
              d="M44.7,-76.4C58.9,-69.8,71.8,-59.2,79.6,-45.3C87.4,-31.3,90.2,-14.1,88.1,2C86,18.2,79,33.3,69.3,46.5C59.7,59.7,47.4,71,33.2,77.7C19,84.3,2.8,86.3,-12.4,83.5C-27.7,80.8,-42,73.3,-54.3,63C-66.7,52.7,-77.1,39.7,-82.6,24.7C-88.1,9.7,-88.7,-7.3,-83.8,-22C-78.9,-36.7,-68.4,-49.2,-55.6,-56.1C-42.7,-63,-27.5,-64.3,-13.2,-70.5C1.1,-76.7,30.5,-83,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Product Image */}
        <div className="relative z-10">
          <img src={slide.imagesUrl[0]} alt="Product" className="w-48 h-64 object-contain mb-8" />
        </div>

        {/* Text Content */}
        <h2 className="text-4xl font-bold mb-4 text-center">{slide.title}</h2>
        <p className="text-2xl font-semibold mb-6 text-center" style={{ color: usePrimary }}>{slide.description}</p>
        <a
          href={slide.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-full text-white text-lg"
          style={{ backgroundColor: accentColor }}
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

export const NewProductTemplate5: NewProductTemplate = {
  id: 'minimalist-nature',
  name: 'Minimalist Nature',
  coverImageUrl: '/images/image-cover/minimalist-nature.png',
  slides: [
    {
      title: 'NATURAL ESSENCE',
      description: 'Pure and simple beauty',
      price: '299',
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
    const bgColor = chroma('#f8f4e9').hex(); // Cream
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
        {/* Natural Elements */}
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 left-0 w-full h-1/3 opacity-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill={usePrimary}
            />
          </svg>
        </div>

        {/* Product Image */}
        <div className="relative z-10">
          <img src={slide.imagesUrl[0]} alt="Product" className="w-48 h-64 object-contain mb-8" />
        </div>

        {/* Text Content */}
        <h2 className="text-4xl font-bold mb-4 text-center">{slide.title}</h2>
        <p className="text-lg mb-6 text-center" style={{ color: chroma(textColor).alpha(0.8).css() }}>{slide.description}</p>
        <a
          href={slide.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 rounded-full text-white text-lg"
          style={{ backgroundColor: usePrimary }}
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

export const NewProductTemplate6: NewProductTemplate = {
  id: 'split-layout',
  name: 'Split Layout',
  coverImageUrl: '/images/image-cover/split-layout.png',
  slides: [
    {
      title: 'ORGANIC BEAUTY',
      description: 'Discover the power of nature',
      price: "999",
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
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
        {/* Left Side: Image */}
        <div className="w-1/2 h-full">
          <img src={slide.imagesUrl[0]} alt="Product" className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Text */}
        <div className="w-1/2 h-full flex flex-col justify-center p-16" style={{ backgroundColor: useSecondary }}>
          <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg mb-6" style={{ color: chroma(textColor).alpha(0.8).css() }}>{slide.description}</p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-full text-white text-lg"
            style={{ backgroundColor: usePrimary }}
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

export const NewProductTemplate7: NewProductTemplate = {
  id: 'overlay-text',
  name: 'Overlay Text',
  coverImageUrl: '/images/image-cover/overlay-text.png',
  slides: [
    {
      title: 'LIMITED EDITION',
      description: 'Get yours before it’s gone!',
      price: "1299",
      imagesUrl: ["https://res.cloudinary.com/deuvfylc5/image/upload/v1750066968/product_images/imagesUrl_image_1750066964249.jpg",],
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
    },
  ],
  renderSlide: (slide, addLogo, defaultLogoUrl, colors) => {
    const { logoColors, materialTheme, typography, graphicStyle } = colors;

    const primaryColor = chroma('#4a7c59').hex(); // Forest green
    const secondaryColor = chroma('#e8d7c5').hex(); // Beige
    const accentColor = chroma('#2d3033').hex(); // Dark slate
    const bgColor = chroma('#fff').hex(); // White
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
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.imagesUrl[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.8,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Text Content */}
        <div className="relative z-10 text-center">
          <h2
            className="text-6xl font-extrabold mb-6 text-center leading-tight"
            style={{ color: accentColor }}
          >
            {slide.title}
          </h2>
          <p className="text-xl mb-6">{slide.description}</p>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 rounded-full text-white text-lg"
            style={{ backgroundColor: usePrimary }}
          >
            Shop Now
          </a>
          <a
            href={slide.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm block"
            style={{ color: chroma(textColor).alpha(0.8).css() }}
          >
            {slide.footer}
          </a>
        </div>
      </div>
    );
  },
};

export const NewProductTemplates: NewProductTemplate[] = [
  NewProductTemplate1,

];