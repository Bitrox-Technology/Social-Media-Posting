import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { saveAs } from 'file-saver';
import { usePalette } from 'color-thief-react';
import { createRoot } from 'react-dom/client';
import { useTheme } from '../../context/ThemeContext';

// Define the Cv interface for OpenCV.js
interface Cv {
  imread: (canvas: HTMLCanvasElement) => any;
  cvtColor: (src: any, dst: any, code: number, dstCn?: number) => void;
  threshold: (src: any, dst: any, thresh: number, maxval: number, type: number) => void;
  findContours: (
    src: any,
    contours: any,
    hierarchy: any,
    mode: number,
    method: number
  ) => void;
  boundingRect: (contour: any) => { x: number; y: number; width: number; height: number };
  Mat: new () => any;
  MatVector: new () => any;
  COLOR_RGBA2GRAY: number;
  THRESH_BINARY_INV: number;
  RETR_EXTERNAL: number;
  CHAIN_APPROX_SIMPLE: number;
}

declare const cv: Cv;

declare global {
  interface Window {
    openCvReady: boolean;
  }
}

// Ensure OpenCV.js is loaded
const waitForOpenCv = () => {
  return new Promise((resolve, reject) => {
    const checkOpenCv = () => {
      if (window.openCvReady) {
        if (typeof cv === 'undefined') {
          reject(new Error('OpenCV.js loaded, but `cv` object is undefined.'));
        } else {
          resolve(true);
        }
      } else {
        setTimeout(checkOpenCv, 100);
      }
    };
    checkOpenCv();
  });
};

// Step 1: Analyze the Reference (layout, text, imagery)
const analyzeLayoutWithOpenCv = async (imageSrc: string): Promise<any> => {
  await waitForOpenCv();

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');
        ctx.drawImage(img, 0, 0);

        const src = cv.imread(canvas);
        const gray = new cv.Mat();
        const thresh = new cv.Mat();
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();

        // Convert to grayscale and threshold to find elements
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(gray, thresh, 200, 255, cv.THRESH_BINARY_INV);
        cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        const layout = [];
        let productImageRegion = null;

        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i);
          const rect = cv.boundingRect(contour);
          const area = rect.width * rect.height;

          if (area < 500) continue;

          let type = 'text';
          let id = 'body';

          if (rect.y < 100) {
            id = 'header';
          } else if (rect.y > canvas.height - 100) {
            id = 'footer';
          } else if (rect.width < 300 && rect.height < 100) {
            id = 'cta';
          }

          if (rect.width < 200 && rect.height < 100 && (rect.x < 100 || rect.x > canvas.width - 300) && rect.y < 100) {
            type = 'logo';
            id = 'logo';
          }

          // Detect potential product image (large central region)
          if (rect.width > 300 && rect.height > 300 && rect.x > 200 && rect.x < canvas.width - 200 && rect.y > 200 && rect.y < canvas.height - 200) {
            type = 'product';
            id = 'product';
            productImageRegion = rect;
          }

          layout.push({
            type,
            coordinates: rect,
            id,
          });
        }

        src.delete();
        gray.delete();
        thresh.delete();
        contours.delete();
        hierarchy.delete();

        resolve({ layout, productImageRegion });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

// Extract text via OCR
const performOCR = async (imageSrc: string): Promise<any> => {
  try {
    const { data } = await Tesseract.recognize(imageSrc, 'eng', {
      logger: (m) => console.log(m),
    });

    const textRegions = data.text.split('\n').filter((line: string) => line.trim()).map((line: string, index: number) => ({
      text: line.trim(),
      bbox: null,
      confidence: null,
      id: index,
      fontStyle: approximateFontStyle(line),
    }));

    return { textRegions };
  } catch (error) {
    console.error('Error in performOCR:', error);
    return { textRegions: [] };
  }
};

// Approximate font style based on text characteristics
const approximateFontStyle = (text: string): { family: string; weight: string; size: string } => {
  if (text === text.toUpperCase()) {
    return { family: 'Raleway, sans-serif', weight: '800', size: '5xl' };
  } else if (text.length > 50) {
    return { family: 'Open Sans, sans-serif', weight: '400', size: '2xl' };
  } else {
    return { family: 'Open Sans, sans-serif', weight: '600', size: 'lg' };
  }
};

