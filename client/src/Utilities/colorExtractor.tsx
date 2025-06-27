import React, { useEffect } from 'react';
import { usePalette } from 'color-thief-react';
import chroma from 'chroma-js';
import { createRoot } from 'react-dom/client';
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';


interface LogoColors {
  primary: string;
  secondary: string;
  accent: string[];
}

interface ImageColors {
  imageColors: string[];
  glowColor: string;
  complementaryTextColor: string;
  complementaryFooterColor: string;
}

// Default fallback colors
const defaultColors = {
  logoColors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: ['#50E3C2', '#F5A623'],
  },
  imageColors: ['#4A90E2', '#50E3C2'],
  glowColor: '#FF5733', // Default complementary color
  complementaryTextColor: '#FFFFFF',
  complementaryFooterColor: '#E0E0E0',
  ensureContrast: (color1: string, color2: string, minContrast: number = 4.5) => {
    try {
      if (!chroma.valid(color1) || !chroma.valid(color2)) {
        return '#FFFFFF';
      }
      const contrast = chroma.contrast(color1, color2);
      if (contrast < minContrast) {
        const adjusted = chroma(color1).luminance(contrast < minContrast ? 0.7 : 0.3).hex();
        return chroma.contrast(adjusted, color2) >= minContrast ? adjusted : '#FFFFFF';
      }
      return color1;
    } catch (error) {
      console.warn(`ensureContrast error: ${error}`);
      return '#FFFFFF';
    }
  },
  vibrantLogoColor: '#4A90E2',
  vibrantTextColor: '#FFFFFF',
  footerColor: '#50E3C2',
  vibrantAccentColor: '#F5A623',
  backgroundColor: '#FFFFFF',
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '2.5rem',
  },
  graphicStyle: {
    borderRadius: '8px',
    iconStyle: 'sharp',
    filter: 'none',
  },
  materialTheme: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    tertiary: '#F5A623',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
  },
};;


type BrandStyle = 'Modern' | 'Traditional' | 'Playful' | 'Corporate' | 'Minimal' | 'Elegant';

// M3 Typography System
const m3Typography: Record<BrandStyle, { fontFamily: string; fontWeight: number; fontSize: string }> = {
  Modern: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '2.5rem',
  },
  Traditional: {
    fontFamily: 'Merriweather, serif',
    fontWeight: 400,
    fontSize: '2.5rem',
  },
  Playful: {
    fontFamily: 'Comic Neue, sans-serif',
    fontWeight: 400,
    fontSize: '2.5rem',
  },
  Corporate: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: '2.5rem',
  },
  Minimal: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 300,
    fontSize: '2.5rem',
  },
  Elegant: {
    fontFamily: 'Playfair Display, serif',
    fontWeight: 400,
    fontSize: '2.5rem',
  },
};

// M3 Shape System
const m3Shapes: Record<BrandStyle, { borderRadius: string }> = {
  Modern: { borderRadius: '12px' }, // Increased for softer look
  Traditional: { borderRadius: '4px' },
  Playful: { borderRadius: '20px' }, // More rounded for playfulness
  Corporate: { borderRadius: '8px' },
  Minimal: { borderRadius: '6px' }, // Slightly increased for balance
  Elegant: { borderRadius: '10px' }, // Subtle curve for sophistication
};

// Graphic Styles
const graphicStyles: Record<BrandStyle, { borderRadius: string; iconStyle: string; filter: string }> = {
  Modern: {
    borderRadius: m3Shapes.Modern.borderRadius,
    iconStyle: 'sharp',
    filter: 'none',
  },
  Traditional: {
    borderRadius: m3Shapes.Traditional.borderRadius,
    iconStyle: 'outlined',
    filter: 'sepia(0.2)', // Warmer tone for traditional feel
  },
  Playful: {
    borderRadius: m3Shapes.Playful.borderRadius,
    iconStyle: 'rounded',
    filter: 'brightness(1.15) contrast(1.1)', // Slightly refined for vibrancy
  },
  Corporate: {
    borderRadius: m3Shapes.Corporate.borderRadius,
    iconStyle: 'sharp',
    filter: 'contrast(1.15)', // Subtle enhancement
  },
  Minimal: {
    borderRadius: m3Shapes.Minimal.borderRadius,
    iconStyle: 'outlined',
    filter: 'none',
  },
  Elegant: {
    borderRadius: m3Shapes.Elegant.borderRadius,
    iconStyle: 'filled',
    filter: 'brightness(1.05) contrast(1.05)', // Subtle glow for elegance
  },
};

