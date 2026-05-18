import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategoryGateway from "@/components/home/CategoryGateway";
import FeaturedFilm from "@/components/home/FeaturedFilm";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import AboutTeaser from "@/components/home/AboutTeaser";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import FinalCTA from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />
      <main>
        <HeroSection />
        <CategoryGateway />
        <FeaturedFilm />
        <TestimonialsPreview />
        <AboutTeaser />
        <ProcessTimeline />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
