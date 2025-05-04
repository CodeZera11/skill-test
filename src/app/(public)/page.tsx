
import HeroSection from "@/components/landing/hero-section"
import Footer from "@/components/landing/footer"
import CtaSection from "@/components/landing/cta-section"
import TestimonialsSection from "@/components/landing/testimonials"
import HowItWorksSection from "@/components/landing/how-it-works-section"
import CategoriesSection from "@/components/landing/categories-section"

const LandingPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Structure Visualization - Updated for Convex Schema */}
        {/* <FlowVisualisationSection /> */}

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CtaSection />
      </main>

      {/* Footer - Improved */}
      <Footer />
    </div>
  )
}

export default LandingPage;