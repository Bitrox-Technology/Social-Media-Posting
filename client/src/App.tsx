import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ContentTypeSelector } from './components/ContentTypeSelector';
import { TopicSelector } from './components/TopicSelector';
import { ContentIdeas } from './components/ContentIdeas';
import { ImageGenerator } from './components/ImageGenerator';
import { PostingPanel } from './components/PostingPanel';
import { Carousel } from "./components/Carousel"; // Import the Carousel component

function App() {
  const [contentType, setContentType] = React.useState<'post' | 'reel' | null>(null);
  const [selectedTopic, setSelectedTopic] = React.useState<string>('');
  const [selectedIdea, setSelectedIdea] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  return (
    <Router>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
            AI Social Media Content Creator
          </h1>

          <Routes>
            <Route 
              path="/" 
              element={<ContentTypeSelector onSelect={setContentType} />}
            />
            <Route 
              path="/topic" 
              element={
                contentType ? (
                  <TopicSelector onSelect={setSelectedTopic} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route 
              path="/ideas" 
              element={
                selectedTopic ? (
                  <ContentIdeas topic={selectedTopic} onSelect={setSelectedIdea} />
                ) : (
                  <Navigate to="/topic" />
                )
              }
            />
            <Route 
              path="/images" 
              element={
                selectedIdea && contentType ? (
                  <ImageGenerator 
                    contentIdea={selectedIdea} 
                    contentType={contentType}
                    onSelect={(file: string | File) => {
                      if (file instanceof File) {
                        setSelectedFile(file);
                      } else {
                        console.warn('Received a string instead of a File');
                      }
                    }}
                  />
                ) : (
                  <Navigate to="/ideas" />
                )
              }
            />
            <Route 
              path="/post" 
              element={
                selectedFile && contentType && selectedIdea ? (
                  <PostingPanel 
                    contentType={contentType}
                    topic={selectedTopic}
                    content={selectedIdea}
                    image={selectedFile}
                  />
                ) : (
                  <Navigate to="/images" />
                )
              }
            />
            {/* Add the Carousel route */}
            <Route 
              path="/carousel" 
              element={<Carousel />}
            />
            {/* Redirect any unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;