import React from 'react';
import { imageTemplates } from '../templetes/ImageTemplate';
import { carouselTemplates, Slide } from '../templetes/templetesDesign';
import { doYouKnowTemplates, DoYouKnowSlide } from '../templetes/doYouKnowTemplates';
import { useGenerateImageContentMutation, useImageContentMutation, useGenerateImageMutation, useSavePostsMutation, useUploadImageToCloudinaryMutation, useGenerateCarouselMutation, useCarouselContentMutation, useUploadCarouselToCloudinaryMutation, useGenerateDoYouKnowMutation, useDykContentMutation } from '../store/api';
import { ImageContent, Post, CarouselContent } from '../components/content/AutoPost/Types';
import { usePalette } from 'color-thief-react';
import chroma from 'chroma-js';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { useAlert } from '../components/hooks/useAlert';
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

// Define BrandStyle type
// Define BrandStyle type with a new 'Elegant' option
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

// Helper Functions
const generateM3Theme = (sourceColor: string) => {
  try {
    // Validate hex color
    if (!/^#[0-9A-Fa-f]{6}$/.test(sourceColor)) {
      throw new Error('Invalid hex color');
    }
    const argbColor = argbFromHex(sourceColor);
    const theme = themeFromSourceColor(argbColor);
    const lightScheme = theme.schemes.light;

    return {
      primary: `#${lightScheme.primary.toString(16).padStart(6, '0')}`,
      secondary: `#${lightScheme.secondary.toString(16).padStart(6, '0')}`,
      tertiary: `#${lightScheme.tertiary.toString(16).padStart(6, '0')}`,
      background: `#${lightScheme.background.toString(16).padStart(6, '0')}`,
      surface: `#${lightScheme.surface.toString(16).padStart(6, '0')}`,
      onPrimary: `#${lightScheme.onPrimary.toString(16).padStart(6, '0')}`,
      onSecondary: `#${lightScheme.onSecondary.toString(16).padStart(6, '0')}`,
      onBackground: `#${lightScheme.onBackground.toString(16).padStart(6, '0')}`,
      onSurface: `#${lightScheme.onSurface.toString(16).padStart(6, '0')}`,
    };
  } catch (error) {
    console.error('Error generating M3 theme:', error);
    // Fallback to a neutral theme
    const fallbackColor = chroma.valid(sourceColor) ? sourceColor : '#6200EA';
    return {
      primary: fallbackColor,
      secondary: chroma(fallbackColor).set('hsl.l', 0.5).hex(),
      tertiary: chroma(fallbackColor).set('hsl.h', '+30').hex(),
      background: '#FFFFFF',
      surface: '#FAFAFA',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#1C2526',
      onSurface: '#1C2526',
    };
  }
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

const ensureContrast = (textColor: string, bgColor: string, minContrast: number = 4.5) => {
  if (!chroma.valid(textColor) || !chroma.valid(bgColor)) {
    return '#FFFFFF'; // Fallback to white if invalid colors
  }
  let adjustedColor = textColor;
  let contrast = chroma.contrast(adjustedColor, bgColor);

  // Adjust luminance until contrast meets minimum requirement
  while (contrast < minContrast && adjustedColor !== '#000000' && adjustedColor !== '#FFFFFF') {
    const currentLuminance = chroma(adjustedColor).luminance();
    adjustedColor = chroma(adjustedColor)
      .luminance(currentLuminance + (contrast < minContrast ? 0.1 : -0.1))
      .hex();
    contrast = chroma.contrast(adjustedColor, bgColor);
  }

  // Final fallback to white or black if contrast still insufficient
  if (contrast < minContrast) {
    const whiteContrast = chroma.contrast('#FFFFFF', bgColor);
    const blackContrast = chroma.contrast('#000000', bgColor);
    return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
  }

  return adjustedColor;
};

// Capture and Upload Screenshot
const captureAndUploadScreenshot = async (
  ref: HTMLDivElement | null,
  topic: string,
  type: string,
  mutations: {
    uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0];
  }
) => {
  if (!ref) return '';
  await new Promise((resolve) => setTimeout(resolve, 500));
  const canvas = await html2canvas(ref, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
    width: 1080,
    height: 1080,
  });
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
  const formData = new FormData();
  formData.append('image', blob, `${topic}-${type}.png`);
  const result = await mutations.uploadImageToCloudinary(formData).unwrap();
  return result?.data?.secure_url || '';
};

// Shuffle utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
const validatedImageTemplates=  imageTemplates ;

// Initialize shuffled templates
let shuffledTemplates = shuffleArray(validatedImageTemplates);
// Maintain shuffled queue (global or in a state management system)

let currentIndex = 0;

