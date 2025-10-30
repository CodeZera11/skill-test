
import HeroSection from "@/components/landing/hero-section"
import Footer from "@/components/landing/footer"
import TestimonialsSection from "@/components/landing/testimonials"
import TopicsSection from "@/components/landing/topics-section"
import { Separator } from "@/components/ui/separator"
import NewsSection from "@/components/landing/news-section"

const LandingPage = async () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* <NewsTape /> */}

        <Separator />

        {/* Topics Section */}
        <TopicsSection />

        <NewsSection />

        <Separator />



        {/* How It Works Section */}
        {/* <HowItWorksSection /> */}



        {/* Categories Section */}
        {/* <CategoriesSection /> */}




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