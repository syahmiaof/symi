import Header from "@/components/symi/Header";
import Hero from "@/components/symi/Hero";
import SwirlExplosion from "@/components/symi/SwirlExplosion";
import FlavorUniverse from "@/components/symi/FlavorUniverse";
import Story from "@/components/symi/Story";
import FinalBrand from "@/components/symi/FinalBrand";
import MotionProvider from "@/components/symi/MotionProvider";
export default function Home() {
  return (
    <MotionProvider>
      <Header />
      <main id="main">
        <Hero />
        <SwirlExplosion />
        <FlavorUniverse />
        <Story />
        <FinalBrand />
      </main>
    </MotionProvider>
  );
}
