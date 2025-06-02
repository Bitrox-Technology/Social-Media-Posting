import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnoucementTemplate, AnnouncementSlide, AnnoucementTemplates } from '../../templetes/EventAnnouncment/announement';
import { Colors } from '../../templetes/ImageTemplate'; // Adjust path as needed
import { ArrowLeft, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import chroma from 'chroma-js';
import { ReminderSlide, ReminderTemplate, ReminderTemplates } from '../../templetes/EventAnnouncment/reminder';
import { LiveEventSlide, LiveEventTemplate, LiveEventTemplates } from '../../templetes/EventAnnouncment/liveEvent';
import { ThanksMessageSlide, ThanksMessageTemplate, ThanksMessageTemplates } from '../../templetes/EventAnnouncment/thanksMessage';
import { KeyMomentSlide, KeyMomentTemplate, KeyMomentTemplates } from '../../templetes/EventAnnouncment/keyMoments';
import { CallToActionSlide, CallToActionTemplate, CallToActionTemplates } from '../../templetes/EventAnnouncment/callToAction';
import { Call } from '@mui/icons-material';

const defaultColors: Colors = {
    logoColors: { primary: '#4A90E2', secondary: '#50E3C2', accent: ['#50E3C2', '#F5A623'] },
    imageColors: ['#4A90E2', '#50E3C2'],
    ensureContrast: (textColor: string, bgColor: string) => {
        try {
            const contrast = chroma.contrast(textColor, bgColor);
            if (contrast < 4.5) {
                const adjusted = chroma(textColor).luminance(contrast < 4.5 ? 0.7 : 0.3).hex();
                return chroma.contrast(adjusted, bgColor) >= 4.5 ? adjusted : '#ffffff';
            }
            return textColor;
        } catch {
            return '#ffffff';
        }
    },
    vibrantLogoColor: '#4A90E2',
    vibrantTextColor: '#FFFFFF',
    footerColor: '#50E3C2',
    backgroundColor: '#FFFFFF',
    glowColor: '#FFD700',
    complementaryGlowColor: '#00BFFF',
    typography: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 500,
        fontSize: '2.5rem',
    },
    graphicStyle: {
        borderRadius: '8px',
        iconStyle: 'sharp',
        filter: 'none',
    },
    materialTheme: {
        primary: '#4A90E2',
        secondary: '#50E3C2',
        tertiary: '#F5A623',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        onPrimary: '#FFFFFF',
        onSecondary: '#000000',
        onBackground: '#000000',
        onSurface: '#000000',
    },
};

// Define a union type for all possible templates
type EventTemplate = AnnoucementTemplate | ReminderTemplate | LiveEventTemplate | ThanksMessageTemplate | KeyMomentTemplate | CallToActionTemplate;

// Type guards to narrow down the template type
const isAnnouncementTemplate = (template: EventTemplate): template is AnnoucementTemplate => {
    return template.id.includes('announcement');
};

const isReminderTemplate = (template: EventTemplate): template is ReminderTemplate => {
    return template.id.includes('reminder');
};

const isLiveEventTemplate = (template: EventTemplate): template is LiveEventTemplate => {
    return template.id.includes('live-event');
};

const isKeyMomentTemplate = (template: EventTemplate): template is KeyMomentTemplate => {
    return template.id.includes('key-moment');
};

const isCallToActionTemplate = (template: EventTemplate): template is CallToActionTemplate => {
    return template.id.includes('call-to-action');
};

const isThanksMessageTemplate = (template: EventTemplate): template is ThanksMessageTemplate => {
    return template.id.includes('thanks-message');
};

