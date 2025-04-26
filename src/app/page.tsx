
// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useCurrentUser } from "@/hooks/use-current-user"
// import { SignInButton, UserButton } from "@clerk/clerk-react"
// import { Authenticated, Unauthenticated } from "convex/react"
// import Link from "next/link"

// export default function Home() {

//   const { isLoading, isAuthenticated } = useCurrentUser();



//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Test Platform</h1>
//       {isAuthenticated}

//       <Unauthenticated>
//         <SignInButton />
//       </Unauthenticated>
//       <Authenticated>
//         <UserButton />
//       </Authenticated>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Tests</CardTitle>
//             <CardDescription>Browse and take tests from various categories</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Select a test from our collection to begin your assessment.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/tests" className="w-full">
//               <Button className="w-full">Browse Tests</Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>My Attempts</CardTitle>
//             <CardDescription>View your previous test attempts</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Review your performance and track your progress over time.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/my-attempts" className="w-full">
//               <Button className="w-full" variant="outline">
//                 View Attempts
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Categories</CardTitle>
//             <CardDescription>Browse tests by category</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Find tests organized by subject matter and difficulty level.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/categories" className="w-full">
//               <Button className="w-full" variant="outline">
//                 View Categories
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }


import LandingNav from "@/components/landing/landing-nav"
import HeroSection from "@/components/landing/hero-section"
import Footer from "@/components/landing/footer"
import CtaSection from "@/components/landing/cta-section"
import TestimonialsSection from "@/components/landing/testimonials"
import FlowVisualisationSection from "@/components/landing/flow-visualization-section"
import HowItWorksSection from "@/components/landing/how-it-works-section"
import CategoriesSection from "@/components/landing/categories-section"

export default function LandingPage() {




  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <LandingNav />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <CategoriesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Structure Visualization - Updated for Convex Schema */}
        <FlowVisualisationSection />

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
