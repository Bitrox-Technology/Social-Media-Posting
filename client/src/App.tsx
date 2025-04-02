// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout'; // Adjusted path
import { ContentTypeSelector } from './components/content/ContentTypeSelector'; // Adjusted path
import { TopicSelector } from './components/content/TopicSelector';
import { ContentIdeas } from './components/content/ContentIdeas';
import { ImageGenerator } from './components/content/ImageGenerator';
import { PostingPanel } from './components/content/PostingPanel';
import { Carousel } from './components/ui/Carousel';
import { DoYouKnow } from './components/ui/DoYouKnow';
import { useAppSelector } from './store/hooks';
import { SignUp } from './components/auth/Signup'; // Adjusted path
import { SignIn } from './components/auth/Signin'; // Adjusted path
import { AutoPostCreator } from './components/content/AutoPostCreator';
import { TemplateCarousel } from './components/ui/TemplateCarousel';
import { DoYouKnowTemplateSelector } from './components/ui/DoYouKnowTemplate';
import { ImageGeneration } from './components/ui/ImageGeneration';
import { ImageGenerationTemplate } from './components/ui/ImageGenerationTemplate';

function App() {
  // Access state from Redux store
  const contentType = useAppSelector((state) => state.app.contentType);
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);

  return (
    <Router>
      <Layout>
        <div className="page-content max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
            AI Social Media Content Creator
          </h1>

          <Routes>
            <Route path="/" element={<ContentTypeSelector />} />
            <Route
              path="/topic"
              element={contentType ? <TopicSelector /> : <Navigate to="/" />}
            />
            <Route
              path="/ideas"
              element={
                selectedTopic ? <ContentIdeas /> : <Navigate to="/topic" />
              }
            />
            <Route
              path="/images"
              element={
                selectedIdea && contentType ? (
                  <ImageGenerator contentType={contentType} />
                ) : (
                  <Navigate to="/ideas" />
                )
              }
            />
            <Route path="/post" element={<PostingPanel />} />
            <Route
              path="/carousel"
              element={
                <Carousel
                  initialTopic="defaultTopic"
                  template="defaultTemplate"
                  slides={[]}
                />
              }
            />

            <Route path='/image-generator' element={<ImageGeneration />} />

            <Route path='/tmcarousel' element={<TemplateCarousel initialTopic="defaultTopic" />} />
            <Route path='/tmimagegeneration' element={<ImageGenerationTemplate/>} />
            <Route path='/tmdoyouknow' element={<DoYouKnowTemplateSelector />} />
            <Route path="/doyouknow" element={<DoYouKnow />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/auto" element={<AutoPostCreator />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;