export const EventTemplateSelector: React.FC = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const defaultLogoUrl = '/images/Logo.png';
    const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
    const [activeTab, setActiveTab] = useState<'announcements' | 'reminder' | 'liveEvent' | 'keyMoment' | 'callToAction' | 'thanksMessage'>('announcements');
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Dynamically adjust scale based on container size
    useEffect(() => {
        const updateScale = () => {
            if (previewContainerRef.current) {
                const container = previewContainerRef.current;
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                const maxWidth = containerWidth - 32;
                const maxHeight = containerHeight - 64;
                const scaleX = maxWidth / 1080;
                const scaleY = maxHeight / 1080;
                const newScale = Math.min(scaleX, scaleY, 1);
                setScale(newScale);
                console.log('Preview Scale:', newScale, 'Container:', {
                    width: containerWidth,
                    height: containerHeight,
                    top: container.offsetTop,
                });
            }
        };

        const timer = setTimeout(updateScale, 0);
        window.addEventListener('resize', updateScale);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateScale);
        };
    }, [selectedTemplate]);

    const handleSelectTemplate = (template: EventTemplate) => {
        setSelectedTemplate(template);
        console.log('Selected Template:', template.id, 'Logo URL:', defaultLogoUrl);
    };

    const handleProceedToEdit = () => {
        if (!selectedTemplate) {
            alert('Please select a template first.');
            return;
        }
        navigate('/image-generation', {
            state: {
                templateId: selectedTemplate.id,
                initialSlide: selectedTemplate.slides[0],
            },
        });
    };

    const handleBack = () => {
        navigate('/');
    };

    const templates = {
        announcements: AnnoucementTemplates,
        reminder: ReminderTemplates,
        liveEvent: LiveEventTemplates,
        keyMoment: KeyMomentTemplates,
        callToAction: CallToActionTemplates,
        thanksMessage: ThanksMessageTemplates
    };

    // Render the preview based on the template type
    const renderPreview = () => {
        if (!selectedTemplate) return null;

        if (isAnnouncementTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as AnnouncementSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '', // Provide a default empty string if undefined
                    eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        if (isReminderTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as ReminderSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '',
                    eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        if (isLiveEventTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as LiveEventSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '',
                     eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        if (isKeyMomentTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as KeyMomentSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '',
                     eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        if (isCallToActionTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as CallToActionSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '',
                     eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        if (isThanksMessageTemplate(selectedTemplate)) {
            const slide = selectedTemplate.slides[0] as ThanksMessageSlide;
            return selectedTemplate.renderSlide(
                {
                    ...slide,
                    imageUrl: slide.imageUrl ?? '',
                     eventDetails: slide.eventDetails ?? undefined,
                },
                true,
                defaultLogoUrl,
                defaultColors
            );
        }

        return null;
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex h-screen">
                {/* Left Sidebar - Template Selection */}
                <div
                    className={`w-full md:w-1/4 border-r ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } p-6 overflow-y-auto`}
                >
                    <div className="flex items-center justify-between mb-6">
                        <motion.button
                            onClick={handleBack}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                            } transition-all focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Go back to previous page"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back</span>
                        </motion.button>
                        <h2
                            className={`text-lg font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            Event Templates
                        </h2>
                    </div>

                    {/* Tabs for Template Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('announcements')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'announcements'
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 text-gray-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Announcement
                        </button>
                        <button
                            onClick={() => setActiveTab('reminder')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'reminder'
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 text-gray-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Reminder
                        </button>
                        <button
                            onClick={() => setActiveTab('liveEvent')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'liveEvent'
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 text-gray-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Live Event
                        </button>
                        <button
                            onClick={() => setActiveTab('keyMoment')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'keyMoment'
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 text-gray-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Key Moment
                        </button>
                        <button
                            onClick={() => setActiveTab('thanksMessage')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === 'thanksMessage'
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-200'
                                    : 'bg-gray-100 text-gray-700'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            Thanks Message
                        </button>
                    </div>

                    {/* Template Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {templates[activeTab].map((template) => (
                            <motion.div
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className={`cursor-pointer rounded-xl overflow-hidden ${
                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                                } ${
                                    selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleSelectTemplate(template);
                                    }
                                }}
                                aria-label={`Select ${template.name} template`}
                            >
                                <div className="aspect-[3/4] relative">
                                    {template.coverImageUrl ? (
                                        <img
                                            src={template.coverImageUrl}
                                            alt={`${template.name} preview`}
                                            className="w-full h-full object-cover"
                                            // onError={(e) => {
                                            //     console.error(
                                            //         `Failed to load cover image at ${template.coverImageUrl}`
                                            //     );
                                            //     e.currentTarget.src =
                                            //         'https://via.placeholder.com/300x400.png?text=Image+Not+Found';
                                            // }}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-full flex items-center justify-center ${
                                                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <ImageIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 p-3 ${
                                            theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
                                        } backdrop-blur-sm`}
                                    >
                                        <p
                                            className={`text-sm font-medium ${
                                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}
                                        >
                                            {template.name}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Content - Preview */}
                <div className="flex-1 flex flex-col">
                    {/* Main Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto flex items-start justify-center pt-12">
                        <AnimatePresence mode="wait">
                            {selectedTemplate ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex flex-col items-center w-full"
                                >
                                    <div
                                        ref={previewContainerRef}
                                        className="relative rounded-xl shadow-2xl mb-8 w-full max-w-[1080px] aspect-square"
                                    >
                                        <div
                                            style={{
                                                width: '1080px',
                                                height: '1080px',
                                                transform: `scale(${scale})`,
                                                transformOrigin: 'center',
                                                margin: '0 auto',
                                            }}
                                        >
                                            {renderPreview()}
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={handleProceedToEdit}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label="Customize selected template"
                                    >
                                        Customize Template
                                        <ChevronRight className="w-5 h-5" />
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full"
                                >
                                    <div
                                        className={`p-4 rounded-full ${
                                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                        } mb-4`}
                                    >
                                        <ImageIcon
                                            className={`w-8 h-8 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                        />
                                    </div>
                                    <p
                                        className={`text-lg ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}
                                    >
                                        Select a template to preview
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};