// Extract dominant colors
const extractDominantColors = async (imageSrc: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const ColorExtractor = ({ onColorsExtracted }: { onColorsExtracted: (colors: string[]) => void }) => {
      const { data, error } = usePalette(imageSrc, 5, 'hex', { crossOrigin: 'anonymous', quality: 10 });

      React.useEffect(() => {
        if (error) {
          reject(new Error('Failed to extract colors with color-thief-react'));
          return;
        }
        if (data) {
          onColorsExtracted(data);
        }
      }, [data, error]);

      return null;
    };

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    const root = createRoot(tempContainer);
    root.render(
      <ColorExtractor
        onColorsExtracted={(colors) => {
          resolve(colors);
          setTimeout(() => {
            root.unmount();
            document.body.removeChild(tempContainer);
          }, 0);
        }}
      />
    );
  });
};

// Step 2: Plan New Content (Generate new text based on competitor's text)
const generateNewText = (competitorTextRegions: any[], userBrandName: string): any => {
  const newTextRegions = competitorTextRegions.map((region: any) => {
    let newText = region.text;

    // Replace competitor brand name with user's brand name
    newText = newText.replace(/COMPETITOR/gi, userBrandName.toUpperCase());
    newText = newText.replace(/@competitor/gi, `@${userBrandName.toLowerCase()}`);

    // Simple text transformation for common phrases
    if (newText.includes('50% OFF SALE')) {
      newText = `Huge 50% Off Sale at ${userBrandName.toUpperCase()}!`;
    } else if (newText.includes('Shop now')) {
      newText = `Discover Deals at ${userBrandName}!`;
    }

    return {
      ...region,
      text: newText,
    };
  });

  return newTextRegions;
};

// Step 5: Detect and Recolor Shapes (Simplified - detect banners as large rectangular regions)
const detectShapes = (layout: any[]): any[] => {
  return layout.filter((item: any) => {
    // Assume large rectangular regions (not classified as text/logo/product) are shapes/banners
    return (
      item.type !== 'text' &&
      item.type !== 'logo' &&
      item.type !== 'product' &&
      item.coordinates.width > 400 &&
      item.coordinates.height > 50 &&
      item.coordinates.height < 200
    );
  }).map((item: any) => ({
    type: 'banner',
    coordinates: item.coordinates,
  }));
};

