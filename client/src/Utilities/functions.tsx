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
type BrandStyle = 'Modern' | 'Traditional' | 'Playful' | 'Corporate' | 'Minimal';


const m3Typography: Record<BrandStyle, { fontFamily: string; fontWeight: number; fontSize: string }> = {
  Modern: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '2.5rem',
  },
  Traditional: {
    fontFamily: 'Roboto Serif, serif',
    fontWeight: 400,
    fontSize: '2.5rem',
  },
  Playful: {
    fontFamily: 'Rubik, sans-serif',
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
};

// M3 Shape System
const m3Shapes: Record<BrandStyle, { borderRadius: string }> = {
  Modern: { borderRadius: '8px' }, 
  Traditional: { borderRadius: '4px' }, 
  Corporate: { borderRadius: '8px' },
  Playful: { borderRadius: '16px' }, 
  Minimal: { borderRadius: '4px' }, 
};

// Graphic Styles
const graphicStyles: Record<BrandStyle, { borderRadius: string; iconStyle: string; filter: string }> = {
  Modern: {
    borderRadius: m3Shapes.Corporate.borderRadius,
    iconStyle: 'sharp',
    filter: 'none',
  },
  Traditional: {
    borderRadius: m3Shapes.Minimal.borderRadius,
    iconStyle: 'outlined',
    filter: 'grayscale(0.2)',
  },
  Playful: {
    borderRadius: m3Shapes.Playful.borderRadius,
    iconStyle: 'rounded',
    filter: 'brightness(1.1) contrast(1.1)',
  },
  Corporate: {
    borderRadius: m3Shapes.Corporate.borderRadius,
    iconStyle: 'sharp',
    filter: 'contrast(1.2)',
  },
  Minimal: {
    borderRadius: m3Shapes.Minimal.borderRadius,
    iconStyle: 'outlined',
    filter: 'none',
  },
};

// Helper Functions
 const generateM3Theme = (sourceColor: string) => {
  try {
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
    // Fallback theme if color generation fails
    return {
      primary: sourceColor,
      secondary: chroma(sourceColor).set('hsl.l', 0.5).hex(),
      tertiary: chroma(sourceColor).set('hsl.h', '+30').hex(),
      background: '#FFFFFF',
      surface: '#F5F5F5',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
    };
  }
};

const selectVibrantColor = (colors: string[]): string => {
  return colors.reduce((mostVibrant, color) => {
    const [h, s, l] = chroma(color).hsl();
    const [hMost, sMost, lMost] = mostVibrant ? chroma(mostVibrant).hsl() : [0, 0, 0];
    const vibrancy = s * (1 - Math.abs(l - 0.5));
    const vibrancyMost = sMost * (1 - Math.abs(lMost - 0.5));
    return vibrancy > vibrancyMost ? color : mostVibrant;
  }, colors[0]);
};

const ensureContrast = (textColor: string, bgColor: string) => {
  const contrast = chroma.contrast(textColor, bgColor);
  if (contrast < 4.5) {
    const adjusted = chroma(textColor).luminance(contrast < 4.5 ? 0.7 : 0.3).hex();
    return chroma.contrast(adjusted, bgColor) >= 4.5 ? adjusted : '#ffffff';
  }
  return textColor;
};

