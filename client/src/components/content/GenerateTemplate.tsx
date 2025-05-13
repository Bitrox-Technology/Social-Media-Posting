import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { useGenerateCodeMutation } from '../../store/api';
import * as tf from '@tensorflow/tfjs';

// Validation schema with Yup
const validationSchema = Yup.object({
  image: Yup.mixed()
    .required('Image is required')
    .test('fileType', 'Only JPG/PNG images are allowed', (value) =>
      value instanceof File ? ['image/jpeg', 'image/png'].includes(value.type) : false
    )
    .test('fileSize', 'Image size must be less than 5MB', (value) =>
      value instanceof File ? value.size <= 5 * 1024 * 1024 : false
    ),
  code: Yup.string()
    .required('Code is required')
    .min(10, 'Code must be at least 10 characters'),
});

const CodeGeneratorForm: React.FC = () => {
  const [generateCode, { isLoading, error }] = useGenerateCodeMutation();
  const [responseData, setResponseData] = useState<any>(null);

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

const extractBackground = async (imageElement: any) => {
  setProcessing(true);
  setProgress(10);
  
  try {
    // Create canvas and get pixel data directly
    const canvas = document.createElement('canvas');
    const width = imageElement.width;
    const height = imageElement.height;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Couldn't get canvas context");
    }
    
    // Draw the image to the canvas
    ctx.drawImage(imageElement, 0, 0);
    setProgress(30);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Create background buffer
    const backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.width = width;
    backgroundCanvas.height = height;
    
    const bgCtx = backgroundCanvas.getContext('2d');
    if (!bgCtx) {
      throw new Error("Couldn't get background canvas context");
    }
    
    // First, copy original image to background
    bgCtx.drawImage(imageElement, 0, 0);
    const bgImageData = bgCtx.getImageData(0, 0, width, height);
    const bgData = bgImageData.data;
    
    setProgress(50);
    
    // Create mask for foreground elements
    const foregroundMask = new Uint8Array(width * height);
    
    // Detect foreground elements (non-blue areas)
    // For the ASI image specifically
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Specific to ASI image - detect bright UI elements and icons
      // These are typically brighter and less blue than the background
      const brightness = (r + g + b) / 3;
      const isBlue = b > Math.max(r, g) * 1.1;
      const isDark = brightness < 80;
      
      // Mark as foreground (1) if it's not dark blue
      foregroundMask[i/4] = (isBlue && isDark) ? 0 : 1;
    }
    
    setProgress(70);
    
    // Expand foreground mask slightly to cover edges
    const expandedMask = expandMask(foregroundMask, width, height);
    
    // Apply inpainting - simple replacement with blue background color
    // For ASI image, we'll use the deep blue color from the image
    const backgroundBlue = [10, 20, 40, 255]; // Dark blue background color
    
    for (let i = 0; i < data.length; i += 4) {
      if (expandedMask[i/4] === 1) {
        // This is foreground - replace with background color
        bgData[i] = backgroundBlue[0];
        bgData[i+1] = backgroundBlue[1];
        bgData[i+2] = backgroundBlue[2];
        bgData[i+3] = backgroundBlue[3];
      }
    }
    
    setProgress(90);
    
    // Put the processed data back on the canvas
    bgCtx.putImageData(bgImageData, 0, 0);
    
    // Apply a slight blur to smooth everything
    bgCtx.filter = 'blur(4px)';
    bgCtx.drawImage(backgroundCanvas, 0, 0);
    bgCtx.filter = 'none';
    
    // Set the background image
    setBackgroundImage(backgroundCanvas.toDataURL());
    setProgress(100);
    
  } catch (error) {
    console.error("Error extracting background:", error);
  } finally {
    setProcessing(false);
  }
};

