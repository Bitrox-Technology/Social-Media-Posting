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

const selectVibrantColor = (colors: string[]): string => {
  return colors.reduce((mostVibrant, color) => {
    const [h, s, l] = chroma(color).hsl();
    const [hMost, sMost, lMost] = mostVibrant ? chroma(mostVibrant).hsl() : [0, 0, 0];
    const vibrancy = s * (1 - Math.abs(l - 0.5));
    const vibrancyMost = sMost * (1 - Math.abs(lMost - 0.5));
    return vibrancy > vibrancyMost ? color : mostVibrant;
  }, colors[0]);
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
  showAlert?: ReturnType<typeof useAlert>['showAlert'],
): Promise<Post> => {
  let newPost: Post;
  let screenshotUrl: string | undefined;

  try {
    console.log("Generating image post with topic:", topic);
    console.log("Post content ID:", postContentId);
    console.log("Post type:", type);
    console.log("User logo URL:", userLogo);

    const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
    const randomTemplate = imageTemplates[randomTemplateIndex];

    const contentRes = await mutations.generateImageContent({ topic }).unwrap();
    const generatedContent = contentRes.data;

    const imageUrl = "https://res.cloudinary.com/deuvfylc5/image/upload/v1746701127/mlauaov0nc6e1ugqfp5w.png";

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
      onColorsExtracted,
    }: {
      logoUrl: string;
      imageUrl: string;
      onColorsExtracted: (colors: { logoColors: string[]; imageColors: string[] }) => void;
    }) => {
      const { data: logoPalette } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });
      const { data: imagePalette } = usePalette(imageUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });

      React.useEffect(() => {
        if (logoPalette && imagePalette) {
          onColorsExtracted({
            logoColors: logoPalette,
            imageColors: imagePalette,
          });
        }
      }, [logoPalette, imagePalette]);

      return null;
    };

    // Extract colors and defer unmounting
    const colors = await new Promise<{ logoColors: string[]; imageColors: string[] }>((resolve) => {
      const tempRoot = createRoot(tempContainer);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrl={imageUrl}
          onColorsExtracted={(extractedColors) => {
            resolve(extractedColors);
            // Defer unmounting to avoid race condition
            setTimeout(() => {
              tempRoot.unmount();
              document.body.removeChild(tempContainer);
            }, 0);
          }}
        />
      );
    });

    console.log("Extracted Colors:", colors);

    const ensureContrast = (textColor: string, bgColor: string) => {
      const contrast = chroma.contrast(textColor, bgColor);
      if (contrast < 4.5) {
        return chroma(textColor).luminance(0.5).hex();
      }
      return textColor;
    };

    const vibrantLogoColor = selectVibrantColor(colors.logoColors);
    const vibrantTextColor = selectVibrantColor(colors.logoColors);
    const backgroundColor = colors.imageColors[0];
    const footerColor = selectVibrantColor(colors.imageColors.slice(1));

    const adjustedTextColor = ensureContrast(vibrantTextColor, backgroundColor);
    const adjustedFooterColor = ensureContrast(footerColor, backgroundColor);

    console.log("Selected Vibrant Logo Color:", vibrantLogoColor);
    console.log("Selected Vibrant Text Color:", adjustedTextColor);
    console.log("Background Color:", backgroundColor);
    console.log("Footer Color:", adjustedFooterColor);

    const slide = newPost.content as ImageContent;
    const template = imageTemplates.find((t) => t.id === newPost.templateId) || imageTemplates[0];

    const slideElement = template.renderSlide(
      { ...slide, footer: slide.footer || '', websiteUrl: slide.websiteUrl || '' },
      true,
      userLogo || '/images/Logo1.png',
      {
        logoColors: colors.logoColors,
        imageColors: colors.imageColors,
        ensureContrast,
        vibrantLogoColor,
        vibrantTextColor: adjustedTextColor,
        footerColor: adjustedFooterColor,
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

    console.log("Root Image:", rootImage);
    console.log("Slide Element:", slideElement);

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
  showAlert: ReturnType<typeof useAlert>['showAlert'],
  userLogo?: string,
): Promise<Post> => {
  let newPost: Post;

  try {

    // Select random carousel template
    const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
    const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];

    // Generate carousel content via API
    const carouselResponse = await mutations.generateCarousel({ topic }).unwrap();
    const generatedCarouselContent: CarouselContent[] = carouselResponse.data;

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

    // Extract content for saving
    const extractedContent = generatedCarouselContent.map((content, index) => ({
      tagline: content.tagline || '',
      title: content.title || '',
      description: content.description || '',
      hashtags: content.hashtags || [],
    }));

    // Save carousel content
    const carouselResult = await mutations.carouselContent({
      postContentId,
      topic,
      templateId: randomCarouselTemplate.id,
      content: extractedContent,
      status: 'success',
    }).unwrap();

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

    // Step 1: Extract colors for each slide
    const slideColors: Array<{ vibrantTextColor: string; vibrantAccentColor: string; footerColor: string }> = [];
    for (let i = 0; i < newSlides.length; i++) {
      const slide = newSlides[i];

      // Create temporary container for color extraction
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1080px';
      document.body.appendChild(tempContainer);

      const ColorExtractor = ({
        imageUrl,
        onColorsExtracted,
      }: {
        imageUrl: string;
        onColorsExtracted: (colors: { imageColors: string[] }) => void;
      }) => {
        const { data: imagePalette } = usePalette(imageUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });

        React.useEffect(() => {
          if (imagePalette) {
            onColorsExtracted({ imageColors: imagePalette });
          }
        }, [imagePalette]);

        return null;
      };

      const slideColorsResult = await new Promise<{ imageColors: string[] }>((resolve) => {
        const tempRoot = createRoot(tempContainer);
        tempRoot.render(
          <ColorExtractor
            imageUrl={slide.imageUrl || '/images/background3.png'}
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

      // Select vibrant colors for styling
      const vibrantTextColor = selectVibrantColor(slideColorsResult.imageColors);
      const vibrantAccentColor = selectVibrantColor(slideColorsResult.imageColors.slice(1));
      const footerColor = selectVibrantColor(slideColorsResult.imageColors.slice(2));

      slideColors.push({ vibrantTextColor, vibrantAccentColor, footerColor });
    }

    // Step 2: Capture screenshots for all slides
    const slideScreenshots: Blob[] = [];
    for (let i = 0; i < newSlides.length; i++) {
      const slide = newSlides[i];
      const slideColor = slideColors[i];

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1080px';
      document.body.appendChild(tempContainer);

      const template = carouselTemplates.find((t) => t.id === randomCarouselTemplate.id) || carouselTemplates[0];
      const slideElement = template.renderSlide
        ? template.renderSlide(
          slide,
          true,
          userLogo || '/images/Logo1.png',
          slideColor
        )
        : <div>{slide.title}</div>;
      const root = createRoot(tempContainer);
      root.render(slideElement);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempContainer, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        width: 1080,
        height: 1080,
      });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      slideScreenshots.push(blob);

      document.body.removeChild(tempContainer);
      root.unmount();
    }

    // Step 3: Upload all screenshots in one shot
    const formData = new FormData();
    slideScreenshots.forEach((blob, index) => {
      formData.append('images', blob, `${topic}-slide-${index + 1}.png`);
    });

    const uploadResult = await mutations.uploadCarouselToCloudinary(formData).unwrap();
    console.log("Upload Result:", uploadResult);
    const uploadedUrls = uploadResult?.data || [];
    console.log("Uploaded URLs:", uploadedUrls);

    // Step 4: Map uploaded URLs to images
    const images: { url: string; label: string }[] = uploadedUrls.map((url: string, index: number) => ({
      url,
      label: `Slide ${index + 1}`,
    }));

    // Step 5: Save post with images
    if (images.length > 0) {
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
      throw new Error('Failed to upload carousel images');
    }

    return newPost;
  } catch (error) {
    const errorMessage = (error as any)?.data?.message || 'An unexpected error occurred while generating the carousel post.';
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
): Promise<Post> => {
  let newPost: Post;
  let screenshotUrl: string | undefined;

  try {

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

    // Step 1: Extract colors from the logo
    const tempContainerColor = document.createElement('div');
    tempContainerColor.style.position = 'absolute';
    tempContainerColor.style.top = '-9999px';
    tempContainerColor.style.width = '1080px';
    tempContainerColor.style.height = '1080px';
    document.body.appendChild(tempContainerColor);

    const ColorExtractor = ({
      logoUrl,
      onColorsExtracted,
    }: {
      logoUrl: string;
      onColorsExtracted: (colors: { logoColors: string[] }) => void;
    }) => {
      const { data: logoPalette } = usePalette(logoUrl, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });

      React.useEffect(() => {
        if (logoPalette) {
          onColorsExtracted({
            logoColors: logoPalette,
          });
        }
      }, [logoPalette]);

      return null;
    };

    const colors = await new Promise<{ logoColors: string[] }>((resolve) => {
      const tempRoot = createRoot(tempContainerColor);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
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

    console.log("Extracted Colors:", colors);

    // Select vibrant colors for styling
    const vibrantTextColor = selectVibrantColor(colors.logoColors);
    const vibrantAccentColor = selectVibrantColor(colors.logoColors.slice(1));

    // Step 2: Render DYK slide with extracted colors
    const tempContainerDYK = document.createElement('div');
    tempContainerDYK.style.position = 'absolute';
    tempContainerDYK.style.top = '-9999px';
    tempContainerDYK.style.width = '1080px';
    tempContainerDYK.style.height = '1080px';
    tempContainerDYK.style.backgroundColor = '#1A2526';
    document.body.appendChild(tempContainerDYK);

    const doYouKnowTemplate = doYouKnowTemplates.find((t) => t.id === randomDoYouKnowTemplate.id) || doYouKnowTemplates[0];
    const doYouKnowSlideElement = doYouKnowTemplate.renderSlide
      ? doYouKnowTemplate.renderSlide(newDoYouKnowSlide, true, userLogo || '/images/Logo1.png', {
          vibrantTextColor,
          vibrantAccentColor,
        })
      : <div>{newDoYouKnowSlide.title}</div>;
    const root = createRoot(tempContainerDYK);
    root.render(doYouKnowSlideElement);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Step 3: Capture and upload screenshot
    screenshotUrl = await captureAndUploadScreenshot(tempContainerDYK, topic, type, {
      uploadImageToCloudinary: mutations.uploadImageToCloudinary,
    });

    document.body.removeChild(tempContainerDYK);
    root.unmount();

    // Step 4: Save post with screenshot
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