const mapCompetitorPalette = (
  competitorColors: string[],
  userColors: { primary: string; secondary: string; accent: string[] }
) => {
  const sortedCompetitorColors = competitorColors.sort((a, b) => {
    const vibrancyA = chroma(a).hsl()[1] * (1 - Math.abs(chroma(a).hsl()[2] - 0.5));
    const vibrancyB = chroma(b).hsl()[1] * (1 - Math.abs(chroma(b).hsl()[2] - 0.5));
    return vibrancyB - vibrancyA;
  });
  return {
    primary: userColors.primary,
    secondary: userColors.secondary,
    accent: sortedCompetitorColors.slice(2).map((_, i) => userColors.accent[i] || chroma(userColors.primary).set('hsl.l', 0.5).hex()),
  };
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
  competitorImageUrl?: string,
  showAlert?: ReturnType<typeof useAlert>['showAlert']
): Promise<Post> => {
  let newPost: Post;
  let screenshotUrl: string | undefined;

  try {
    console.log('Generating image post with topic:', topic);
    console.log('Post content ID:', postContentId);
    console.log('Post type:', type);
    console.log('User logo URL:', userLogo);
    console.log('Brand style:', brandStyle);
    console.log('Competitor image URL:', competitorImageUrl);

    const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
    const randomTemplate = imageTemplates[randomTemplateIndex];

    const contentRes = await mutations.generateImageContent({ topic }).unwrap();
    const generatedContent = contentRes.data;

    const imageUrl = 'https://res.cloudinary.com/deuvfylc5/image/upload/v1746701127/mlauaov0nc6e1ugqfp5w.png';

    const newImageSlide: ImageContent = {
      title: generatedContent.title || randomTemplate.slides[0].title,
      description: generatedContent.description || randomTemplate.slides[0].description,
      footer: randomTemplate.slides[0].footer,
      websiteUrl: randomTemplate.slides[0].websiteUrl || '',
      imageUrl: imageUrl,
    };

    const imageResult = await mutations.imageContent({
      postContentId,
      topic,
      templateId: randomTemplate.id,
      content: newImageSlide,
      hashtags: generatedContent?.hashtags,
      status: 'success',
    }).unwrap();

    newPost = {
      topic,
      type,
      content: newImageSlide,
      templateId: randomTemplate.id,
      status: 'success',
      contentId: imageResult.data._id,
      contentType: 'ImageContent',
    };

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1080px';
    tempContainer.style.height = '1080px';
    document.body.appendChild(tempContainer);

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
      const { data: imagePalette } = usePalette(imageUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const { data: competitorPalette } = usePalette(competitorUrl || '', 5, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10,
      });

      React.useEffect(() => {
        if (logoPalette && imagePalette) {
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
            imageColors: imagePalette,
            competitorColors: competitorPalette,
          });
        }
      }, [logoPalette, imagePalette, competitorPalette]);

      return null;
    };

    const colors = await new Promise<{
      logoColors: { primary: string; secondary: string; accent: string[] };
      imageColors: string[];
      competitorColors?: string[];
    }>((resolve) => {
      const tempRoot = createRoot(tempContainer);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrl={imageUrl}
          competitorUrl={competitorImageUrl}
          onColorsExtracted={(extractedColors) => {
            resolve(extractedColors);
            setTimeout(() => {
              tempRoot.unmount();
              document.body.removeChild(tempContainer);
            }, 0);
          }}
        />
      );
    });

    console.log('Extracted Colors:', colors);

    // Generate M3 theme from logo's primary color
    const materialTheme = generateM3Theme(colors.logoColors.primary);
    const mappedPalette = colors.competitorColors
      ? mapCompetitorPalette(colors.competitorColors, colors.logoColors)
      : colors.logoColors;

    const vibrantLogoColor = materialTheme.primary;
    const vibrantTextColor = ensureContrast(materialTheme.onSurface, materialTheme.background);
    const backgroundColor = materialTheme.background;
    const footerColor = materialTheme.secondary;

    console.log('Material Theme:', materialTheme);
    console.log('Selected Vibrant Logo Color:', vibrantLogoColor);
    console.log('Selected Vibrant Text Color:', vibrantTextColor);
    console.log('Background Color:', backgroundColor);
    console.log('Footer Color:', footerColor);

    // Type-safe access to typography and graphicStyle
    const typography = m3Typography[brandStyle] || m3Typography.Modern;
    const graphicStyle = graphicStyles[brandStyle] || graphicStyles.Modern;

    const slide = newPost.content as ImageContent;
    const template = imageTemplates.find((t) => t.id === newPost.templateId) || imageTemplates[0];

    const slideElement = template.renderSlide(
      { ...slide, footer: slide.footer || '', websiteUrl: slide.websiteUrl || '' },
      true,
      userLogo || '/images/Logo1.png',
      {
        logoColors: mappedPalette,
        imageColors: colors.imageColors,
        ensureContrast,
        vibrantLogoColor,
        vibrantTextColor,
        footerColor,
        backgroundColor,
        typography,
        graphicStyle,
        materialTheme,
      }
    );

    const tempContainerSlide = document.createElement('div');
    tempContainerSlide.style.position = 'absolute';
    tempContainerSlide.style.top = '-9999px';
    tempContainerSlide.style.width = '1080px';
    tempContainerSlide.style.height = '1080px';
    document.body.appendChild(tempContainerSlide);

    const rootImage = createRoot(tempContainerSlide);
    rootImage.render(slideElement);

    console.log('Root Image:', rootImage);
    console.log('Slide Element:', slideElement);

    screenshotUrl = await captureAndUploadScreenshot(tempContainerSlide, topic, type, {
      uploadImageToCloudinary: mutations.uploadImageToCloudinary,
    });

    document.body.removeChild(tempContainerSlide);
    rootImage.unmount();

    if (screenshotUrl) {
      await mutations.savePosts({
        postContentId,
        topic,
        type: 'image',
        status: 'success',
        images: [{ url: screenshotUrl, label: 'Image Post' }],
        contentId: imageResult.data._id,
        contentType: 'ImageContent',
      }).unwrap();
      newPost.images = [{ url: screenshotUrl, label: 'Image Post' }];
    }

    return newPost;
  } catch (error) {
    const errorMessage = (error as any)?.data?.message || 'An unexpected error occurred while generating the image post.';
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
  platform: 'instagram' | 'facebook' | 'linkedin' = 'instagram',
  showAlert: ReturnType<typeof useAlert>['showAlert'],
  userLogo?: string,
  brandStyle: BrandStyle = 'Modern',
  competitorImageUrl?: string
): Promise<Post> => {
  let newPost: Post;

  try {
    console.log(`Generating carousel post for ${platform} with topic: ${topic}, postContentId: ${postContentId}`);

    // Select random carousel template
    const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
    const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];
    console.log('Selected Template:', randomCarouselTemplate.id);

    // Generate carousel content via API
    const carouselResponse = await mutations.generateCarousel({ topic }).unwrap();
    const generatedCarouselContent: CarouselContent[] = carouselResponse.data;
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

    // Extract colors for logo and slides
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '1080px';
    tempContainer.style.height = '1080px';
    document.body.appendChild(tempContainer);

    const ColorExtractor = ({
      logoUrl,
      imageUrls,
      competitorUrl,
      onColorsExtracted,
    }: {
      logoUrl: string;
      imageUrls: string[];
      competitorUrl?: string;
      onColorsExtracted: (colors: {
        logoColors: { primary: string; secondary: string; accent: string[] };
        slideImageColors: string[][];
        competitorColors?: string[];
      }) => void;
    }) => {
      const { data: logoPalette, error: logoError } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const slidePalettes = imageUrls.map((url) => {
        const { data, error } = usePalette(url, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
        if (error) console.error(`Error extracting palette for ${url}:`, error);
        return data;
      });
      const { data: competitorPalette, error: competitorError } = usePalette(competitorUrl || '', 5, 'hex', {
        crossOrigin: 'anonymous',
        quality: 10,
      });
      if (competitorError) console.error('Error extracting competitor palette:', competitorError);

      React.useEffect(() => {
        if (logoPalette && slidePalettes.every((palette) => palette)) {
          console.log('Logo Palette:', logoPalette);
          console.log('Slide Palettes:', slidePalettes);
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
            slideImageColors: slidePalettes as string[][],
            competitorColors: competitorPalette,
          });
        } else if (logoError) {
          console.error('Logo palette extraction failed:', logoError);
          onColorsExtracted({
            logoColors: { primary: '#4A90E2', secondary: '#50E3C2', accent: ['#50E3C2'] },
            slideImageColors: imageUrls.map(() => ['#4A90E2', '#50E3C2']),
            competitorColors: competitorPalette || ['#4A90E2'],
          });
        }
      }, [logoPalette, ...slidePalettes, competitorPalette, logoError]);
      return null;
    };

    const colors = await new Promise<{
      logoColors: { primary: string; secondary: string; accent: string[] };
      slideImageColors: string[][];
      competitorColors?: string[];
    }>((resolve, reject) => {
      const tempRoot = createRoot(tempContainer);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrls={newSlides.map((slide) => slide.imageUrl || '/images/background3.png')}
          competitorUrl={competitorImageUrl}
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
      // Timeout to prevent hanging
      setTimeout(() => reject(new Error('Color extraction timed out')), 10000);
    });
    console.log('Colors Extracted:', colors);

    // Generate M3 theme from logo's primary color
    const materialTheme = generateM3Theme(colors.logoColors.primary);
    const mappedPalette = colors.competitorColors
      ? mapCompetitorPalette(colors.competitorColors, colors.logoColors)
      : colors.logoColors;
    console.log('Material Theme:', materialTheme);
    console.log('Mapped Palette:', mappedPalette);

    // Capture screenshots for all slides
    const slideScreenshots: Blob[] = [];
    for (let i = 0; i < newSlides.length; i++) {
      const slide = newSlides[i];
      const slideImageColors = colors.slideImageColors[i];
      console.log(`Rendering slide ${i + 1}:`, slide.title);

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1080px';
      document.body.appendChild(tempContainer);

      const vibrantTextColor = ensureContrast(materialTheme.onSurface, materialTheme.background);
      const vibrantAccentColor = selectVibrantColor(slideImageColors);
      const footerColor = materialTheme.secondary;
      const backgroundColor = materialTheme.background;
      console.log(`Slide ${i + 1} Colors:`, { vibrantTextColor, vibrantAccentColor, footerColor, backgroundColor });

      const template = carouselTemplates.find((t) => t.id === randomCarouselTemplate.id) || carouselTemplates[0];
      const slideElement = template.renderSlide(
        slide,
        true,
        userLogo || '/images/Logo1.png',
        {
          logoColors: mappedPalette,
          imageColors: slideImageColors,
          ensureContrast,
          vibrantLogoColor: materialTheme.primary,
          vibrantTextColor,
          footerColor,
          vibrantAccentColor,
          backgroundColor,
          typography: m3Typography[brandStyle] || m3Typography.Modern,
          graphicStyle: graphicStyles[brandStyle] || graphicStyles.Modern,
          materialTheme,
        }
      );

      const root = createRoot(tempContainer);
      root.render(slideElement);

      // Increased delay to ensure rendering
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(`Capturing screenshot for slide ${i + 1}`);
      const canvas = await html2canvas(tempContainer, {
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

      document.body.removeChild(tempContainer);
      root.unmount();
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
    const errorMessage = (error as any)?.data?.message || `An unexpected error occurred while generating the carousel post: ${error}`;
    console.error('Error in generateCarouselPost:', error);
    showAlert({
      type: 'error',
      title: 'Failed to Generate Carousel Post',
      message: errorMessage,
    });
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
