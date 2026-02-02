import {
  Navbar,
  HeroSection,
  FeaturesSection,
  StoryboardTimeline,
  CTASection,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StoryboardTimeline />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
