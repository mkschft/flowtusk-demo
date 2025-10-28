import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { GapSection } from "@/components/landing/GapSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { CaseStudy } from "@/components/landing/CaseStudy";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { MVPVsVision } from "@/components/landing/MVPVsVision";
import { CompetitiveEdge } from "@/components/landing/CompetitiveEdge";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Problem Section */}
        <ProblemSection />
        
        {/* Gap Section */}
        <GapSection />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Before/After */}
        <BeforeAfter />
        
        {/* Case Study */}
        <CaseStudy />
        
        {/* Features Grid */}
        <FeaturesGrid />
        
        {/* MVP vs Vision */}
        <MVPVsVision />
        
        {/* Competitive Edge */}
        <CompetitiveEdge />
        
        {/* Pricing */}
        <Pricing />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Final CTA */}
        <FinalCTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}