import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../../store/appSlice';
import { useUploadImageToCloudinaryMutation } from '../../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

// Extend DoYouKnowTemplate to include a coverImage
interface ExtendedDoYouKnowTemplate {
  id: string;
  slides: DoYouKnowSlide[];
  renderSlide: (slide: DoYouKnowSlide, showLogo: boolean, logoUrl: string) => JSX.Element;
  coverImage: string; // URL to an image representing the template
}

interface DoYouKnowTemplateSelectorProps {
  initialTopic?: string;
  generatedImageUrl?: string;
  onSave?: (updatedSlide: DoYouKnowSlide, imageUrl: string) => void;
}

export const DoYouKnowTemplateSelector: React.FC<DoYouKnowTemplateSelectorProps> = ({
  initialTopic = '',
  generatedImageUrl,
  onSave,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const defaultLogoUrl = '/images/Logo1.png'; // Default logo URL
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);

  // Extend templates with cover images (using the first slide’s imageUrl or a default)
  const extendedTemplates: ExtendedDoYouKnowTemplate[] = doYouKnowTemplates.map((template) => ({
    ...template,
    coverImage: template.coverImageUrl || '/images/default-cover.jpg',
  }));

  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedDoYouKnowTemplate>(extendedTemplates[0]);
  const [slide, setSlide] = useState<DoYouKnowSlide>({
    ...extendedTemplates[0].slides[0],
    imageUrl: generatedImageUrl || extendedTemplates[0].slides[0].imageUrl,
  });
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(slide.title);
  const [customFact, setCustomFact] = useState<string>(slide.fact);
  const [customFooter, setCustomFooter] = useState<string>(slide.footer || '');
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState<string>(slide.websiteUrl || '');

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const slideRef = useRef<HTMLDivElement>(null);

  const preloadSlideImages = async (slide: DoYouKnowSlide) => {
    const images = [slide.imageUrl, showLogo ? defaultLogoUrl : ''].filter(Boolean);
    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'Anonymous';
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  useEffect(() => {
    const loadSlide = async () => {
      const updatedSlide = {
        ...selectedTemplate.slides[0],
        imageUrl: generatedImageUrl || selectedTemplate.slides[0].imageUrl,
        title: customTitle || selectedTemplate.slides[0].title,
        fact: customFact || selectedTemplate.slides[0].fact,
        footer: customFooter || selectedTemplate.slides[0].footer || '',
        websiteUrl: customWebsiteUrl || selectedTemplate.slides[0].websiteUrl || '',
      };
      await preloadSlideImages(updatedSlide);
      setSlide(updatedSlide);

      // If onSave is provided, automatically save the updated slide
      if (onSave && slideRef.current) {
        const canvas = await html2canvas(slideRef.current, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#1A2526',
          logging: true,
        });
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
        const formData = new FormData();
        formData.append('image', blob, 'do-you-know-slide.png');
        const result = await uploadImageToCloudinary(formData).unwrap();
        const cloudinaryUrl = result?.data?.secure_url;
        if (cloudinaryUrl) {
          dispatch(setSelectedFile({ name: 'do-you-know-slide.png', url: cloudinaryUrl }));
          onSave(updatedSlide, cloudinaryUrl);
        }
      }
    };
    loadSlide();
  }, [selectedTemplate, generatedImageUrl, customTitle, customFact, customFooter, customWebsiteUrl, showLogo, onSave]);

  const handleTemplateSelect = (template: ExtendedDoYouKnowTemplate) => {
    setSelectedTemplate(template);
    const newSlide = {
      ...template.slides[0],
      imageUrl: generatedImageUrl || template.slides[0].imageUrl,
      title: customTitle || template.slides[0].title,
      fact: customFact || template.slides[0].fact,
      footer: customFooter || template.slides[0].footer || '',
      websiteUrl: customWebsiteUrl || template.slides[0].websiteUrl || '',
    };
    setSlide(newSlide);
  };

  const handleBack = () => {
    dispatch(setSelectedDoYouKnowTemplate(null));
    navigate('/');
  };

  if (!slide) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Preview: {selectedTemplate.id}
          </h1>
        </div>

        {/* Left Sidebar: Template List */}
        <div className="w-full">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Do You Know Templates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto" style={{ maxHeight: '30vh' }}>
            {extendedTemplates.map((template) => (
              <div
                key={template.id}
                className={`cursor-pointer p-2 rounded-lg border ${
                  selectedTemplate.id === template.id ? 'border-yellow-500 bg-gray-800' : 'border-gray-700'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <img
                  src={template.coverImage}
                  alt={`${template.id} preview`}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-gray-300 text-sm text-center">{template.id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Template Preview */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Template Preview</h2>
          <div
            ref={slideRef}
            className="relative rounded-xl overflow-hidden max-w-2xl max-h-[600px] mx-auto"
            style={{
              background: 'linear-gradient(180deg, #1A2526 0%, #0F1516 100%)',
              width: '500px',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            {selectedTemplate.renderSlide(slide, showLogo, defaultLogoUrl)}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={showLogo}
              onChange={(e) => setShowLogo(e.target.checked)}
              className="w-5 h-5 text-yellow-400 border-gray-600 rounded focus:ring-2 focus:ring-yellow-400"
            />
            <label className="text-gray-300">Add Logo</label>
          </div>
        </motion.div>

        {/* Content Editor */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Edit Content</h2>
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                value={customTitle || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomTitle(newValue);
                  setSlide({ ...slide, title: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                placeholder="Enter the title (e.g., DID YOU KNOW?)"
              />
            </div>

            {/* Fact Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Fact</label>
              <textarea
                value={customFact || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomFact(newValue);
                  setSlide({ ...slide, fact: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600 h-24 resize-none"
                placeholder="Enter the 'Do You Know' fact here..."
              />
            </div>

            {/* Username (Footer) Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Username (e.g., @bitrox.tech)</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">@</span>
                <input
                  type="text"
                  value={customFooter || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomFooter(newValue);
                    setSlide({ ...slide, footer: newValue });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter the username (e.g., bitrox.tech)"
                />
              </div>
            </div>

            {/* Website URL Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Website URL (Optional)</label>
              <input
                type="text"
                value={customWebsiteUrl || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomWebsiteUrl(newValue);
                  setSlide({ ...slide, websiteUrl: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                placeholder="Enter the website URL (e.g., https://bitrox.tech)"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};