import Header from "@/components/symi/Header";
import Hero from "@/components/symi/Hero";
import SwirlExplosion from "@/components/symi/SwirlExplosion";
import FlavorUniverse from "@/components/symi/FlavorUniverse";
import IngredientFlow from "@/components/symi/IngredientFlow";
import Story from "@/components/symi/Story";
import ExperienceGallery from "@/components/symi/ExperienceGallery";
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
        <IngredientFlow />
        <Story />
        <ExperienceGallery />
        <FinalBrand />
      </main>
    </MotionProvider>
  );
}
