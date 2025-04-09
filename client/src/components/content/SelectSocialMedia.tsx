import React, { useState } from 'react';

export const SelectSocialMedia: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    console.log("Scheduled for platforms:", selectedPlatforms);
    // Add scheduling logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Select Social Media</h1>
      <div className="flex space-x-4 mb-6">
        {["linkedin", "instagram", "facebook"].map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformSelect(platform)}
            className={`px-4 py-2 rounded-lg shadow-md ${
              selectedPlatforms.includes(platform)
                ? "bg-blue-600"
                : "bg-gray-700"
            } hover:bg-blue-700 transition duration-300`}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>
      <button
        onClick={handleSchedule}
        className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
      >
        Schedule Post
      </button>
    </div>
  );
};