export const generateImagePost = async (
  topic: string,
  type: 'image',
  postContentId: string,
  mutations: {
    generateImageContent: ReturnType<typeof useGenerateImageContentMutation>[0];
    generateImage: ReturnType<typeof useGenerateImageMutation>[0];
    imageContent: ReturnType<typeof useImageContentMutation>[0];
    savePosts: ReturnType<typeof useSavePostsMutation>[0];
    uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0];
  },
  userLogo?: string,
  brandStyle: BrandStyle = 'Modern',
  showAlert?: ReturnType<typeof useAlert>['showAlert']
): Promise<Post> => {
  let newPost: Post;
  let screenshotUrl: string | undefined;

  try {
    console.log('Starting generateImagePost', { topic, postContentId, type, userLogo, brandStyle });

    // Validate imageTemplates
    console.log('Available templates:', validatedImageTemplates.map(t => t.id));
    if (validatedImageTemplates.length === 0) {
      throw new Error('No image templates available');
    }

    // Select template
    if (currentIndex >= shuffledTemplates.length) {
      shuffledTemplates = shuffleArray(validatedImageTemplates);
      currentIndex = 0;
    }
    const randomTemplate = shuffledTemplates[currentIndex];
    currentIndex++;
    console.log('Selected template:', randomTemplate.id);

    // Generate content
    const contentRes = await mutations.generateImageContent({ topic }).unwrap();
    const generatedContent = contentRes.data;
    console.log('Generated content:', generatedContent);

    const imageUrl = 'https://res.cloudinary.com/deuvfylc5/image/upload/v1747125324/hdwulgzqmmmqtpxzsuoh.png';

    const newImageSlide: ImageContent = {
      title: generatedContent.title || randomTemplate.slides[0].title || 'Default Title',
      description: generatedContent.description || randomTemplate.slides[0].description || 'Default Description',
      footer: randomTemplate.slides[0].footer || 'bitrox.tech',
      websiteUrl: randomTemplate.slides[0].websiteUrl || 'https://bitrox.tech',
      imageUrl: imageUrl,
    };

    // Save image content
    const imageResult = await mutations.imageContent({
      postContentId,
      topic,
      templateId: randomTemplate.id,
      content: newImageSlide,
      hashtags: generatedContent?.hashtags,
      status: 'success',
    }).unwrap();
    console.log('Image content saved:', imageResult);

    newPost = {
      topic,
      type,
      content: newImageSlide,
      templateId: randomTemplate.id,
      status: 'success',
      contentId: imageResult.data._id,
      contentType: 'ImageContent',
    };

    // Color extraction
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1080px';
    tempContainer.style.height = '1080px';
    document.body.appendChild(tempContainer);

    const ColorExtractor = ({
      logoUrl,
      imageUrl,
      onColorsExtracted,
    }: {
      logoUrl: string;
      imageUrl: string;
      onColorsExtracted: (colors: {
        logoColors: { primary: string; secondary: string; accent: string[] };
        imageColors: string[];
        glowColor: string;
        complementaryGlowColor: string;
      }) => void;
    }) => {
      const { data: logoPalette, error: logoError, loading: logoLoading } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const { data: imagePalette, error: imageError, loading: imageLoading } = usePalette(imageUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });

      React.useEffect(() => {
        if (logoError || imageError) {
          console.error('Color extraction error:', { logoError, imageError });
          onColorsExtracted({
            logoColors: {
              primary: '#6200EA',
              secondary: '#03DAC6',
              accent: ['#BB86FC', '#FF0266', '#FF5733'],
            },
            imageColors: ['#FF5733', '#33FF57', '#3357FF'],
            glowColor: '#FF5733',
            complementaryGlowColor: '#33CCA8',
          });
          return;
        }
        if (logoPalette && imagePalette && !logoLoading && !imageLoading) {
          const sortedLogoColors = logoPalette.sort((a, b) => {
            const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
            const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
            return vibrancyB - vibrancyA;
          });
          const sortedImageColors = imagePalette.sort((a, b) => {
            const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
            const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
            return vibrancyB - vibrancyA;
          });
          const logoColors = {
            primary: sortedLogoColors[0],
            secondary: sortedLogoColors[1] || chroma(sortedLogoColors[0]).set('hsl.l', 0.3).hex(),
            accent: sortedLogoColors.slice(2).length > 0 ? sortedLogoColors.slice(2) : ['#BB86FC', '#FF0266', '#FF5733'],
          };
          const glowColor = selectVibrantColor(sortedImageColors);
          const complementaryGlowColor = chroma(glowColor).set('hsl.h', '+180').hex();
          onColorsExtracted({
            logoColors,
            imageColors: sortedImageColors,
            glowColor,
            complementaryGlowColor,
          });
        }
      }, [logoPalette, imagePalette, logoError, imageError, logoLoading, imageLoading]);

      return null;
    };

    const colors = await new Promise<{
      logoColors: { primary: string; secondary: string; accent: string[] };
      imageColors: string[];
      glowColor: string;
      complementaryGlowColor: string;
    }>((resolve, reject) => {
      const tempRoot = createRoot(tempContainer);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrl={imageUrl}
          onColorsExtracted={(extractedColors) => {
            console.log('Extracted Colors:', extractedColors);
            resolve(extractedColors);
            setTimeout(() => {
              tempRoot.unmount();
              document.body.removeChild(tempContainer);
            }, 0);
          }}
        />
      );
      setTimeout(() => reject(new Error('Color extraction timed out')), 10000);
    });

    // Generate theme
    const materialTheme = generateM3Theme(colors.logoColors.primary);
    console.log('Material Theme:', materialTheme);

    // Normalize theme colors
    const normalizeHex = (color: string): string => {
      if (color.length === 9 && color.startsWith('#ff')) {
        return `#${color.slice(3, 9)}`;
      }
      return chroma.valid(color) ? color : '#FFFFFF';
    };

    let vibrantLogoColor: string;
    let vibrantTextColor: string;
    let backgroundColor: string;
    let footerColor: string;

    try {
      vibrantLogoColor = normalizeHex(materialTheme.primary);
      vibrantTextColor = ensureContrast(
        normalizeHex(materialTheme.onSurface),
        normalizeHex(materialTheme.background)
      );
      backgroundColor = normalizeHex(materialTheme.background);
      footerColor = normalizeHex(materialTheme.secondary);
    } catch (error) {
      console.error('Error processing theme colors:', error);
      vibrantLogoColor = '#6200EA';
      vibrantTextColor = '#1C2526';
      backgroundColor = '#FFFFFF';
      footerColor = '#03DAC6';
    }

    console.log('Theme Colors:', { vibrantLogoColor, vibrantTextColor, backgroundColor, footerColor });

    const typography = m3Typography[brandStyle] || m3Typography.Modern;
    const graphicStyle = graphicStyles[brandStyle] || graphicStyles.Modern;
    console.log('Typography and Graphic Style:', { typography, graphicStyle });

    // Render slide
    const slide = newPost.content as ImageContent;
    console.log('Slide Data:', slide);

    // Validate template
    const template = validatedImageTemplates.find((t) => t.id === newPost.templateId) || validatedImageTemplates[0];
    if (!template || !template.renderSlide) {
      console.error('Invalid template:', newPost.templateId);
      throw new Error(`Invalid template: ${newPost.templateId}`);
    }
    console.log('Rendering slide for template:', template.id);

    // Validate slide and colors
    if (!slide.title || !slide.description || !slide.imageUrl) {
      console.warn('Incomplete slide data, using fallbacks', slide);
      slide.title = slide.title || 'Default Title';
      slide.description = slide.description || 'Default Description';
      slide.imageUrl = slide.imageUrl || '/images/background20.jpg';
      slide.footer = slide.footer || 'bitrox.tech';
      slide.websiteUrl = slide.websiteUrl || 'https://bitrox.tech';
    }

     console.log('Slide Data:', slide);

    const defaultLogoUrl = userLogo || '/images/Logo1.png';

    let slideElement: JSX.Element;
    try {
      slideElement = template.renderSlide(
        { ...slide, footer: slide.footer || '', websiteUrl: slide.websiteUrl || '' },
        true,
        defaultLogoUrl,
        {
          logoColors: {
            primary: colors.logoColors.primary,
            secondary: colors.logoColors.secondary,
            accent: colors.logoColors.accent.length > 0 ? colors.logoColors.accent : ['#BB86FC', '#FF0266', '#FF5733'],
          },
          imageColors: colors.imageColors,
          glowColor: colors.glowColor,
          complementaryGlowColor: colors.complementaryGlowColor,
          ensureContrast: (color1, color2) => {
            try {
              return ensureContrast(color1, color2);
            } catch (error) {
              console.error('ensureContrast error:', error);
              return color1; // Fallback to input color
            }
          },
          vibrantLogoColor,
          vibrantTextColor,
          footerColor,
          backgroundColor,
          typography,
          graphicStyle,
          materialTheme,
        }
      );
      console.log('Slide Element Rendered:', slideElement.type, slideElement.props);
    } catch (error) {
      console.error('Error rendering slide:', error);
      throw new Error(`Failed to render slide: ${(error as Error).message}`);
    }

    // Capture screenshot
    const tempContainerSlide = document.createElement('div');
    tempContainerSlide.style.position = 'absolute';
    tempContainerSlide.style.top = '-9999px';
    tempContainerSlide.style.width = '1080px';
    tempContainerSlide.style.height = '1080px';
    document.body.appendChild(tempContainerSlide);

    const rootImage = createRoot(tempContainerSlide);
    try {
      rootImage.render(slideElement);
      console.log('Slide Element Mounted');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      screenshotUrl = await captureAndUploadScreenshot(tempContainerSlide, topic, type, {
        uploadImageToCloudinary: mutations.uploadImageToCloudinary,
      });
      console.log('Screenshot URL:', screenshotUrl);
    } catch (error) {
      console.error('Error during rendering or screenshot:', error);
      throw new Error(`Failed to render or capture screenshot: ${(error as Error).message}`);
    } finally {
      rootImage.unmount();
      document.body.removeChild(tempContainerSlide);
    }

    // Save post
    if (screenshotUrl) {
      const savePostResult = await mutations.savePosts({
        postContentId,
        topic,
        type: 'image',
        status: 'success',
        images: [{ url: screenshotUrl, label: 'Image Post' }],
        contentId: imageResult.data._id,
        contentType: 'ImageContent',
      }).unwrap();
      console.log('Post saved:', savePostResult);
      newPost.images = [{ url: screenshotUrl, label: 'Image Post' }];
    } else {
      console.warn('No screenshot URL generated, skipping savePosts');
      newPost.status = 'error';
    }

    return newPost;
  } catch (error) {
    const errorMessage = (error as any)?.data?.message || `An unexpected error occurred while generating the image post: ${(error as Error).message}`;
    console.error('Error in generateImagePost:', error);
    if (showAlert) {
      showAlert({
        type: 'error',
        title: 'Failed to Generate Image Post',
        message: errorMessage,
      });
    }
    throw error;
  }
};