// 1. Logo Color Extractor
export const extractLogoColors = (logoUrl: string): Promise<LogoColors> => {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    let isMounted = true;
    const root = createRoot(container);

    const LogoColorExtractor = ({ onExtracted }: { onExtracted: (colors: LogoColors) => void }) => {
      const { data: palette, error, loading } = usePalette(logoUrl, 6, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10,
      });
      useEffect(() => {

        // Only process when loading is complete
        if (loading) return;

        if (error || !palette) {
          console.error('Logo color extraction failed:', error || 'No palette returned');
          if (isMounted) onExtracted(defaultColors.logoColors);
          return;
        }

        try {
          const sortedColors = palette.length < 6
            ? [...palette, ...defaultColors.logoColors.accent.slice(0, 6 - palette.length)]
            : palette;
          const sortedColorsSorted = sortedColors.sort((a, b) => {
            const satA = chroma(a).hsl()[1];
            const satB = chroma(b).hsl()[1];
            return satB - satA;
          });
          const primary = sortedColorsSorted[0] || defaultColors.logoColors.primary;
          const secondary = sortedColorsSorted[1] || chroma(primary).set('hsl.l', 0.4).hex();
          const accent = sortedColorsSorted.slice(2, 5).length > 0 ? sortedColorsSorted.slice(2, 5) : defaultColors.logoColors.accent;
          if (isMounted) onExtracted({ primary, secondary, accent });
        } catch (err) {
          console.error('Error processing logo colors:', err);
          if (isMounted) onExtracted(defaultColors.logoColors);
        }

        return () => {
          isMounted = false;
        };
      }, [palette, error, loading]);

      return null;
    };

    root.render(
      <LogoColorExtractor
        onExtracted={(colors) => {
          resolve(colors);
          setTimeout(() => {
            if (isMounted && document.body.contains(container)) {
              root.unmount();
              document.body.removeChild(container);
            }
          }, 200); // Increased delay for safety
        }}
      />
    );

    setTimeout(() => {
      if (isMounted && document.body.contains(container)) {
        root.unmount();
        document.body.removeChild(container);
        reject(new Error('Logo color extraction timed out'));
      }
    }, 10000); // Increased timeout for slow networks
  });
};

const selectVibrantColor = (colors: string[]): string => {
  if (!colors || colors.length === 0) return '#6200EA'; // Fallback color
  return colors.reduce((mostVibrant, color) => {
    if (!chroma.valid(color)) return mostVibrant;
    const [h, s, l] = chroma(color).hsl();
    const [hMost, sMost, lMost] = chroma(mostVibrant).hsl();
    const vibrancy = s * (1 - Math.abs(l - 0.5));
    const vibrancyMost = sMost * (1 - Math.abs(lMost - 0.5));
    return vibrancy > vibrancyMost ? color : mostVibrant;
  }, colors[0]);
};


