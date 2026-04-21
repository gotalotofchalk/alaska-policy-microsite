import ScrollPyramidHero from "@/components/homepage/scroll-pyramid-hero";
import ProblemSection from "@/components/homepage/problem-section";
import ValuePropSection from "@/components/homepage/value-prop-section";
import HowItWorks from "@/components/homepage/how-it-works";
import DemoConsole from "@/components/homepage/demo-console";
import CollaborativeSection from "@/components/homepage/collaborative-section";
import StatesSection from "@/components/homepage/states-section";
import FinalCTA from "@/components/homepage/final-cta";

export default function LandingPage() {
  return (
    <>
      <ScrollPyramidHero />
      <ProblemSection />
      <ValuePropSection />
      <HowItWorks />
      <DemoConsole />
      <CollaborativeSection />
      <StatesSection />
      <FinalCTA />
    </>
  );
}
