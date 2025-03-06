import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ContentTypeSelector } from './components/ContentTypeSelector';
import { TopicSelector } from './components/TopicSelector';
import { ContentIdeas } from './components/ContentIdeas';
import { ImageGenerator } from './components/ImageGenerator';
import { PostingPanel } from './components/PostingPanel';
import { Steps } from './components/Steps';

type Step = 'type' | 'topic' | 'ideas' | 'images' | 'post';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [contentType, setContentType] = useState<'post' | 'reel' | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<string>(''); // Still a string (JSON)
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Changed to File | null

  const steps = [
    { id: 'type', label: 'Content Type' },
    { id: 'topic', label: 'Topic Selection' },
    { id: 'ideas', label: 'Content Ideas' },
    { id: 'images', label: 'Image Selection' },
    { id: 'post', label: 'Post Content' },
  ];

  const handleBack = () => {
    switch (currentStep) {
      case 'topic':
        setCurrentStep('type');
        break;
      case 'ideas':
        setCurrentStep('topic');
        break;
      case 'images':
        setCurrentStep('ideas');
        break;
      case 'post':
        setCurrentStep('images');
        break;
    }
  };

  const handleNext = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
          AI Social Media Content Creator
        </h1>
        
        <Steps steps={steps} currentStep={currentStep} />

        <div className="mt-8">
          {currentStep === 'type' && (
            <ContentTypeSelector
              onSelect={(type) => {
                setContentType(type);
                handleNext('topic');
              }}
            />
          )}

          {currentStep === 'topic' && (
            <TopicSelector
              onSelect={(topic) => {
                setSelectedTopic(topic);
                handleNext('ideas');
              }}
              onBack={handleBack}
            />
          )}

          {currentStep === 'ideas' && (
            <ContentIdeas
              topic={selectedTopic}
              onSelect={(idea) => {
                setSelectedIdea(idea); // JSON string from ContentIdeas
                handleNext('images');
              }}
              onBack={handleBack}
            />
          )}

          {currentStep === 'images' && (
            <ImageGenerator
              contentIdea={selectedIdea}
              contentType={contentType!} // Pass contentType
              onSelect={(file) => {
                setSelectedFile(file); // File object from ImageGenerator
                handleNext('post');
              }}
              onBack={handleBack}
            />
          )}

          {currentStep === 'post' && (
            <PostingPanel
              contentType={contentType!}
              topic={selectedTopic}
              content={selectedIdea}
              image={selectedFile!} // Pass File object
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;