import chroma from "chroma-js";
import cn from 'classnames';

export interface TipsSlide {
    title: string;
    description: string;
    imageUrl?: string;
    footer: string;
    websiteUrl: string;
    tips?: any[];
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

export interface TipsTemplate {
    id: string;
    name: string;
    slides: TipsSlide[];
    renderSlide: (slide: TipsSlide, addLogo: boolean, defaultLogoUrl: string, colors: Colors) => JSX.Element;
    coverImageUrl?: string;
}

export const TipsTemplate1: TipsTemplate = {
  id: 'tips-numbered-list',
  name: 'Numbered Tips List',
  coverImageUrl: '/images/image-cover/tips-numbered-list.png',
  slides: [
    {
      title: 'TOP 5 TIPS FOR SUCCESS',
      description: 'Expert Advice for Your Industry',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      tips: [
        'Start with a clear plan to stay focused.',
        'Leverage technology to streamline tasks.',
        'Engage with your audience regularly.',
        'Analyze data to make informed decisions.',
        'Stay updated with industry trends.',
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

        {/* Tips List */}
        <div className="flex-1 flex flex-col justify-center px-12 space-y-6">
          {slide.tips?.map((tip, index) => (
            <div key={index} className="flex items-start space-x-4">
              <span className="text-3xl font-bold" style={{ color: usePrimary }}>
                {index + 1}.
              </span>
              <p className="text-lg">{tip}</p>
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

// Template 22: Tips with Icons and Minimalist Design
export const TipsTemplate2: TipsTemplate = {
  id: 'tips-icons-minimal',
  name: 'Tips with Icons Minimal',
  coverImageUrl: '/images/image-cover/tips-icons-minimal.png',
  slides: [
    {
      title: 'BEST PRACTICES TO THRIVE',
      description: 'Simple Steps to Succeed',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      tips: [
        { text: 'Plan Ahead for Efficiency', icon: '/icons/plan.png' },
        { text: 'Communicate Clearly', icon: '/icons/communicate.png' },
        { text: 'Stay Consistent', icon: '/icons/consistency.png' },
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

        {/* Tips List with Icons */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-8 px-12">
          {slide.tips?.map((tip, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img src={tip.icon} alt="Tip Icon" className="w-12 h-12" />
              <p className="text-lg font-medium">{tip.text}</p>
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
            Get More Tips
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

// Template 23: Tips with Highlighted Backgrounds for Each Tip
export const TipsTemplate3: TipsTemplate = {
  id: 'tips-highlighted',
  name: 'Tips with Highlighted Backgrounds',
  coverImageUrl: '/images/image-cover/tips-highlighted.png',
  slides: [
    {
      title: 'INDUSTRY TIPS TO SUCCEED',
      description: 'Practical Advice for You',
      footer: 'reallygreatsite.com',
      websiteUrl: 'https://reallygreatsite.com',
      tips: [
        'Set clear goals to track progress.',
        'Use tools to automate repetitive tasks.',
        'Build a strong network for support.',
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

        {/* Tips List with Highlighted Backgrounds */}
        <div className="flex-1 flex flex-col justify-center px-12 space-y-6">
          {slide.tips?.map((tip, index) => (
            <div
              key={index}
              className="flex items-center p-4 rounded-lg"
              style={{ backgroundColor: chroma(usePrimary).alpha(0.1).hex() }}
            >
              <span className="text-2xl font-bold mr-4" style={{ color: usePrimary }}>
                {index + 1}.
              </span>
              <p className="text-lg">{tip}</p>
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
            Explore More
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
export const TipsTemplates: TipsTemplate[] = [
    TipsTemplate1,
    TipsTemplate2,
    TipsTemplate3,
];