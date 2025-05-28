import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';
import { useAppSelector } from './store/hooks';
import { selectUser, selectIsAuthenticated } from './store/appSlice';
import Header from './components/header/Header';
import Dashboard from './components/layout/Slidebar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import { TopicSelector } from './components/content/TopicSelector';
import { ContentIdeas } from './components/content/ContentIdeas';
import { ImageGenerator } from './components/content/ImageGenerator';
import { PostingPanel } from './components/content/PostingPanel';
import { Carousel } from './components/ui/Carousel';
import { DoYouKnow } from './components/ui/DoYouKnow';
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
import CompetitorPostAnalyzer from './components/content/CompetitorPostAnalyzer';
import CodeGeneratorForm from './components/content/GenerateTemplate';
import { UserAllPosts } from './components/content/UserAllPosts';
import { UserPostDetail } from './components/content/UserPostDetail';
import SessionWarning from './components/providers/SessionWarning';
import AuthProvider from './components/providers/AuthProvider';
import ProtectedRoute from './components/providers/ProtectedRoute';
import { FestivalTemplates } from './components/ui/festivalTemplates';
import { ScheduledPosts } from './components/content/ScheduledPosts';
import { FAQ } from './pages/FAQPage';
import { PrivacyPolicy } from './pages/PrivacyPolicyPage';
import { TermsOfService } from './pages/TermOfService';
import { CookiePolicy } from './pages/CookiePolicy';

function App() {
  const contentType = useAppSelector((state) => state.app.contentType);
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthProvider>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
              <Header toggleDrawer={toggleDrawer} />
              <div className="flex flex-1">
                {(user || isAuthenticated) && <Dashboard isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />}
                <div className={`flex-1 ${(user || isAuthenticated) ? 'md:ml-0' : ''} transition-all duration-300`}>
                  <div className="fixed bottom-4 right-4 z-50">
                    <ColorSchemeSelector />
                  </div>
                  {isDrawerOpen && (user || isAuthenticated) && (
                    <div
                      className="fixed inset-0 bg-black/50 z-30 md:hidden"
                      onClick={toggleDrawer(false)}
                      onKeyDown={toggleDrawer(false)}
                      aria-hidden="true"
                    />
                  )}
                  <main className={`flex-grow ${(user || isAuthenticated) && isDrawerOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route
                        path="/signup"
                        element={<SignUp />}
                      />
                      <Route
                        path="/signin"
                        element={<SignIn />}
                      />
                      <Route
                        path="/otp-verification"
                        element={<OtpVerification />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route element={<ProtectedRoute />}>
                        <Route
                          path="/dashboard"
                          element={<DashboardPage />}
                        />
                      </Route>
                      <Route
                        path="/topic"
                        element={<TopicSelector />}
                      />
                      <Route
                        path="/ideas"
                        element={selectedTopic ? <ContentIdeas /> : <Navigate to="/topic" />}
                      />
                      <Route
                        path="/faq"
                        element={<FAQ />}
                      />
                      <Route
                        path="/privacy-policy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/terms-service"
                        element={<TermsOfService />}
                      />
                      <Route
                        path="/cookies-policy"
                        element={<CookiePolicy />}
                      />

                      <Route
                        path="/carousel"
                        element={
                          <Carousel initialTopic="defaultTopic" template="defaultTemplate" slides={[]} />
                        }
                      />
                      <Route
                        path="/image-generator"
                        element={<ImageGeneration />}
                      />
                      <Route
                        path="/tmcarousel"
                        element={
                          <TemplateCarousel initialTopic="defaultTopic" />
                        }
                      />
                      <Route
                        path="/tmimagegeneration"
                        element={<ImageGenerationTemplate />}
                      />
                      <Route
                        path="/tmfestival"
                        element={<FestivalTemplates />}
                      />
                      <Route
                        path="/tmdoyouknow"
                        element={<DoYouKnowTemplateSelector />}
                      />
                      <Route
                        path="/scheduled-posts"
                        element={<ScheduledPosts />}
                      />
                      <Route
                        path="/post-analyzer"
                        element={<CompetitorPostAnalyzer />}
                      />
                      <Route
                        path="/content-type"
                        element={<ContentTypeSelector />}
                      />
                      <Route
                        path="/blog"
                        element={<Blog />}
                      />
                      <Route
                        path="/doyouknow"
                        element={<DoYouKnow />}
                      />
                      <Route
                        path="/generate-template"
                        element={<CodeGeneratorForm />}
                      />
                      <Route
                        path="/user-posts"
                        element={<UserAllPosts />}
                      />
                      <Route
                        path="/user-post/:postId"
                        element={<UserPostDetail />}
                      />
                      <Route
                        path="/profile"
                        element={<ProfilePage />}
                      />
                      <Route
                        path="/auto"
                        element={<AutoPostCreator />}
                      />
                      <Route
                        path="/select-media"
                        element={<SelectSocialMedia />}
                      />
                      <Route
                        path="/user-details"
                        element={<UserDetail />}
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <SessionWarning />
                  </main>
                </div>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </Router>
      </PersistGate>
    </ThemeProvider>
  );
}

export default App;