// Step 3 & 4: Generate New Template with User's Brand Elements and Styles
const generateTemplate = (
  layout: any[],
  shapes: any[],
  colors: string[],
  userBrand: { logo: string; primaryColor: string; font: string; name: string },
  userContent: { title: string; body: string; ctaText: string; ctaUrl: string; footer: string; productImage?: string },
  fontStyles: { [key: string]: { family: string; weight: string; size: string } },
  backgroundImageSrc: string
): any => {
  const logoPosition = layout.find((item: any) => item.type === 'logo')?.coordinates || {
    x: 50,
    y: 50,
    width: 150,
    height: 60,
  };
  const headerPosition = layout.find((item: any) => item.id === 'header')?.coordinates || {
    x: 300,
    y: 50,
    width: 500,
    height: 100,
  };
  const bodyPosition = layout.find((item: any) => item.id === 'body')?.coordinates || {
    x: 340,
    y: 400,
    width: 400,
    height: 200,
  };
  const ctaPosition = layout.find((item: any) => item.id === 'cta')?.coordinates || {
    x: 800,
    y: 900,
    width: 200,
    height: 80,
  };
  const footerPosition = layout.find((item: any) => item.id === 'footer')?.coordinates || {
    x: 50,
    y: 900,
    width: 200,
    height: 80,
  };
  const productPosition = layout.find((item: any) => item.id === 'product')?.coordinates || {
    x: 340,
    y: 200,
    width: 400,
    height: 400,
  };

  const template: any = {
    id: 'recreated-competitor-template',
    name: 'Recreated Competitor Style Template',
    coverImageUrl: '',
    slides: [
      {
        title: userContent.title,
        body: userContent.body,
        ctaText: userContent.ctaText,
        ctaUrl: userContent.ctaUrl,
        footer: userContent.footer,
        productImage: userContent.productImage,
        slideNumber: 1,
      },
    ],
    renderSlide: (slide: any, addLogo: boolean, defaultLogoUrl: string) => {
      const textColor = colors[0] || '#FFFFFF';
      const accentColor = 'var(--color-accent)';
      const primaryColor = 'var(--color-primary)';
      const secondaryColor = 'var(--color-secondary)';

      return (
        <div
          className="relative w-[1080px] h-[1080px] rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url(${backgroundImageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-30 z-10" />

          {/* Render detected shapes (e.g., banners) with user's primary color */}
          {shapes.map((shape: any, index: number) => (
            <div
              key={`shape-${index}`}
              className="absolute z-15"
              style={{
                left: `${shape.coordinates.x}px`,
                top: `${shape.coordinates.y}px`,
                width: `${shape.coordinates.width}px`,
                height: `${shape.coordinates.height}px`,
                backgroundColor: primaryColor,
                opacity: 0.9,
              }}
            />
          ))}

          {/* Logo */}
          {addLogo && (
            <img
            src={userBrand.logo || defaultLogoUrl}
              alt="Logo"
              className="absolute z-20"
              style={{
                left: `${logoPosition.x}px`,
                top: `${logoPosition.y}px`,
                width: `${logoPosition.width}px`,
                height: `${logoPosition.height}px`,
                objectFit: 'contain',
              }}
            />
          )}

          {/* Product Image */}
          {slide.productImage && (
            <img
              src={slide.productImage}
              alt="Product"
              className="absolute z-20"
              style={{
                left: `${productPosition.x}px`,
                top: `${productPosition.y}px`,
                width: `${productPosition.width}px`,
                height: `${productPosition.height}px`,
                objectFit: 'contain',
              }}
            />
          )}

          {/* Title Section */}
          <div
            className={`absolute z-20 text-${fontStyles.header?.size || '5xl'} leading-tight`}
            style={{
              left: `${headerPosition.x}px`,
              top: `${headerPosition.y}px`,
              width: `${headerPosition.width}px`,
              height: `${headerPosition.height}px`,
              fontFamily: userBrand.font,
            }}
          >
            <h2
              style={{
                color: textColor,
                fontWeight: fontStyles.header?.weight || 800,
                textTransform: 'uppercase',
              }}
            >
              {slide.title}
            </h2>
            <div className="mt-4 w-32 h-1">
              <svg viewBox="0 0 100 2" className="w-full h-full">
                <line x1="0" y1="1" x2="100" y2="1" stroke={secondaryColor} strokeWidth="4" />
                <circle cx="0" cy="1" r="6" fill={secondaryColor} />
                <circle cx="100" cy="1" r="6" fill={secondaryColor} />
              </svg>
            </div>
          </div>

          {/* Body Text */}
          <div
            className={`absolute z-20 text-${fontStyles.body?.size || '2xl'} leading-relaxed`}
            style={{
              left: `${bodyPosition.x}px`,
              top: `${bodyPosition.y}px`,
              width: `${bodyPosition.width}px`,
              height: `${bodyPosition.height}px`,
              fontFamily: userBrand.font,
            }}
          >
            <p
              style={{
                color: textColor,
                fontWeight: fontStyles.body?.weight || 400,
              }}
            >
              {slide.body}
            </p>
          </div>

          {/* Call-to-Action Button */}
          <div
            className={`absolute z-20 text-${fontStyles.cta?.size || 'lg'}`}
            style={{
              left: `${ctaPosition.x}px`,
              top: `${ctaPosition.y}px`,
              width: `${ctaPosition.width}px`,
              height: `${ctaPosition.height}px`,
              fontFamily: userBrand.font,
            }}
          >
            <a
              href={slide.ctaUrl}
              className="inline-block px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: accentColor,
                color: '#FFFFFF',
                fontWeight: fontStyles.cta?.weight || 600,
              }}
            >
              {slide.ctaText}
            </a>
          </div>

          {/* Footer */}
          <div
            className={`absolute z-20 text-${fontStyles.footer?.size || 'lg'}`}
            style={{
              left: `${footerPosition.x}px`,
              top: `${footerPosition.y}px`,
              width: `${footerPosition.width}px`,
              height: `${footerPosition.height}px`,
              fontFamily: userBrand.font,
            }}
          >
            <span
              style={{
                color: textColor,
                fontWeight: fontStyles.footer?.weight || 400,
              }}
            >
              {slide.footer}
            </span>
          </div>
        </div>
      );
    },
  };

  return template;
};

