import React from 'react';
import HeroSection from '../components/home/HeroSection';
import BestSellers from '../components/home/BestSellers';
import SkinConcernSection from '../components/home/SkinConcernSection';
import IngredientFocus from '../components/home/IngredientFocus';
import BrandPhilosophy from '../components/home/BrandPhilosophy';
import ProductBenefits from '../components/home/ProductBenefits';
import CustomerReviews from '../components/home/CustomerReviews';
import InstagramSection from '../components/home/InstagramSection';

const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <BestSellers />
      <SkinConcernSection />
      <IngredientFocus />
      <BrandPhilosophy />
      <ProductBenefits />
      <CustomerReviews />
      <InstagramSection />
    </div>
  );
};

export default HomePage;
