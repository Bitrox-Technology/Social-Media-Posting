import React from 'react';
import HeroSection from '../components/features/HeroSection';
import FeaturesSection from '../components/features/FeatureSection';
import PricingSection from '../components/price/PricingSection';
import ContactSection from '../components/features/ContactSection';


const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;