export const generateDoYouKnowPost = async (
  topic: string,
  type: 'doyouknow',
  postContentId: string,
  mutations: {
    generateDoYouKnow: ReturnType<typeof useGenerateDoYouKnowMutation>[0];
    dykContent: ReturnType<typeof useDykContentMutation>[0];
    savePosts: ReturnType<typeof useSavePostsMutation>[0];
    uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0];
  },
  showAlert: ReturnType<typeof useAlert>['showAlert'],
  userLogo?: string,
  brandStyle: BrandStyle = 'Modern',
  competitorImageUrl?: string
): Promise<Post> => {
  let newPost: Post;
  let screenshotUrl: string | undefined;

  try {
    console.log(`Generating Do You Know post with topic: ${topic}, postContentId: ${postContentId}`);

    // Select random DYK template
    const randomDoYouKnowTemplateIndex = Math.floor(Math.random() * doYouKnowTemplates.length);
    const randomDoYouKnowTemplate = doYouKnowTemplates[randomDoYouKnowTemplateIndex];

    // Generate DYK content via API
    const doYouKnowResponse = await mutations.generateDoYouKnow({ topic }).unwrap();
    const generatedDoYouKnowContent = doYouKnowResponse.data;

    // Create new DYK slide
    const newDoYouKnowSlide: DoYouKnowSlide = {
      title: generatedDoYouKnowContent.title || randomDoYouKnowTemplate.slides[0].title,
      fact: generatedDoYouKnowContent.description || randomDoYouKnowTemplate.slides[0].fact,
      footer: randomDoYouKnowTemplate.slides[0].footer || '',
      websiteUrl: randomDoYouKnowTemplate.slides[0].websiteUrl || '',
      imageUrl: randomDoYouKnowTemplate.slides[0].imageUrl || '',
      slideNumber: 1,
    };

    // Save DYK content
    const dykResult = await mutations.dykContent({
      postContentId,
      topic,
      templateId: randomDoYouKnowTemplate.id,
      content: { title: generatedDoYouKnowContent.title, fact: generatedDoYouKnowContent.description },
      hashtags: generatedDoYouKnowContent?.hashtags,
      status: 'success',
    }).unwrap();

    // Create new post object
    newPost = {
      topic,
      type,
      content: newDoYouKnowSlide,
      templateId: randomDoYouKnowTemplate.id,
      status: 'success',
      contentId: dykResult.data._id,
      contentType: 'DoyouknowContent',
    };

    // Extract colors from logo and slide image
    const tempContainerColor = document.createElement('div');
    tempContainerColor.style.position = 'absolute';
    tempContainerColor.style.top = '-9999px';
    tempContainerColor.style.width = '1080px';
    tempContainerColor.style.height = '1080px';
    document.body.appendChild(tempContainerColor);

    const ColorExtractor = ({
      logoUrl,
      imageUrl,
      competitorUrl,
      onColorsExtracted,
    }: {
      logoUrl: string;
      imageUrl: string;
      competitorUrl?: string;
      onColorsExtracted: (colors: {
        logoColors: { primary: string; secondary: string; accent: string[] };
        imageColors: string[];
        competitorColors?: string[];
      }) => void;
    }) => {
      const { data: logoPalette } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const { data: imagePalette } = usePalette(imageUrl || '', 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const { data: competitorPalette } = usePalette(competitorUrl || '', 5, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10,
      });

      React.useEffect(() => {
        if (logoPalette) {
          const sortedLogoColors = logoPalette.sort((a, b) => {
            const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
            const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
            return vibrancyB - vibrancyA;
          });
          const logoColors = {
            primary: sortedLogoColors[0],
            secondary: sortedLogoColors[1] || chroma(sortedLogoColors[0]).set('hsl.l', 0.3).hex(),
            accent: sortedLogoColors.slice(2),
          };
          onColorsExtracted({
            logoColors,
            imageColors: imagePalette || [materialTheme.background, materialTheme.surface],
            competitorColors: competitorPalette,
          });
        }
      }, [logoPalette, imagePalette, competitorPalette]);

      return null;
    };

    const materialTheme = generateM3Theme('#4A90E2'); // Fallback theme for initial use
    const colors = await new Promise<{
      logoColors: { primary: string; secondary: string; accent: string[] };
      imageColors: string[];
      competitorColors?: string[];
    }>((resolve) => {
      const tempRoot = createRoot(tempContainerColor);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrl={newDoYouKnowSlide.imageUrl || ''}
          competitorUrl={competitorImageUrl}
          onColorsExtracted={(extractedColors) => {
            resolve(extractedColors);
            setTimeout(() => {
              tempRoot.unmount();
              document.body.removeChild(tempContainerColor);
            }, 0);
          }}
        />
      );
    });

    console.log('Extracted Colors:', colors);

    // Generate M3 theme from logo's primary color
    const finalMaterialTheme = generateM3Theme(colors.logoColors.primary);
    const mappedPalette = colors.competitorColors
      ? mapCompetitorPalette(colors.competitorColors, colors.logoColors)
      : colors.logoColors;

    const typography = m3Typography[brandStyle] || m3Typography.Modern;
    const graphicStyle = graphicStyles[brandStyle] || graphicStyles.Modern;

    // Render DYK slide with extracted colors
    const tempContainerDYK = document.createElement('div');
    tempContainerDYK.style.position = 'absolute';
    tempContainerDYK.style.top = '-9999px';
    tempContainerDYK.style.width = '1080px';
    tempContainerDYK.style.height = '1080px';
    document.body.appendChild(tempContainerDYK);

    const vibrantTextColor = ensureContrast(finalMaterialTheme.onSurface, finalMaterialTheme.background);
    const vibrantAccentColor = colors.imageColors.length > 0 ? selectVibrantColor(colors.imageColors) : finalMaterialTheme.secondary;
    const footerColor = finalMaterialTheme.secondary;
    const backgroundColor = finalMaterialTheme.background;

    const doYouKnowTemplate = doYouKnowTemplates.find((t) => t.id === randomDoYouKnowTemplate.id) || doYouKnowTemplates[0];
    const doYouKnowSlideElement = doYouKnowTemplate.renderSlide(
      newDoYouKnowSlide,
      true,
      userLogo || '/images/Logo1.png',
      {
        logoColors: mappedPalette,
        imageColors: colors.imageColors,
        ensureContrast,
        vibrantLogoColor: finalMaterialTheme.primary,
        vibrantTextColor,
        footerColor,
        vibrantAccentColor,
        backgroundColor,
        typography,
        graphicStyle,
        materialTheme: finalMaterialTheme,
      }
    );

    const root = createRoot(tempContainerDYK);
    root.render(doYouKnowSlideElement);

    // Capture and upload screenshot
    screenshotUrl = await captureAndUploadScreenshot(tempContainerDYK, topic, type, {
      uploadImageToCloudinary: mutations.uploadImageToCloudinary,
    });

    document.body.removeChild(tempContainerDYK);
    root.unmount();

    // Save post with screenshot
    if (screenshotUrl) {
      await mutations.savePosts({
        postContentId,
        topic,
        type: 'doyouknow',
        status: 'success',
        images: [{ url: screenshotUrl, label: 'Did You Know?' }],
        contentId: dykResult.data._id,
        contentType: 'DYKContent',
      }).unwrap();
      newPost.images = [{ url: screenshotUrl, label: 'Did You Know?' }];
    } else {
      throw new Error('Failed to capture or upload screenshot');
    }

    return newPost;
  } catch (error) {
    const errorMessage = (error as any)?.data?.message || 'An unexpected error occurred while generating the Do You Know post.';
    showAlert({
      type: 'error',
      title: 'Failed to Generate Do You Know Post',
      message: errorMessage,
    });
    throw error;
  }
};

