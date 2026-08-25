import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TemplateShowcase />
        <HowItWorks />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
