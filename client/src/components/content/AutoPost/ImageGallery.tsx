import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageGalleryProps {
  images: { url: string; label: string }[];
  type: 'image' | 'carousel' | 'doyouknow';
  theme: string;
  platform?: 'instagram' | 'facebook' | 'linkedin';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  type,
  theme,
  platform = 'instagram',
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return (
      <p
        className={`text-center py-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        No content available
      </p>
    );
  }

  // Determine aspect ratio based on platform
  const aspectRatio = platform === 'linkedin' ? '1200 / 627' : '1 / 1'; // 1:1 for Instagram/Facebook, 1.91:1 for LinkedIn

  if (type === 'carousel') {
    return (
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="flex-none space-y-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div
              className="relative cursor-pointer overflow-hidden rounded-lg shadow-md"
              style={{
                aspectRatio: aspectRatio, // Set aspect ratio dynamically
                width: '300px', // Fixed width for carousel items to ensure consistency
              }}
              onClick={() => setSelectedImage(img.url)}
            >
              <img
                src={img.url}
                alt={img.label}
                className="w-full h-full object-contain transition-transform hover:scale-105"
                style={{ objectFit: 'contain' }} // Ensure the full image is visible
              />
            </div>
            <p
              className={`text-xs md:text-sm text-center truncate max-w-[12rem] md:max-w-[14rem] ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {img.label}
            </p>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((img, idx) => (
        <motion.div
          key={idx}
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
            style={{
              aspectRatio: aspectRatio, // Set aspect ratio dynamically
              width: '100%', // Take full width of the parent container
              maxWidth: '500px', // Maximum width to prevent overly large images
            }}
            onClick={() => setSelectedImage(img.url)}
          >
            <img
              src={img.url}
              alt={img.label}
              className="w-full h-full object-contain transition-transform hover:scale-105"
              style={{ objectFit: 'contain' }} // Ensure the full image is visible
            />
          </div>
          <p
            className={`text-xs md:text-sm text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {img.label}
          </p>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div
              className="relative max-w-4xl max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};