export const generateCarouselPost = async (
  topic: string,
  type: 'carousel',
  postContentId: string,
  mutations: {
    generateCarousel: ReturnType<typeof useGenerateCarouselMutation>[0];
    carouselContent: ReturnType<typeof useCarouselContentMutation>[0];
    savePosts: ReturnType<typeof useSavePostsMutation>[0];
    uploadCarouselToCloudinary: ReturnType<typeof useUploadCarouselToCloudinaryMutation>[0];
  },
  showAlert: ReturnType<typeof useAlert>['showAlert'],
  userLogo?: string,
  brandStyle: BrandStyle = 'Modern'
): Promise<Post> => {
  let newPost: Post;
  let tempContainer: HTMLDivElement | null = null;
  let tempRoot: ReturnType<typeof createRoot> | null = null;

  try {
    console.log(`Generating carousel post with topic: ${topic}, postContentId: ${postContentId}`);

    // Validate carouselTemplates
    if (!carouselTemplates.length) {
      throw new Error('No carousel templates available');
    }
    const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
    const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];
    console.log('Selected Template:', randomCarouselTemplate.id);

    // Generate carousel content via API
    const carouselResponse = await mutations.generateCarousel({ topic }).unwrap();
    const generatedCarouselContent: CarouselContent[] = carouselResponse.data || [];
    console.log('Generated Carousel Content:', generatedCarouselContent);

    // Map generated content to slides
    const newSlides: Slide[] = randomCarouselTemplate.slides.map((slide, index) => {
      const content = generatedCarouselContent[index] || {};
      let formattedDescription = content.description || slide.description || '';

      if (formattedDescription.trim().match(/^\d+\./)) {
        formattedDescription = formattedDescription
          .split(/,\s*\d+\./)
          .map((item, i) => {
            const cleanItem = item.replace(/^\s*\d+\.\s*/, '').trim();
            return i === 0 ? cleanItem : `${i + 1}. ${cleanItem}`;
          })
          .join('\n')
          .replace(/^\s+/, '');
      }

      return {
        ...slide,
        tagline: content.tagline || slide.tagline || '',
        title: content.title || slide.title || '',
        description: formattedDescription,
        imageUrl: slide.imageUrl || '/images/background3.png',
        footer: slide.footer || 'example',
        websiteUrl: slide.websiteUrl || 'https://example.com',
      };
    });
    console.log('New Slides:', newSlides);

    // Extract content for saving
    const extractedContent = generatedCarouselContent.map((content) => ({
      tagline: content.tagline || '',
      title: content.title || '',
      description: content.description || '',
    }));

    // Save carousel content
    const carouselResult = await mutations.carouselContent({
      postContentId,
      topic,
      templateId: randomCarouselTemplate.id,
      content: extractedContent,
      status: 'success',
    }).unwrap();
    console.log('Carousel Content Upload:', carouselResult);

    // Create new post object
    newPost = {
      topic,
      type,
      content: newSlides.map((slide) => ({
        ...slide,
        description: slide.description || '',
      })),
      templateId: randomCarouselTemplate.id,
      status: 'success',
      contentId: carouselResult.data._id,
      contentType: 'CarouselContent',
    };
    console.log('New Post:', newPost);

    // Preload images
    const preloadImages = async (urls: string[]) => {
      const promises = urls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              console.log(`Image loaded: ${url}`);
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${url}, using fallback`);
              resolve();
            };
          })
      );
      await Promise.all(promises);
    };

    const imageUrls = newSlides
      .map((slide) => slide.imageUrl || '/images/background3.png')
      .concat(userLogo || '/images/Logo1.png');
    await preloadImages(imageUrls);
    console.log('Images preloaded');

    // Extract colors for logo and slides
    tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1080px';
    tempContainer.style.height = '1080px';
    document.body.appendChild(tempContainer);

    const ColorExtractor = ({
      logoUrl,
      imageUrls,
      onColorsExtracted,
    }: {
      logoUrl: string;
      imageUrls: string[];
      onColorsExtracted: (colors: {
        logoColors: { primary: string; secondary: string; accent: string[] };
        slideImageColors: string[][];
      }) => void;
    }) => {
      const { data: logoPalette, error: logoError, loading: logoLoading } = usePalette(logoUrl, 5, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10,
      });
      const slidePalettes = imageUrls.map((url) => {
        const { data, error, loading } = usePalette(url, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
        if (error) console.error(`Error extracting palette for ${url}:`, error);
        return { data, error, loading };
      });

      React.useEffect(() => {
        if (logoError || slidePalettes.some((p) => p.error)) {
          console.error('Color extraction error:', { logoError, slideErrors: slidePalettes.map((p) => p.error) });
          onColorsExtracted({
            logoColors: {
              primary: '#4A90E2',
              secondary: '#50E3C2',
              accent: ['#50E3C2', '#FF0266', '#FF5733'],
            },
            slideImageColors: imageUrls.map(() => ['#4A90E2', '#50E3C2', '#F5A623']),
          });
          return;
        }
        if (logoPalette && slidePalettes.every((p) => p.data && !p.loading)) {
          const sortedLogoColors = logoPalette.sort((a, b) => {
            const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
            const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
            return vibrancyB - vibrancyA;
          });
          const logoColors = {
            primary: sortedLogoColors[0] || '#4A90E2',
            secondary: sortedLogoColors[1] || chroma(sortedLogoColors[0]).set('hsl.l', 0.3).hex() || '#50E3C2',
            accent: sortedLogoColors.slice(2).length > 0 ? sortedLogoColors.slice(2) : ['#50E3C2', '#FF0266', '#FF5733'],
          };
          const slideImageColors = slidePalettes.map((p) =>
            p.data!.sort((a, b) => {
              const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
              const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
              return vibrancyB - vibrancyA;
            })
          );
          onColorsExtracted({
            logoColors,
            slideImageColors,
          });
        }
      }, [logoPalette, ...slidePalettes.map((p) => p.data), logoError, logoLoading]);

      return null;
    };

    const colors = await new Promise<{
      logoColors: { primary: string; secondary: string; accent: string[] };
      slideImageColors: string[][];
    }>((resolve, reject) => {
      tempRoot = createRoot(tempContainer!);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrls={newSlides.map((slide) => slide.imageUrl || '/images/background3.png')}
          onColorsExtracted={(extractedColors) => {
            console.log('Extracted Colors:', extractedColors);
            resolve(extractedColors);
            setTimeout(() => {
              tempRoot!.unmount();
              document.body.removeChild(tempContainer!);
              tempContainer = null;
              tempRoot = null;
            }, 0);
          }}
        />
      );
      setTimeout(() => reject(new Error('Color extraction timed out')), 8000);
    });
    console.log('Colors Extracted:', colors);

    // Validate colors
    const validatedColors = {
      logoColors: {
        primary: chroma.valid(colors.logoColors.primary) ? colors.logoColors.primary : '#4A90E2',
        secondary: chroma.valid(colors.logoColors.secondary) ? colors.logoColors.secondary : '#50E3C2',
        accent: colors.logoColors.accent.length > 0 && colors.logoColors.accent.every((c) => chroma.valid(c))
          ? colors.logoColors.accent
          : ['#50E3C2', '#FF0266', '#FF5733'],
      },
      slideImageColors: colors.slideImageColors.map((palette) =>
        palette.every((c) => chroma.valid(c)) ? palette : ['#4A90E2', '#50E3C2', '#F5A623']
      ),
    };

    // Generate M3 theme
    const materialTheme = generateM3Theme(validatedColors.logoColors.primary) || {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      tertiary: '#755A2F',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#1C2526',
      onSurface: '#1C2526',
    };
    console.log('Material Theme:', materialTheme);

    // Generate complementary colors for glow
    const baseColor = selectVibrantColor(validatedColors.slideImageColors[0]) || validatedColors.logoColors.primary;
    const glowColor = chroma(baseColor).set('hsl.h', '+180').luminance(0.7).hex();
    const complementaryTextColor = ensureContrast(
      chroma(glowColor).luminance(0.8).hex(),
      materialTheme.background
    );
    const complementaryFooterColor = ensureContrast(
      chroma(glowColor).set('hsl.s', '*0.5').luminance(0.6).hex(),
      materialTheme.surface
    );
    console.log('Complementary Colors:', { glowColor, complementaryTextColor, complementaryFooterColor });

    // Capture screenshots for all slides
    const slideScreenshots: Blob[] = [];
    for (let i = 0; i < newSlides.length; i++) {
      const slide = newSlides[i];
      const slideImageColors = validatedColors.slideImageColors[i] || ['#4A90E2', '#50E3C2', '#F5A623'];
      console.log(`Rendering slide ${i + 1}:`, slide.title);

      const slideContainer = document.createElement('div');
      slideContainer.style.position = 'absolute';
      slideContainer.style.top = '-9999px';
      slideContainer.style.width = '1080px';
      slideContainer.style.height = '1080px';
      document.body.appendChild(slideContainer);

      const vibrantTextColor = ensureContrast(
        materialTheme.onSurface || '#1C2526',
        materialTheme.background || '#FFFFFF'
      );
      const vibrantAccentColor = selectVibrantColor(slideImageColors) || '#50E3C2';
      const footerColor = materialTheme.secondary || '#50E3C2';
      const backgroundColor = materialTheme.background || '#FFFFFF';
      console.log(`Slide ${i + 1} Colors:`, {
        vibrantTextColor,
        vibrantAccentColor,
        footerColor,
        backgroundColor,
        glowColor,
        complementaryTextColor,
        complementaryFooterColor,
      });

      const template = carouselTemplates.find((t) => t.id === randomCarouselTemplate.id) || {
        ...carouselTemplates[0],
        renderSlide: defaultRenderSlide, // Use defined defaultRenderSlide
      };
      let slideElement: JSX.Element;
      try {
        slideElement = template.renderSlide(
          { ...slide, imageUrl: slide.imageUrl || '/images/background3.png' },
          true,
          userLogo || '/images/Logo1.png',
          {
            logoColors: {
              primary: chroma.valid(validatedColors.logoColors.primary)
                ? validatedColors.logoColors.primary
                : '#4A90E2',
              secondary: chroma.valid(validatedColors.logoColors.secondary)
                ? validatedColors.logoColors.secondary
                : '#50E3C2',
              accent: validatedColors.logoColors.accent.every((c) => chroma.valid(c))
                ? validatedColors.logoColors.accent
                : ['#50E3C2', '#FF0266', '#FF5733'],
            },
            imageColors: slideImageColors,
            glowColor,
            complementaryTextColor,
            complementaryFooterColor,
            ensureContrast,
            vibrantLogoColor: materialTheme.primary || '#4A90E2',
            vibrantTextColor,
            footerColor,
            backgroundColor,
            typography: {
              fontFamily: (m3Typography[brandStyle] || m3Typography.Modern).fontFamily || 'Roboto',
              fontWeight: (m3Typography[brandStyle] || m3Typography.Modern).fontWeight || 400,
              fontSize: (m3Typography[brandStyle] || m3Typography.Modern).fontSize || '1rem',
            },
            graphicStyle: {
              borderRadius: (graphicStyles[brandStyle] || graphicStyles.Modern).borderRadius || '8px',
              iconStyle: (graphicStyles[brandStyle] || graphicStyles.Modern).iconStyle || 'rounded',
              filter: (graphicStyles[brandStyle] || graphicStyles.Modern).filter || 'none',
            },
            materialTheme: {
              primary: chroma.valid(materialTheme.primary) ? materialTheme.primary : '#4A90E2',
              secondary: chroma.valid(materialTheme.secondary) ? materialTheme.secondary : '#50E3C2',
              tertiary: chroma.valid(materialTheme.tertiary) ? materialTheme.tertiary : '#755A2F',
              background: chroma.valid(materialTheme.background) ? materialTheme.background : '#FFFFFF',
              surface: chroma.valid(materialTheme.surface) ? materialTheme.surface : '#FAFAFA',
              onPrimary: chroma.valid(materialTheme.onPrimary) ? materialTheme.onPrimary : '#FFFFFF',
              onSecondary: chroma.valid(materialTheme.onSecondary) ? materialTheme.onSecondary : '#000000',
              onBackground: chroma.valid(materialTheme.onBackground) ? materialTheme.onBackground : '#1C2526',
              onSurface: chroma.valid(materialTheme.onSurface) ? materialTheme.onSurface : '#1C2526',
            },
          }
        );
        console.log(`Slide ${i + 1} Element Rendered:`, slideElement.type, Object.keys(slideElement.props));
      } catch (error) {
        console.error(`Error rendering slide ${i + 1}:`, error);
        throw new Error(`Failed to render slide ${i + 1}: ${(error as Error).message}`);
      }

      const root = createRoot(slideContainer);
      try {
        root.render(slideElement);
        console.log(`Slide ${i + 1} Element Mounted`);

        await new Promise((resolve) => setTimeout(resolve, 3000)); // Increased delay for rendering

        console.log(`Capturing screenshot for slide ${i + 1}`);
        const canvas = await html2canvas(slideContainer, {
          useCORS: true,
          scale: 2,
          backgroundColor: null,
          width: 1080,
          height: 1080,
          logging: true,
        });
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) {
              console.log(`Blob created for slide ${i + 1}, size: ${b.size} bytes`);
              resolve(b);
            } else {
              reject(new Error(`Failed to create blob for slide ${i + 1}`));
            }
          }, 'image/png');
        });
        slideScreenshots.push(blob);
      } catch (error) {
        console.error(`Error capturing screenshot for slide ${i + 1}:`, error);
        throw new Error(`Failed to capture screenshot for slide ${i + 1}: ${(error as Error).message}`);
      } finally {
        root.unmount();
        document.body.removeChild(slideContainer);
      }
    }
    console.log('Screenshots Captured:', slideScreenshots.length);

    // Upload all screenshots using uploadCarouselToCloudinary
    const formData = new FormData();
    slideScreenshots.forEach((blob, index) => {
      console.log(`Appending blob for slide ${index + 1}, size: ${blob.size} bytes`);
      formData.append('images', blob, `${topic}-slide-${index + 1}.png`);
    });

    console.log('Uploading to Cloudinary...');
    const uploadResult = await mutations.uploadCarouselToCloudinary(formData).unwrap();
    const uploadedUrls = uploadResult?.data || [];
    console.log('Upload Result:', uploadedUrls);

    // Map uploaded URLs to images
    const images: { url: string; label: string }[] = uploadedUrls.map((url: string, index: number) => ({
      url,
      label: `Slide ${index + 1}`,
    }));
    console.log('Mapped Images:', images);

    // Save post with images
    if (images.length > 0) {
      console.log('Saving post with images...');
      await mutations.savePosts({
        postContentId,
        topic,
        type: 'carousel',
        status: 'success',
        images,
        contentId: carouselResult.data._id,
        contentType: 'CarouselContent',
      }).unwrap();
      newPost.images = images;
    } else {
      throw new Error('No images were uploaded to Cloudinary');
    }

    console.log('Post Generated Successfully:', newPost);
    return newPost;
  } catch (error) {
    const errorMessage = (error as any)?.data?.message || `An unexpected error occurred while generating the carousel post: ${(error as Error).message}`;
    console.error('Error in generateCarouselPost:', error);
    showAlert({
      type: 'error',
      title: 'Failed to Generate Carousel Post',
      message: errorMessage,
    });
    throw error;
  } finally {
    if (tempContainer && document.body.contains(tempContainer)) {
      if (tempRoot) tempRoot;
      document.body.removeChild(tempContainer);
    }
  }
};

// export const generateDoYouKnowPost = async (
//   topic: string,
//   type: 'doyouknow',
//   postContentId: string,
//   mutations: {
//     generateDoYouKnow: ReturnType<typeof useGenerateDoYouKnowMutation>[0];
//     dykContent: ReturnType<typeof useDykContentMutation>[0];
//     savePosts: ReturnType<typeof useSavePostsMutation>[0];
//     uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0];
//   },
//   showAlert: ReturnType<typeof useAlert>['showAlert'],
//   userLogo?: string,
//   brandStyle: BrandStyle = 'Modern',
//   competitorImageUrl?: string
// ): Promise<Post> => {
//   let newPost: Post;
//   let screenshotUrl: string | undefined;

//   try {
//     console.log(`Generating Do You Know post with topic: ${topic}, postContentId: ${postContentId}`);

//     // Select random DYK template
//     const randomDoYouKnowTemplateIndex = Math.floor(Math.random() * doYouKnowTemplates.length);
//     const randomDoYouKnowTemplate = doYouKnowTemplates[randomDoYouKnowTemplateIndex];

//     // Generate DYK content via API
//     const doYouKnowResponse = await mutations.generateDoYouKnow({ topic }).unwrap();
//     const generatedDoYouKnowContent = doYouKnowResponse.data;

//     // Create new DYK slide
//     const newDoYouKnowSlide: DoYouKnowSlide = {
//       title: generatedDoYouKnowContent.title || randomDoYouKnowTemplate.slides[0].title,
//       fact: generatedDoYouKnowContent.description || randomDoYouKnowTemplate.slides[0].fact,
//       footer: randomDoYouKnowTemplate.slides[0].footer || '',
//       websiteUrl: randomDoYouKnowTemplate.slides[0].websiteUrl || '',
//       imageUrl: randomDoYouKnowTemplate.slides[0].imageUrl || '',
//       slideNumber: 1,
//     };

//     // Save DYK content
//     const dykResult = await mutations.dykContent({
//       postContentId,
//       topic,
//       templateId: randomDoYouKnowTemplate.id,
//       content: { title: generatedDoYouKnowContent.title, fact: generatedDoYouKnowContent.description },
//       hashtags: generatedDoYouKnowContent?.hashtags,
//       status: 'success',
//     }).unwrap();

//     // Create new post object
//     newPost = {
//       topic,
//       type,
//       content: newDoYouKnowSlide,
//       templateId: randomDoYouKnowTemplate.id,
//       status: 'success',
//       contentId: dykResult.data._id,
//       contentType: 'DoyouknowContent',
//     };

//     // Extract colors from logo and slide image
//     const tempContainerColor = document.createElement('div');
//     tempContainerColor.style.position = 'absolute';
//     tempContainerColor.style.top = '-9999px';
//     tempContainerColor.style.width = '1080px';
//     tempContainerColor.style.height = '1080px';
//     document.body.appendChild(tempContainerColor);

//     const ColorExtractor = ({
//       logoUrl,
//       imageUrl,
//       competitorUrl,
//       onColorsExtracted,
//     }: {
//       logoUrl: string;
//       imageUrl: string;
//       competitorUrl?: string;
//       onColorsExtracted: (colors: {
//         logoColors: { primary: string; secondary: string; accent: string[] };
//         imageColors: string[];
//         competitorColors?: string[];
//       }) => void;
//     }) => {
//       const { data: logoPalette } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
//       const { data: imagePalette } = usePalette(imageUrl || '', 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
//       const { data: competitorPalette } = usePalette(competitorUrl || '', 5, 'hex', {
//         crossOrigin: 'anonymous',
//         quality: 10,
//       });

//       React.useEffect(() => {
//         if (logoPalette) {
//           const sortedLogoColors = logoPalette.sort((a, b) => {
//             const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
//             const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
//             return vibrancyB - vibrancyA;
//           });
//           const logoColors = {
//             primary: sortedLogoColors[0],
//             secondary: sortedLogoColors[1] || chroma(sortedLogoColors[0]).set('hsl.l', 0.3).hex(),
//             accent: sortedLogoColors.slice(2),
//           };
//           onColorsExtracted({
//             logoColors,
//             imageColors: imagePalette || [materialTheme.background, materialTheme.surface],
//             competitorColors: competitorPalette,
//           });
//         }
//       }, [logoPalette, imagePalette, competitorPalette]);

//       return null;
//     };

//     const materialTheme = generateM3Theme('#4A90E2'); // Fallback theme for initial use
//     const colors = await new Promise<{
//       logoColors: { primary: string; secondary: string; accent: string[] };
//       imageColors: string[];
//       competitorColors?: string[];
//     }>((resolve) => {
//       const tempRoot = createRoot(tempContainerColor);
//       tempRoot.render(
//         <ColorExtractor
//           logoUrl={userLogo || '/images/Logo1.png'}
//           imageUrl={newDoYouKnowSlide.imageUrl || ''}
//           competitorUrl={competitorImageUrl}
//           onColorsExtracted={(extractedColors) => {
//             resolve(extractedColors);
//             setTimeout(() => {
//               tempRoot.unmount();
//               document.body.removeChild(tempContainerColor);
//             }, 0);
//           }}
//         />
//       );
//     });

//     console.log('Extracted Colors:', colors);

//     // Generate M3 theme from logo's primary color
//     const finalMaterialTheme = generateM3Theme(colors.logoColors.primary);
//     const mappedPalette = colors.competitorColors
//       ? mapCompetitorPalette(colors.competitorColors, colors.logoColors)
//       : colors.logoColors;

//     const typography = m3Typography[brandStyle] || m3Typography.Modern;
//     const graphicStyle = graphicStyles[brandStyle] || graphicStyles.Modern;

//     // Render DYK slide with extracted colors
//     const tempContainerDYK = document.createElement('div');
//     tempContainerDYK.style.position = 'absolute';
//     tempContainerDYK.style.top = '-9999px';
//     tempContainerDYK.style.width = '1080px';
//     tempContainerDYK.style.height = '1080px';
//     document.body.appendChild(tempContainerDYK);

//     const vibrantTextColor = ensureContrast(finalMaterialTheme.onSurface, finalMaterialTheme.background);
//     const vibrantAccentColor = colors.imageColors.length > 0 ? selectVibrantColor(colors.imageColors) : finalMaterialTheme.secondary;
//     const footerColor = finalMaterialTheme.secondary;
//     const backgroundColor = finalMaterialTheme.background;

//     const doYouKnowTemplate = doYouKnowTemplates.find((t) => t.id === randomDoYouKnowTemplate.id) || doYouKnowTemplates[0];
//     const doYouKnowSlideElement = doYouKnowTemplate.renderSlide(
//       newDoYouKnowSlide,
//       true,
//       userLogo || '/images/Logo1.png',
//       {
//         logoColors: mappedPalette,
//         imageColors: colors.imageColors,
//         ensureContrast,
//         vibrantLogoColor: finalMaterialTheme.primary,
//         vibrantTextColor,
//         footerColor,
//         vibrantAccentColor,
//         backgroundColor,
//         typography,
//         graphicStyle,
//         materialTheme: finalMaterialTheme,
//       }
//     );

//     const root = createRoot(tempContainerDYK);
//     root.render(doYouKnowSlideElement);

//     // Capture and upload screenshot
//     screenshotUrl = await captureAndUploadScreenshot(tempContainerDYK, topic, type, {
//       uploadImageToCloudinary: mutations.uploadImageToCloudinary,
//     });

//     document.body.removeChild(tempContainerDYK);
//     root.unmount();

//     // Save post with screenshot
//     if (screenshotUrl) {
//       await mutations.savePosts({
//         postContentId,
//         topic,
//         type: 'doyouknow',
//         status: 'success',
//         images: [{ url: screenshotUrl, label: 'Did You Know?' }],
//         contentId: dykResult.data._id,
//         contentType: 'DYKContent',
//       }).unwrap();
//       newPost.images = [{ url: screenshotUrl, label: 'Did You Know?' }];
//     } else {
//       throw new Error('Failed to capture or upload screenshot');
//     }

//     return newPost;
//   } catch (error) {
//     const errorMessage = (error as any)?.data?.message || 'An unexpected error occurred while generating the Do You Know post.';
//     showAlert({
//       type: 'error',
//       title: 'Failed to Generate Do You Know Post',
//       message: errorMessage,
//     });
//     throw error;
//   }
// };

function mapCompetitorPalette(
  competitorColors: string[],
  logoColors: { primary: string; secondary: string; accent: string[] }
): { primary: string; secondary: string; accent: string[] } {
  // Fallback to logoColors if competitorColors is empty or invalid
  if (!competitorColors || competitorColors.length === 0) {
    return logoColors;
  }

  // Helper to get a valid color or fallback
  const getValidColor = (color: string, fallback: string) =>
    chroma.valid(color) ? color : fallback;

  // Map competitor's most vibrant color to primary, next to secondary, rest to accent
  const sorted = competitorColors
    .filter((c) => chroma.valid(c))
    .sort((a, b) => {
      const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
      const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
      return vibrancyB - vibrancyA;
    });

  return {
    primary: getValidColor(sorted[0], logoColors.primary),
    secondary: getValidColor(sorted[1] || sorted[0], logoColors.secondary),
    accent:
      sorted.length > 2
        ? sorted.slice(2)
        : logoColors.accent.length
        ? logoColors.accent
        : [logoColors.primary, logoColors.secondary],
  };
}