// 2. Image Color Extractor
export const extractImageColors = (imageUrl: string): Promise<ImageColors> => {
  return new Promise((resolve, reject) => {
    // Validate image URL

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    let isMounted = true;
    const root = createRoot(container);

    const ImageColorExtractor = ({ onExtracted }: {
      onExtracted: (colors: {
        imageColors: string[];
         glowColor: string;
        complementaryTextColor: string;
        complementaryFooterColor: string;

      }) => void
    }) => {
      const { data: palette, error, loading } = usePalette(imageUrl, 3, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10, // Higher quality for faster processing
      });

      useEffect(() => {

        if (loading) return;


        if (!isMounted) {
          return;
        }

        if (error || !palette || !Array.isArray(palette) || palette.length === 0 || palette.some(color => !chroma.valid(color))) {
          console.error('Image color extraction failed:', error || 'Invalid or no palette returned', { palette });
          onExtracted({
            imageColors: defaultColors.imageColors,
            glowColor: defaultColors.glowColor,
            complementaryTextColor: defaultColors.complementaryTextColor,
            complementaryFooterColor: defaultColors.complementaryFooterColor

          });
          return;
        }

        try {

          const sortedColors = palette.length < 3
            ? [...palette, ...defaultColors.imageColors.slice(0, 3 - palette.length)]
            : palette;
          const sortedColorsSorted = sortedColors.sort((a, b) => {
            const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
            const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
            return vibrancyB - vibrancyA;
          });

          const vibrantImageColor = selectVibrantColor(sortedColorsSorted);
          const glowColor = chroma(vibrantImageColor).luminance(0.7).hex();
          const complementaryTextColor = defaultColors.ensureContrast(
            chroma(vibrantImageColor).set('hsl.h', '+180').luminance(0.8).hex(),
            defaultColors.backgroundColor,
            4.5
          );
          const complementaryFooterColor = defaultColors.ensureContrast(
            chroma(vibrantImageColor).set('hsl.h', '+180').set('hsl.s', '*0.5').luminance(0.6).hex(),
            defaultColors.backgroundColor,
            4.5
          );


          const extractedColors = {
            imageColors: sortedColorsSorted,
            glowColor: glowColor,
            complementaryTextColor: complementaryTextColor,
            complementaryFooterColor: complementaryFooterColor
          };
          onExtracted(extractedColors);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error('Error processing image colors:', errorMessage, err instanceof Error ? err.stack : undefined);
          onExtracted({
            imageColors: defaultColors.imageColors,
            glowColor: defaultColors.glowColor,
            complementaryTextColor: defaultColors.complementaryTextColor,
            complementaryFooterColor: defaultColors.complementaryFooterColor
          });
        }

        return () => {
          isMounted = false;
        };
      }, [palette, error, loading]);

      return null;
    };

    root.render(
      <ImageColorExtractor
        onExtracted={(colors) => {
          resolve(colors);
          setTimeout(() => {
            if (isMounted && document.body.contains(container)) {

              root.unmount();
              document.body.removeChild(container);
            }
          }, 1000); // Increased delay
        }}
      />
    );

    setTimeout(() => {
      if (isMounted && document.body.contains(container)) {
        root.unmount();
        document.body.removeChild(container);
        reject(new Error('Image color extraction timed out after 30 seconds'));
      }
    }, 10000); // Increased timeout
  });
};

interface BrandStyleInterface {
    safeBrandStyle?: string;
  typography: { fontFamily: string; fontWeight: number; fontSize: string };
  graphicStyle: { borderRadius: string; iconStyle: string; filter: string };
}


export const BrandStyle = async (brandStyle: string): Promise<BrandStyleInterface> => {
  const safeBrandStyle = (Object.keys(m3Typography) as BrandStyle[]).includes(brandStyle as BrandStyle)
    ? (brandStyle as BrandStyle)
    : 'Modern';
  const typography = m3Typography[safeBrandStyle];
  const graphicStyle = graphicStyles[safeBrandStyle];
  return {safeBrandStyle, typography, graphicStyle}
};


export const checkLogoContrast = (
  imageColors: string[],
  logoPrimaryColor: string,
  glowColor: string
): {
  needsEnhancement: boolean;
  suggestedGradient: string;
  suggestedLogoEffect: { background?: string; border?: string; shadow?: string };
} => {
  let needsEnhancement = false;
  let suggestedGradient = 'none';
  let suggestedLogoEffect: { background?: string; border?: string; shadow?: string } = {};

  if (logoPrimaryColor && chroma.valid(logoPrimaryColor) && imageColors.every(color => chroma.valid(color))) {
    const minContrast = 4.5; // WCAG AA standard for text
    const contrasts = imageColors.map(color => {
      const ratio = chroma.contrast(logoPrimaryColor, color);
      console.log(`Contrast ratio: ${logoPrimaryColor} vs ${color} = ${ratio.toFixed(2)}`);
      return ratio;
    });

    if (contrasts.every(ratio => ratio < minContrast)) {
      needsEnhancement = true;
      // Suggest a gradient overlay (dark at top-right for logo placement)
      suggestedGradient = `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, transparent 70%)`;
      // Suggest logo enhancements
      suggestedLogoEffect = {
        background: chroma('#FFFFFF').alpha(0.8).css(), // Semi-transparent white background
        border: `2px solid ${chroma(glowColor).hex()}`, // Gold border using glowColor
        shadow: `0 4px 8px rgba(0,0,0,0.3)`, // Subtle shadow
      };
    }
  } else {
    console.warn('Invalid colors provided for contrast check:', { logoPrimaryColor, imageColors });
  }

  return {
    needsEnhancement,
    suggestedGradient,
    suggestedLogoEffect,
  };
};