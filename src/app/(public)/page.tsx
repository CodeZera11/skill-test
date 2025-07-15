
import HeroSection from "@/components/landing/hero-section"
import Footer from "@/components/landing/footer"
import TestimonialsSection from "@/components/landing/testimonials"
import CategoriesSection from "@/components/landing/categories-section"
import TopicsSection from "@/components/landing/topics-section"
import { Separator } from "@/components/ui/separator"
import NewsSection from "@/components/landing/news-section"

const LandingPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Topics Section */}
        <TopicsSection />

        <NewsSection />

        <Separator />



        {/* How It Works Section */}
        {/* <HowItWorksSection /> */}



        {/* Categories Section */}
        <CategoriesSection />

        <Separator />


        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA Section */}
        {/* <CtaSection /> */}
      </main>

      {/* Footer - Improved */}
      <Footer />
    </div>
  )
}

export default LandingPage;