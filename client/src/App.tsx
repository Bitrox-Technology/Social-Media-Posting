// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ContentTypeSelector } from './components/ContentTypeSelector';
import { TopicSelector } from './components/TopicSelector';
import { ContentIdeas } from './components/ContentIdeas';
import { ImageGenerator } from './components/ImageGenerator';
import { PostingPanel } from './components/PostingPanel';
import { Carousel } from './components/Carousel';
import { DoYouKnow } from './components/DoYouKnow';
import { useAppSelector } from './store/hooks';

function App() {
  // Access state from Redux store
  const contentType = useAppSelector((state) => state.app.contentType);
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);


  return (
    <Router>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
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
                selectedTopic ? (
                  <ContentIdeas />
                ) : (
                  <Navigate to="/topic" />
                )
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
            <Route
              path="/post"
              element={<PostingPanel />}
            />
            <Route path="/carousel" element={<Carousel />} />
            <Route
              path="/doyouknow"
              element={
                <DoYouKnow />
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;