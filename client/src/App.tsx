import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/header/Header';
import Dashboard from './components/layout/Dashboard';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { TopicSelector } from './components/content/TopicSelector';
import { ContentIdeas } from './components/content/ContentIdeas';
import { ImageGenerator } from './components/content/ImageGenerator';
import { PostingPanel } from './components/content/PostingPanel';
import { Carousel } from './components/ui/Carousel';
import { DoYouKnow } from './components/ui/DoYouKnow';
import { useAppSelector } from './store/hooks';
import { SignUp } from './components/auth/Signup';
import { SignIn } from './components/auth/Signin';
import { AutoPostCreator } from './components/content/AutoPostCreator';
import { TemplateCarousel } from './components/ui/TemplateCarousel';
import { DoYouKnowTemplateSelector } from './components/ui/DoYouKnowTemplate';
import { ImageGeneration } from './components/ui/ImageGeneration';
import { ImageGenerationTemplate } from './components/ui/ImageGenerationTemplate';
import { Blog } from './components/content/Blog';
import { SelectSocialMedia } from './components/content/SelectSocialMedia';
import UserDetail from './components/auth/UserDetails';
import { ContentTypeSelector } from './components/content/ContentType';
import ColorSchemeSelector from './components/features/colorSchemaSelector';
import { OtpVerification } from './components/auth/otp';
import ForgotPassword from './components/auth/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import { Features } from './pages/FeaturePage';
import { Pricing } from './pages/PricingPage';

function App() {
  const contentType = useAppSelector((state) => state.app.contentType);
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const user = useAppSelector((state) => state.app.user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
          <Header toggleDrawer={toggleDrawer} />
          <div className="flex flex-1">
            {user && <Dashboard isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
            <div className={`flex-1 ${user ? 'md:ml-0' : ''} transition-all duration-300`}>
              {/* Color Scheme Selector - Fixed Position */}
              <div className="fixed bottom-4 right-4 z-50">
                <ColorSchemeSelector />
              </div>

              {/* Overlay for mobile when drawer is open */}
              {isDrawerOpen && user && (
                <div
                  className="fixed inset-0 bg-black/50 z-30 md:hidden"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                  aria-hidden="true"
                />
              )}

              <main className={`flex-grow ${user && isDrawerOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/topic"
                    element={contentType ? <TopicSelector /> : <Navigate to="/" />}
                  />
                  <Route
                    path="/ideas"
                    element={selectedTopic ? <ContentIdeas /> : <Navigate to="/topic" />}
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
                  <Route path="/image-generator" element={<ImageGeneration />} />
                  <Route path="/tmcarousel" element={<TemplateCarousel initialTopic="defaultTopic" />} />
                  <Route path="/tmimagegeneration" element={<ImageGenerationTemplate />} />
                  <Route path="/tmdoyouknow" element={<DoYouKnowTemplateSelector />} />
                  <Route path="/content-type" element={<ContentTypeSelector />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/doyouknow" element={<DoYouKnow />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/otp-verification" element={<OtpVerification />} />
                  <Route path='/forgot-password' element={<ForgotPassword/>} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />

                  <Route path='/profile' element={<ProfilePage />} />
                  <Route path="/auto" element={<AutoPostCreator />} />
                  <Route path="/select-media" element={<SelectSocialMedia />} />
                  <Route path="/user-details" element={<UserDetail />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;