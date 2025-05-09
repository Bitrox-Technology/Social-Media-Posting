import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import cv from '@techstark/opencv-js'; // OpenCV.js for browser
import chroma from 'chroma-js';
import { saveAs } from 'file-saver'; // For downloading the template
import { doYouKnowTemplates } from '../../templetes/doYouKnowTemplates'; // Assuming you have a templates directory

// Placeholder for LayoutParser (server-side processing)
const analyzeLayoutWithLayoutParser = async (imageFile: File): Promise<any> => {
  // This should be a server-side API call to a backend running LayoutParser
  // For demo purposes, we'll simulate the layout detection
  const formData = new FormData();
  formData.append('image', imageFile);

  // Simulated response: LayoutParser would return coordinates of text, images, and logos
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        layout: [
          { type: 'text', coordinates: { x: 0, y: 0, width: 1080, height: 200 }, id: 'header' }, // Top text (e.g., title)
          { type: 'image', coordinates: { x: 0, y: 200, width: 1080, height: 680 }, id: 'main-image' }, // Central image
          { type: 'text', coordinates: { x: 880, y: 880, width: 200, height: 200 }, id: 'footer' }, // Bottom-right footer/logo
        ],
      });
    }, 1000);
  });
};

// Color extraction using OpenCV.js
const extractDominantColors = async (imageSrc: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mat = cv.imread(canvas);
      const k = 5; // Number of colors to extract
      const data = new Float32Array(mat.rows * mat.cols * mat.channels());
      let sampleIndex = 0;

      for (let i = 0; i < mat.rows; i++) {
        for (let j = 0; j < mat.cols; j++) {
          const pixel = mat.ucharPtr(i, j);
          data[sampleIndex * 3] = pixel[2]; // R
          data[sampleIndex * 3 + 1] = pixel[1]; // G
          data[sampleIndex * 3 + 2] = pixel[0]; // B
          sampleIndex++;
        }
      }

      const samples = cv.matFromArray(mat.rows * mat.cols, 3, cv.CV_32F, data);
      const labels = new cv.Mat();
      const centers = new cv.Mat();
      const criteria = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10, 1.0);
      const KMEANS_RANDOM_CENTERS = 2; // Define the constant manually if missing
      cv.kmeans(samples, k, labels, criteria, 10, KMEANS_RANDOM_CENTERS, centers);

      const colors: string[] = [];
      for (let i = 0; i < k; i++) {
        const r = centers.floatPtr(i, 0)[0];
        const g = centers.floatPtr(i, 1)[0];
        const b = centers.floatPtr(i, 2)[0];
        colors.push(chroma([r, g, b]).hex());
      }

      samples.delete();
      labels.delete();
      centers.delete();
      mat.delete();

      resolve(colors);
    };
  });
};

// OCR to identify text regions and approximate font style
const performOCR = async (imageSrc: string): Promise<any[]> => {
  const { data } = await Tesseract.recognize(imageSrc, 'eng', {
    logger: (m) => console.log(m),
  });

  return data.text.split('\n').map((line: string, index: number) => ({
    text: line,
    bbox: null, // Bounding box is not available in this case
    confidence: null, // Confidence is not available in this case
    id: index,
  }));
};