// Helper function to expand mask to cover edges better
const expandMask = (mask: Uint8Array, width: number, height: number): Uint8Array => {
  const expanded = new Uint8Array(mask.length);
  const kernelSize = 3;
  const halfKernel = Math.floor(kernelSize / 2);
  
  // Copy original mask
  expanded.set(mask);
  
  // Expand foreground regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      
      // Skip if already foreground
      if (mask[idx] === 1) {
        continue;
      }
      
      // Check neighbors
      for (let dy = -halfKernel; dy <= halfKernel; dy++) {
        for (let dx = -halfKernel; dx <= halfKernel; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          // Skip if out of bounds
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
            continue;
          }
          
          const nidx = ny * width + nx;
          
          // If neighbor is foreground, mark this pixel too
          if (mask[nidx] === 1) {
            expanded[idx] = 1;
            break;
          }
        }
        if (expanded[idx] === 1) break;
      }
    }
  }
  
  return expanded;
};

// Another approach: Simplified one-step background extraction
// This is even more targeted to the ASI image
const extractBackgroundSimple = async (imageElement: any) => {
  setProcessing(true);
  
  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    const width = imageElement.width;
    const height = imageElement.height;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Couldn't get canvas context");
    }
    
    // First, fill canvas with the dark blue color from ASI image background
    ctx.fillStyle = '#0a1428'; // Dark blue background color
    ctx.fillRect(0, 0, width, height);
    
    // Now draw just the blue parts of the original image
    ctx.drawImage(imageElement, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Go through each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Keep only pixels that match the blue background signature
      const isBackgroundBlue = (b > r * 1.2 + 10) && ((r + g + b) / 3 < 80);
      
      if (!isBackgroundBlue) {
        // Replace non-background pixels with our dark blue
        data[i] = 10;     // R
        data[i + 1] = 20; // G
        data[i + 2] = 40; // B
      }
    }
    
    // Put the processed data back
    ctx.putImageData(imageData, 0, 0);
    
    // Apply a slight blur to smooth transitions
    ctx.filter = 'blur(3px)';
    ctx.drawImage(canvas, 0, 0);
    
    // Set the background image
    setBackgroundImage(canvas.toDataURL());
    
  } catch (error) {
    console.error("Error extracting background:", error);
  } finally {
    setProcessing(false);
  }
};
  
  // Handle file upload
  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleImageUpload = (event: ImageUploadEvent): void => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img: HTMLImageElement = new Image();
        img.onload = () => {
          setOriginalImage(img);
          extractBackground(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      image: null as File | null,
      code: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.image) {
        // Create FormData object
        const formData = new FormData();
        formData.append('image', values.image);
        formData.append('code', values.code);

        try {
          const response = await generateCode(formData).unwrap();
          // Ensure response has the expected shape
          setResponseData(response.data);
        } catch (err) {
          console.error('API error:', err);
        }
      }
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Code Generator
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {/* Image Upload */}
        <Box mb={2}>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  formik.setFieldValue('image', file);
                }
              }}
            />
          </Button>
          {formik.touched.image && formik.errors.image && (
            <Typography color="error">{formik.errors.image}</Typography>
          )}
          {formik.values.image && (
            <Typography variant="body2">{formik.values.image.name}</Typography>
          )}
        </Box>

        {/* Code Input */}
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Enter Code"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !formik.isValid}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Generate Code'}
        </Button>
      </form>

      {/* API Response */}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {JSON.stringify(error)}
        </Typography>
      )}
      {responseData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Image Description:</Typography>
          <Typography>{responseData.imageDescription}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generated Code Template:
          </Typography>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {responseData}
          </pre>
        </Box>
      )}

       <div className="bg-extractor-container">
      <h2 className="text-2xl font-bold mb-4">ASI Background Extractor</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border border-gray-300 rounded p-2"
        />
      </div>
      
      {processing && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>Processing: {progress}%</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4">
        {originalImage && (
          <div>
            <h3 className="text-lg font-medium mb-2">Original Image</h3>
            <img 
              src={originalImage.src} 
              alt="Original" 
              className="max-w-md border border-gray-300 rounded"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}
        
        {backgroundImage && (
          <div>
            <h3 className="text-lg font-medium mb-2">Extracted Background</h3>
            <img 
              src={backgroundImage} 
              alt="Background" 
              className="max-w-md border border-gray-300 rounded"
              style={{ maxHeight: "400px" }}
            />
            <div className="mt-2">
              <a 
                href={backgroundImage}
                download="asi-background.png"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download Background
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
    </Box>
  );
};

export default CodeGeneratorForm;