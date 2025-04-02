import React from 'react';

export interface ImageSlide {
    title: string;
    description: string;
    imageUrl: string; // Background image (default or AI-generated)
    footer: string;
    websiteUrl: string;
}

export interface ImageTemplate {
    id: string;
    name: string;
    slides: ImageSlide[];
    renderSlide: (slide: ImageSlide, addLogo: boolean, defaultLogoUrl: string) => JSX.Element;
    coverImageUrl?: string;
}

// Template 1: Teddy Bear Design (Inspired by the provided image)
const ImageTemplate1: ImageTemplate = {
    id: 'teddy-bear-love',
    name: 'Teddy Bear Love',
    coverImageUrl: '/images/teddy-bear-cover/cover1.png', // Thumbnail for the template
    slides: [
        {
            title: 'ENCOURAGING WORDS',
            description: '"Is it too soon to say \'I love you\'?"',
            imageUrl: '/images/background14.jpg', // Default background image
            footer: 'bitrox.tech',
            websiteUrl: 'https://bitrox.tech',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl) => (
        <div
            className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-end text-white"
            style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Logo (Top-Right) */}
            {addLogo && (
                <img
                    src={defaultLogoUrl}
                    alt="Logo"
                    className="absolute top-4 right-4 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
                />
            )}

            {/* Content Section (Bottom) */}
            <div className="relative z-10 bg-black bg-opacity-50 p-6 md:p-8">
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center uppercase">
                    {slide.title}
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-center italic">
                    {slide.description}
                </p>

                {/* Footer (Bottom-Right) */}
                <div className="flex justify-end mt-4">
                    <span className="text-sm md:text-base text-gray-300">
                        @{slide.footer}
                    </span>
                </div>
            </div>
        </div>
    ),
};

const ImageTemplate2: ImageTemplate = {
    id: 'whimsical-garden',
    name: 'Whimsical Garden',
    coverImageUrl: '/images/whimsical-garden-cover/cover2.png',
    slides: [
        {
            title: 'FUN FACT',
            description: 'Butterflies taste with their feet!',
            imageUrl: '/images/whimsical-garden-default.jpg',
            footer: 'meta.ai',
            websiteUrl: 'https://meta.ai',
        },
    ],
    renderSlide: (slide, addLogo, defaultLogoUrl) => (
        <div
            className="relative w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden flex flex-col justify-center text-white"
            style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {addLogo && (
                <img
                    src={defaultLogoUrl}
                    alt="Logo"
                    className="absolute top-4 left-4 w-32 h-12 object-contain z-20 md:w-40 md:h-16"
                />
            )}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 md:p-8">
                <div
                    className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-6 border-4 border-dashed border-yellow-300 shadow-lg"
                    style={{ maxWidth: '80%' }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-yellow-300 uppercase">
                        {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-center text-white">
                        {slide.description}
                    </p>
                    <div className="flex justify-center mt-4">
                        <span className="text-sm md:text-base text-yellow-200">
                            @{slide.footer}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const imageTemplates: ImageTemplate[] = [ImageTemplate1, ImageTemplate2];