// Generate a new template based on the analyzed layout and colors
const generateTemplate = (
  layout: any[],
  colors: string[],
  userBrand: { logo: string; primaryColor: string; font: string }
): any => {
  const template: any = {
    id: 'custom-competitor-template',
    name: 'Competitor-Inspired Template',
    coverImageUrl: '',
    slides: [
      {
        title: 'YOUR TITLE HERE',
        fact: 'Your description or fact goes here.',
        imageUrl: '',
        footer: 'yourbrand.com',
        websiteUrl: 'https://yourbrand.com',
        slideNumber: 1,
      },
    ],
    renderSlide: (slide: any, addLogo: boolean, defaultLogoUrl: string) => {
      // Use the dominant colors from the competitor's post
      const textColor = colors[0]; // Most dominant color for text
      const accentColor = colors[1]; // Second dominant color for accents
      const backgroundColor = colors[2]; // Third dominant color for background

      return (
        <div
          className="relative w-[1080px] h-[1080px] rounded-lg overflow-hidden flex flex-col justify-between text-white"
          style={{
            background: `linear-gradient(to bottom, ${backgroundColor}, ${chroma(backgroundColor).darken().hex()})`,
          }}
        >
          {/* Logo */}
          {addLogo && (
            <img
              src={userBrand.logo || defaultLogoUrl}
              alt="Logo"
              className="absolute top-8 right-8 w-48 h-24 object-contain z-20"
            />
          )}

          {/* Content Section */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-16">
            {/* Title */}
            <h2
              className="text-6xl font-bold mb-6 leading-tight text-center"
              style={{
                color: textColor,
                fontFamily: userBrand.font || 'Arial, sans-serif',
                textShadow: `0 0 10px ${textColor}, 0 0 20px ${textColor}`,
              }}
            >
              {slide.title}
            </h2>

            {/* Fact/Description */}
            <p
              className="text-3xl max-w-4xl text-center leading-relaxed"
              style={{
                color: textColor,
                fontFamily: userBrand.font || 'Arial, sans-serif',
                textShadow: `0 0 5px ${textColor}, 0 0 10px ${textColor}`,
              }}
            >
              {slide.fact}
            </p>
          </div>

          {/* Bottom Section */}
          <div className="relative z-10 flex justify-between items-center pb-16 px-16">
            <span
              className="text-2xl"
              style={{ color: accentColor, fontFamily: userBrand.font || 'Arial, sans-serif' }}
            >
              @{slide.footer}
            </span>
            <a
              href={slide.websiteUrl}
              className="text-2xl hover:underline"
              style={{ color: accentColor, fontFamily: userBrand.font || 'Arial, sans-serif' }}
            >
              {slide.websiteUrl}
            </a>
          </div>
        </div>
      );
    },
  };

  return template;
};

const CompetitorPostAnalyzer: React.FC = () => {
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User's brand settings (mocked for this example)
  const userBrand = {
    logo: '/images/user-logo.png',
    primaryColor: '#4A90E2',
    font: 'Roboto, sans-serif',
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const imageSrc = URL.createObjectURL(file);
    setCompetitorImage(imageSrc);

    try {
      // Step 1: Analyze layout with LayoutParser
      const layoutResult = await analyzeLayoutWithLayoutParser(file);
      const layout = layoutResult.layout;

      // Step 2: Extract dominant colors
      const colors = await extractDominantColors(imageSrc);
      console.log('Dominant Colors:', colors);

      // Step 3: Perform OCR to identify text regions (optional for font approximation)
      const ocrResults = await performOCR(imageSrc);
      console.log('OCR Results:', ocrResults);

      // Step 4: Generate a new template
      const newTemplate = generateTemplate(layout, colors, userBrand);
      setGeneratedTemplate(newTemplate);
    } catch (error) {
      console.error('Error analyzing competitor post:', error);
      alert('Failed to analyze the competitor post. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!generatedTemplate) return;
    const templateJson = JSON.stringify(generatedTemplate, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    saveAs(blob, 'custom-competitor-template.json');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Competitor Post Analyzer</h2>
      <p className="mb-4">
        Upload a competitor's social media post image to analyze its layout and style, and generate a similar template for your brand.
      </p>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="mb-4 p-2 border rounded"
      />

      {isAnalyzing && (
        <div className="flex items-center justify-center mb-4">
          <p className="text-lg">Analyzing competitor post...</p>
        </div>
      )}

      {/* Preview Competitor Image */}
      {competitorImage && !isAnalyzing && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Competitor Post Preview</h3>
          <img src={competitorImage} alt="Competitor Post" className="max-w-full h-auto rounded-lg" />
        </div>
      )}

      {/* Generated Template Preview */}
      {generatedTemplate && !isAnalyzing && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Generated Template Preview</h3>
          <div className="border rounded-lg p-4">
            {generatedTemplate.renderSlide(
              generatedTemplate.slides[0],
              true,
              userBrand.logo
            )}
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download Template
          </button>
        </div>
      )}
    </div>
  );
};

export default CompetitorPostAnalyzer;