const CompetitorPostAnalyzer: React.FC = () => {
  const { theme } = useTheme();
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [userProductImage, setUserProductImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const competitorFileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const userBrand = {
    logo: '/images/user-logo.png',
    primaryColor: 'var(--color-primary)',
    font: 'Roboto, sans-serif',
    name: 'YourBrand',
  };

  const handleCompetitorImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    const imageSrc = URL.createObjectURL(file);
    setCompetitorImage(imageSrc);

    try {
      // Step 1: Analyze the layout and detect product image region
      const { layout, productImageRegion } = await analyzeLayoutWithOpenCv(imageSrc);

      // Detect shapes (e.g., banners)
      const shapes = detectShapes(layout);

      // Extract text via OCR
      const ocrResults = await performOCR(imageSrc);
      const competitorTextRegions = ocrResults.textRegions;

      // Step 2: Generate new text based on competitor's text
      const newTextRegions = generateNewText(competitorTextRegions, userBrand.name);

      // Map text regions to layout elements
      const fontStyles: { [key: string]: { family: string; weight: string; size: string } } = {
        header: newTextRegions.find((region: any) => region.id === 0)?.fontStyle || {
          family: 'Raleway, sans-serif',
          weight: '800',
          size: '5xl',
        },
        body: newTextRegions.find((region: any) => region.id === 1)?.fontStyle || {
          family: 'Open Sans, sans-serif',
          weight: '400',
          size: '2xl',
        },
        cta: newTextRegions.find((region: any) => region.id === 2)?.fontStyle || {
          family: 'Open Sans, sans-serif',
          weight: '600',
          size: 'lg',
        },
        footer: newTextRegions.find((region: any) => region.id === 3)?.fontStyle || {
          family: 'Open Sans, sans-serif',
          weight: '400',
          size: 'lg',
        },
      };

      const userContent = {
        title: newTextRegions.find((region: any) => region.id === 0)?.text || 'Huge 50% Off Sale at YourBrand!',
        body: newTextRegions.find((region: any) => region.id === 1)?.text || 'Discover Deals at YourBrand!',
        ctaText: newTextRegions.find((region: any) => region.id === 2)?.text || 'Buy Now',
        ctaUrl: 'https://bitrox.tech',
        footer: newTextRegions.find((region: any) => region.id === 3)?.text || '@bitrox.tech',
        productImage: userProductImage ?? undefined,
      };

      // Extract dominant colors (used for text and fallback)
      let colors: string[] = [];
      try {
        colors = await extractDominantColors(imageSrc);
      } catch (colorError) {
        console.error('Color extraction failed, using fallback colors:', colorError);
        colors = ['#FFFFFF', 'var(--color-accent)', '#2D3436', '#636E72', '#DFE6E9'];
      }

      // Step 3 & 4: Generate the template with user's brand elements and styles
      const newTemplate = generateTemplate(layout, shapes, colors, userBrand, userContent, fontStyles, imageSrc);
      setGeneratedTemplate(newTemplate);
    } catch (error) {
      console.error('Error analyzing competitor post:', error);
      setErrorMessage('Failed to analyze the competitor post. Please try again with a different image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUserProductImage(URL.createObjectURL(file));
  };

  const handleDownloadTemplate = () => {
    if (!generatedTemplate) return;
    const templateJson = JSON.stringify(generatedTemplate, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    saveAs(blob, 'recreated-competitor-template.json');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Competitor Post Style Recreation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload a competitor's social media post image to recreate its style with your brand’s elements, layout, and colors.
        </p>

        <div className="mb-6">
          <label
            htmlFor="competitorImageUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Upload Competitor Post Image
          </label>
          <input
            id="competitorImageUpload"
            type="file"
            accept="image/*"
            ref={competitorFileInputRef}
            onChange={handleCompetitorImageUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-gray-300 hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="productImageUpload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Upload Your Product Image (Optional)
          </label>
          <input
            id="productImageUpload"
            type="file"
            accept="image/*"
            ref={productFileInputRef}
            onChange={handleProductImageUpload}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-700 file:text-blue-700 dark:file:text-gray-300 hover:file:bg-blue-100 dark:hover:file:bg-gray-600"
          />
        </div>

        {isAnalyzing && (
          <div className="flex items-center justify-center mb-6">
            <svg
              className="animate-spin h-8 w-8 mr-3"
              style={{ color: 'var(--color-primary)' }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Analyzing competitor post...
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
            <p>{errorMessage}</p>
          </div>
        )}

        {competitorImage && !isAnalyzing && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Competitor Post Preview
            </h3>
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
              <img src={competitorImage} alt="Competitor Post" className="max-w-full h-auto" />
            </div>
          </div>
        )}

        {generatedTemplate && !isAnalyzing && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Recreated Template Preview
            </h3>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-700">
              {generatedTemplate.renderSlide(generatedTemplate.slides[0], true, userBrand.logo)}
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="mt-4 px-6 py-2 rounded-full text-white transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Download Template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorPostAnalyzer;