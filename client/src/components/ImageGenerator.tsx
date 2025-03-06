import React, { useState } from 'react';
import { Image, Check, ArrowLeft, Film } from 'lucide-react';

interface ImageGeneratorProps {
  contentIdea: string;
  contentType: 'post' | 'reel';
  onSelect: (file: File) => void;
  onBack: () => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ contentIdea, contentType, onSelect, onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<boolean>(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSelected(false);
    }
  };

  const handleContinue = () => {
    if (uploadedFile) {
      setSelected(true);
      onSelect(uploadedFile);
    }
  };

  const isImage = contentType === 'post';
  const fileTypeLabel = isImage ? 'Image' : 'Video';
  const acceptType = isImage ? 'image/*' : 'video/*';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-white mb-2">Choose Your {fileTypeLabel}</h2>
            <p className="text-gray-400">Upload and select a {fileTypeLabel.toLowerCase()} for your content</p>
          </div>
        </div>
        <label className="flex items-center px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 cursor-pointer transition-colors">
          {isImage ? (
            <Image className="w-5 h-5 mr-2" />
          ) : (
            <Film className="w-5 h-5 mr-2" />
          )}
          Upload {fileTypeLabel}
          <input
            type="file"
            accept={acceptType}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {previewUrl && (
        <div className="grid grid-cols-1 gap-6">
          <div
            className={`relative rounded-xl overflow-hidden cursor-pointer group
              ${selected ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setSelected(true)}
          >
            {isImage ? (
              <img
                src={previewUrl}
                alt="Uploaded Image"
                className="w-full h-64 object-cover"
              />
            ) : (
              <video
                src={previewUrl}
                controls // Add controls to play the video
                className="w-full h-64 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-yellow-500 rounded-full p-2">
                {selected ? (
                  <Check className="w-6 h-6 text-black" />
                ) : isImage ? (
                  <Image className="w-6 h-6 text-black" />
                ) : (
                  <Film className="w-6 h-6 text-black" />
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-2 py-1 rounded">
              <span className="text-white font-bold">Bitrox</span>
              <span className="text-yellow-500 font-bold">AI</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!uploadedFile || !selected}
          className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue with Selected {fileTypeLabel}
        </button>
      </div>
    </div>
  );
};