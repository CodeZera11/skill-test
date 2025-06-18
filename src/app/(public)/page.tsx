
import HeroSection from "@/components/landing/hero-section"
import Footer from "@/components/landing/footer"
import CtaSection from "@/components/landing/cta-section"
import TestimonialsSection from "@/components/landing/testimonials"
import HowItWorksSection from "@/components/landing/how-it-works-section"
import CategoriesSection from "@/components/landing/categories-section"
import TopicsSection from "@/components/landing/topics-section"
import { Separator } from "@/components/ui/separator"

const LandingPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Topics Section */}
        <TopicsSection />

        <Separator />



        {/* How It Works Section */}
        <HowItWorksSection />


        {/* Categories Section */}
        <CategoriesSection />

        <Separator />


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