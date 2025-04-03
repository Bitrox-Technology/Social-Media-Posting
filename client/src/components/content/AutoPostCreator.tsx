import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { ArrowLeft } from 'lucide-react';
import {
  useGenerateImageMutation,
  useGenerateCarouselMutation,
  useGenerateDoYouKnowMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateImageContentMutation
} from '../../store/api';
import { setPosts } from '../../store/appSlice';
import { motion } from 'framer-motion';
import { carouselTemplates, Slide } from '../../templetes/templetesDesign';
import { Carousel } from '../ui/Carousel';
import { DoYouKnow } from '../ui/DoYouKnow';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { imageTemplates, ImageSlide } from '../../templetes/ImageTemplate';
import { ImageGeneration } from '../ui/ImageGeneration';
import html2canvas from 'html2canvas';

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface DoYouKnowContent {
  title: string;
  fact: string;
  footer?: string;
  websiteUrl?: string;
  imageUrl?: string;
}

interface ImageContent {
  title: string;
  description: string;
  footer?: string;
  websiteUrl?: string;
  imageUrl?: string;
}

interface Post {
  topic: string;
  type: 'image' | 'carousel' | 'doyouknow';
  content: ImageContent | DoYouKnowContent | Slide[] | string;
  images?: { url: string; label: string }[];
  templateId?: string;
}

