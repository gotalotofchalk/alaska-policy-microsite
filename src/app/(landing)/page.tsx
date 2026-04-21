import ScrollPyramidHero from "@/components/homepage/scroll-pyramid-hero";
import ProblemSection from "@/components/homepage/problem-section";
import ValuePropSection from "@/components/homepage/value-prop-section";
import StatesSection from "@/components/homepage/states-section";
import HowItWorks from "@/components/homepage/how-it-works";
import CollaborativeSection from "@/components/homepage/collaborative-section";

export default function LandingPage() {
  return (
    <>
      <ScrollPyramidHero />
      <ProblemSection />
      <ValuePropSection />
      <StatesSection />
      <HowItWorks />
      <CollaborativeSection />
    </>
  );
}
