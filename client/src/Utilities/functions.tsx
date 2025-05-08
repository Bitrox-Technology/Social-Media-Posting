import React from 'react';
import { imageTemplates } from '../templetes/ImageTemplate';
import { useGenerateImageContentMutation, useImageContentMutation, useGenerateImageMutation, useSavePostsMutation, useUploadImageToCloudinaryMutation } from '../store/api';
import { ImageContent, Post } from '../components/content/AutoPost/Types';
import { usePalette } from 'color-thief-react';
import chroma from 'chroma-js';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';


export const generateImagePost = async (
    topic: string,
    type: 'image' | 'carousel' | 'doyouknow',
    postContentId: string,
    mutations: {
        generateImageContent: ReturnType<typeof useGenerateImageContentMutation>[0];
        generateImage: ReturnType<typeof useGenerateImageMutation>[0];
        imageContent: ReturnType<typeof useImageContentMutation>[0];
        savePosts: ReturnType<typeof useSavePostsMutation>[0];
        uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0];
      },
    userLogo?: string,
        
  ): Promise<Post> => {
    let newPost: Post;
    let screenshotUrl: string | undefined;

    console.log("Generating image post with topic:", topic);
    console.log("Post content ID:", postContentId);
    console.log("Post type:", type);
    console.log("User logo URL:", userLogo);
  
    // Select random template
    const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
    const randomTemplate = imageTemplates[randomTemplateIndex];
  
    // Generate content and image
    const contentRes = await mutations.generateImageContent({ topic }).unwrap();
    const generatedContent = contentRes.data;
    // const imageRes = await mutations.generateImage({ prompt: topic }).unwrap();
    const imageRes = "https://res.cloudinary.com/deuvfylc5/image/upload/v1746701127/mlauaov0nc6e1ugqfp5w.png"
    // const imageUrl = imageRes.data || '';
    const imageUrl = imageRes || '';
  
    // Create new image slide
    const newImageSlide: ImageContent = {
      title: generatedContent.title || randomTemplate.slides[0].title,
      description: generatedContent.description || randomTemplate.slides[0].description,
      footer: randomTemplate.slides[0].footer,
      websiteUrl: randomTemplate.slides[0].websiteUrl || '',
      imageUrl: imageUrl,
    };
  
    // Save image content
    const imageResult = await mutations.imageContent({
      postContentId,
      topic,
      templateId: randomTemplate.id,
      content: newImageSlide,
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
  
    // Create temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '500px';
    tempContainer.style.height = '700px';
    document.body.appendChild(tempContainer);
  
    // Extract colors using color-thief-react
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
  
    // Use a promise to handle color extraction asynchronously
    const colors = await new Promise<{ logoColors: string[]; imageColors: string[] }>((resolve) => {
      const tempRoot = createRoot(tempContainer);
      tempRoot.render(
        <ColorExtractor
          logoUrl={userLogo || '/images/Logo1.png'}
          imageUrl={imageUrl}
          onColorsExtracted={(extractedColors) => {
            resolve(extractedColors);
            tempRoot.unmount();
          }}
        />
      );
    });

    console.log("Extracted Colors:", colors);
  
    // Define ensureContrast function for accessibility
    const ensureContrast = (textColor: string, bgColor: string) => {
      const contrast = chroma.contrast(textColor, bgColor);
      if (contrast < 4.5) {
        return chroma(textColor).luminance(0.5).hex(); // Adjust luminance for better contrast
      }
      return textColor;
    };
    
    console.log("Text Color:", colors.logoColors[0]);
    console.log("Background Color:", colors.imageColors[0]);
    // Render slide with extracted colors and ensureContrast
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
      }
    );
  
    const rootImage = createRoot(tempContainer);
    rootImage.render(slideElement);

    console.log("Root Image:", rootImage);
    console.log("Slide Element:", slideElement);
  
    screenshotUrl = await captureAndUploadScreenshot(tempContainer, topic, type, { uploadImageToCloudinary: mutations.uploadImageToCloudinary });
    document.body.removeChild(tempContainer);
    rootImage.unmount();
  
    // Save post with screenshot
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
  };

// Your existing captureAndUploadScreenshot function (unchanged)
const captureAndUploadScreenshot = async (ref: HTMLDivElement | null, topic: string, type: string, mutations: { uploadImageToCloudinary: ReturnType<typeof useUploadImageToCloudinaryMutation>[0] }) => {
    if (!ref) return '';
    await new Promise((resolve) => setTimeout(resolve, 500));
    const canvas = await html2canvas(ref, { useCORS: true, scale: 2, backgroundColor: null });
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
    const formData = new FormData();
    formData.append('image', blob, `${topic}-${type}.png`);
    const result = await mutations.uploadImageToCloudinary(formData).unwrap();
    return result?.data?.secure_url || '';
};