export const AutoPostCreator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const postsFromRedux = useAppSelector((state) => state.app.posts);
  const [posts, setLocalPosts] = useState<Post[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});
  const [activeCarouselTopic, setActiveCarouselTopic] = useState<string | null>(null);
  const [editCarouselTopic, setEditCarouselTopic] = useState<string | null>(null);
  const [activeDoYouKnowTopic, setActiveDoYouKnowTopic] = useState<string | null>(null);
  const [editDoYouKnowTopic, setEditDoYouKnowTopic] = useState<string | null>(null);
  const [activeImageTopic, setActiveImageTopic] = useState<string | null>(null);
  const [editImageTopic, setEditImageTopic] = useState<string | null>(null);

  const [generateImage] = useGenerateImageMutation();
  const [generateCarousel] = useGenerateCarouselMutation();
  const [generateDoYouKnow] = useGenerateDoYouKnowMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImageContent] = useGenerateImageContentMutation();

  const topics = selectedTopic ? selectedTopic.split(', ').filter(Boolean).slice(0, 7) : [];
  const postTypes: ('image' | 'carousel' | 'doyouknow')[] = [
    'image',
    'carousel',
    'doyouknow',
    'image',
    'carousel',
    'doyouknow',
    'image',
  ];

  useEffect(() => {
    if (!selectedTopic) {
      navigate('/topic');
    }
  }, [selectedTopic, navigate]);

  const generatePost = async (topic: string, index: number) => {
    const type = postTypes[index];
    setIsLoadingMap((prev) => ({ ...prev, [topic]: true }));
    setErrorMap((prev) => ({ ...prev, [topic]: null }));
    setActiveCarouselTopic(null);
    setEditCarouselTopic(null);
    setActiveDoYouKnowTopic(null);
    setEditDoYouKnowTopic(null);
    setActiveImageTopic(null);
    setEditImageTopic(null);

    try {
      let newPost: Post;
      switch (type) {
        case 'image':
          const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
          const randomTemplate = imageTemplates[randomTemplateIndex];
          const contentRes = await generateImageContent({ topic: topic }).unwrap();
          const generatedContent = contentRes.data;

          const imageRes = await generateImage({ prompt: topic }).unwrap();
          const imageUrl = imageRes.data;

          console.log('imageUrl', imageUrl);
          console.log('generatedContent', generatedContent);

          const newImageSlide: ImageContent = {
            title: generatedContent.title || randomTemplate.slides[0].title,
            description: generatedContent.description || randomTemplate.slides[0].description,
            footer: randomTemplate.slides[0].footer,
            websiteUrl: randomTemplate.slides[0].websiteUrl || '',
            imageUrl: imageUrl,
          };

          console.log('newImageSlide', newImageSlide);

          newPost = { topic, type, content: newImageSlide, templateId: randomTemplate.id };
          setActiveImageTopic(topic);

          // Update the post with the new slide immediately
          const updatedPostsWithSlide = [...posts.filter((p) => p.topic !== topic), newPost];
          setLocalPosts(updatedPostsWithSlide);
          break;

        case 'carousel':
          const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
          const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];
          const carouselResponse = await generateCarousel({ topic }).unwrap();
          const generatedCarouselContent: CarouselContent[] = carouselResponse.data;

          const newSlides: Slide[] = randomCarouselTemplate.slides.map((slide, index) => {
            const content = generatedCarouselContent[index] || {};
            let formattedDescription = content.description || slide.description;

            if ((formattedDescription ?? '').trim().match(/^\d+\./)) {
              formattedDescription = (formattedDescription || '')
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
              tagline: content.tagline || slide.tagline,
              title: content.title || slide.title,
              description: formattedDescription,
            };
          });

          newPost = { topic, type, content: newSlides, templateId: randomCarouselTemplate.id };
          setActiveCarouselTopic(topic);
          break;

        case 'doyouknow':
          const randomDoYouKnowTemplateIndex = Math.floor(Math.random() * doYouKnowTemplates.length);
          const randomDoYouKnowTemplate = doYouKnowTemplates[randomDoYouKnowTemplateIndex];
          const doYouKnowResponse = await generateDoYouKnow({ topic }).unwrap();
          const generatedDoYouKnowContent = doYouKnowResponse.data;

          const newDoYouKnowSlide: DoYouKnowContent = {
            title: generatedDoYouKnowContent.title || randomDoYouKnowTemplate.slides[0].title,
            fact: generatedDoYouKnowContent.description || randomDoYouKnowTemplate.slides[0].fact,
            footer: randomDoYouKnowTemplate.slides[0].footer,
            websiteUrl: randomDoYouKnowTemplate.slides[0].websiteUrl || '',
            imageUrl: randomDoYouKnowTemplate.slides[0].imageUrl || '',
          };
          console.log('newDoYouKnowSlide', newDoYouKnowSlide);

          newPost = { topic, type, content: newDoYouKnowSlide, templateId: randomDoYouKnowTemplate.id };
          setActiveDoYouKnowTopic(topic);
          break;

        default:
          throw new Error(`Unknown post type: ${type}`);
      }

      const updatedPosts = [...posts.filter((p) => p.topic !== topic), newPost];
      setLocalPosts(updatedPosts);
      // dispatch(setPosts(updatedPosts));
    } catch (err) {
      console.error(`Error generating post for ${topic}:`, err);
      setErrorMap((prev) => ({
        ...prev,
        [topic]: err instanceof Error ? err.message : 'An error occurred',
      }));
    } finally {
      setIsLoadingMap((prev) => ({ ...prev, [topic]: false }));
    }
  };

  const handleImageGenerated = (topic: string, image: string) => {
    const updatedPosts = posts.map((post) =>
      post.topic === topic && post.type === 'image'
        ? {
            ...post,
            images: [{ url: image, label: 'Image Post' }],
            content: { ...(post.content as ImageContent), imageUrl: image },
          }
        : post
    );
    setLocalPosts(updatedPosts);
    // dispatch(setPosts(updatedPosts));
    setActiveImageTopic(null);
  };

  const handleImageUpdated = async (topic: string, updatedSlide: ImageSlide, imageRef: HTMLDivElement) => {
    try {
      const canvas = await html2canvas(imageRef, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, `${topic}-image.png`);
      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to upload image');

      const updatedPosts = posts.map((post) =>
        post.topic === topic && post.type === 'image'
          ? {
              ...post,
              content: {
                title: updatedSlide.title,
                description: updatedSlide.description,
                footer: updatedSlide.footer,
                websiteUrl: updatedSlide.websiteUrl,
                imageUrl: cloudinaryUrl,
              },
              images: [{ url: cloudinaryUrl, label: 'Image Post' }],
            }
          : post
      );
      setLocalPosts(updatedPosts);
      // dispatch(setPosts(updatedPosts));
      setEditImageTopic(null);
    } catch (error) {
      console.error('Error uploading image screenshot:', error);
    }
  };

  const handleCarouselImagesGenerated = (topic: string, images: string[]) => {
    const labeledImages = images.map((url, idx) => ({ url, label: `Carousel Slide ${idx + 1}` }));
    const updatedPosts = posts.map((post) =>
      post.topic === topic && post.type === 'carousel' ? { ...post, images: labeledImages } : post
    );
    setLocalPosts(updatedPosts);
    // dispatch(setPosts(updatedPosts));
    setActiveCarouselTopic(null);
    setEditCarouselTopic(topic);
  };

  const handleCarouselUpdated = (topic: string, updatedSlides: Slide[], images: string[]) => {
    const labeledImages = images.map((url, idx) => ({
      url: url,
      label: `Carousel Slide ${idx + 1}`,
    }));
    const updatedPosts = posts.map((post) =>
      post.topic === topic && post.type === 'carousel'
        ? { ...post, content: updatedSlides, images: labeledImages }
        : post
    );
    setLocalPosts(updatedPosts);
    // dispatch(setPosts(updatedPosts));
    setEditCarouselTopic(null);
  };

  const handleDoYouKnowImagesGenerated = (topic: string, image: string) => {
    const updatedPosts = posts.map((post) =>
      post.topic === topic && post.type === 'doyouknow'
        ? {
            ...post,
            images: [{ url: image, label: 'Do You Know' }],
            content: { ...(post.content as DoYouKnowContent), imageUrl: image },
          }
        : post
    );
    setLocalPosts(updatedPosts);
    // dispatch(setPosts(updatedPosts));
    setActiveDoYouKnowTopic(null);
  };

  const handleDoYouKnowUpdated = async (topic: string, updatedSlide: DoYouKnowSlide, doYouKnowRef: HTMLDivElement) => {
    try {
      const canvas = await html2canvas(doYouKnowRef, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, `${topic}-doyouknow.png`);
      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to upload Do You Know image');

      const updatedPosts = posts.map((post) =>
        post.topic === topic && post.type === 'doyouknow'
          ? {
              ...post,
              content: {
                title: updatedSlide.title,
                fact: updatedSlide.fact,
                footer: updatedSlide.footer,
                websiteUrl: updatedSlide.websiteUrl,
                imageUrl: cloudinaryUrl,
              },
              images: [{ url: cloudinaryUrl, label: 'Do You Know' }],
            }
          : post
      );
      setLocalPosts(updatedPosts);
      // dispatch(setPosts(updatedPosts));
      setEditDoYouKnowTopic(null);
    } catch (error) {
      console.error('Error uploading Do You Know screenshot:', error);
    }
  };

  const handleBack = () => {
    navigate('/topic');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-white ml-4">Auto Post Creator</h2>
        </div>
      </div>

      {topics.length === 0 ? (
        <p className="text-gray-300">No topics selected. Please go back and select topics.</p>
      ) : topics.length < 7 ? (
        <p className="text-red-500">Please select exactly 7 topics to proceed.</p>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, index) => {
            const post = posts.find((p) => p.topic === topic);
            const isLoading = isLoadingMap[topic] || false;
            const error = errorMap[topic];

            return (
              <div key={topic} className="bg-gray-800 p-4 rounded-lg border border-yellow-500/50">
                <div className="flex items-center justify-between">
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-white">
                      {topic} ({postTypes[index]})
                    </h3>
                    {isLoading && <p className="text-gray-500 mt-2">Generating...</p>}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {post && (
                      <div className="mt-2">
                        {post.type === 'image' ? (
                          <>
                            {activeImageTopic === topic && !editImageTopic ? (
                              <ImageGeneration
                                onImagesGenerated={(image) => handleImageGenerated(topic, image)}
                                initialSlide={post.content as ImageContent}
                                templateId={post.templateId || imageTemplates[0].id}
                                topic={topic}
                              />
                            ) : editImageTopic === topic ? (
                              <ImageGeneration
                                onSave={(updatedSlide, ref) => handleImageUpdated(topic, updatedSlide, ref)}
                                initialSlide={post.content as ImageContent}
                                templateId={post.templateId || imageTemplates[0].id}
                                topic={topic}
                              />
                            ) : post.images ? (
                              <div>
                                {post.images.map((img, idx) => (
                                  <div key={idx}>
                                    <img
                                      src={img.url}
                                      alt={img.label}
                                      className="w-32 h-32 object-cover inline-block mr-2"
                                    />
                                    <span className="text-gray-300">{img.label}</span>
                                  </div>
                                ))}
                                <button
                                  onClick={() => setEditImageTopic(topic)}
                                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                >
                                  Edit Image
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditImageTopic(topic)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                              >
                                Edit Image
                              </button>
                            )}
                          </>
                        ) : post.type === 'carousel' ? (
                          <>
                            {activeCarouselTopic === topic && !editCarouselTopic ? (
                              <Carousel
                                initialTopic={topic}
                                template={post.templateId || carouselTemplates[0].id}
                                slides={post.content as Slide[]}
                                onImagesGenerated={(images) => handleCarouselImagesGenerated(topic, images)}
                              />
                            ) : editCarouselTopic === topic ? (
                              <Carousel
                                initialTopic={topic}
                                template={post.templateId || carouselTemplates[0].id}
                                slides={post.content as Slide[]}
                                onSave={(updatedSlides, images) => handleCarouselUpdated(topic, updatedSlides, images)}
                              />
                            ) : post.images ? (
                              <div>
                                {post.images.map((img, idx) => (
                                  <div key={idx}>
                                    <img
                                      src={img.url}
                                      alt={img.label}
                                      className="w-32 h-32 object-cover inline-block mr-2"
                                    />
                                    <span className="text-gray-300">{img.label}</span>
                                  </div>
                                ))}
                                <button
                                  onClick={() => setEditCarouselTopic(topic)}
                                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                >
                                  Edit Carousel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditCarouselTopic(topic)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                              >
                                Edit Carousel
                              </button>
                            )}
                          </>
                        ) : post.type === 'doyouknow' ? (
                          <>
                            {activeDoYouKnowTopic === topic && !editDoYouKnowTopic ? (
                              <DoYouKnow
                                onImagesGenerated={(image) => handleDoYouKnowImagesGenerated(topic, image)}
                                initialSlide={post.content as DoYouKnowContent}
                                templateId={post.templateId || doYouKnowTemplates[0].id}
                              />
                            ) : editDoYouKnowTopic === topic ? (
                              <DoYouKnow
                                onSave={(updatedSlide, ref) => handleDoYouKnowUpdated(topic, updatedSlide, ref)}
                                initialSlide={post.content as DoYouKnowContent}
                                templateId={post.templateId || doYouKnowTemplates[0].id}
                              />
                            ) : post.images ? (
                              <div>
                                {post.images.map((img, idx) => (
                                  <div key={idx}>
                                    <img
                                      src={img.url}
                                      alt={img.label}
                                      className="w-32 h-32 object-cover inline-block mr-2"
                                    />
                                    <span className="text-gray-300">{img.label}</span>
                                  </div>
                                ))}
                                <button
                                  onClick={() => setEditDoYouKnowTopic(topic)}
                                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                >
                                  Edit Do You Know
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditDoYouKnowTopic(topic)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                              >
                                Edit Do You Know
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <motion.button
                    onClick={() => generatePost(topic, index)}
                    disabled={isLoading}
                    className="ml-4 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {isLoading ? 'Generating...' : post ? 'Regenerate' : 'Generate'}
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};