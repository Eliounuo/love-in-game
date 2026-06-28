import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { WhyUs } from "@/components/sections/why-us";
import { PricingSection } from "@/components/sections/pricing";
import { GamesSection } from "@/components/sections/games";
import { GallerySection } from "@/components/sections/gallery";
import { MenuSection } from "@/components/sections/menu-section";
import { BusinessLunch } from "@/components/sections/business-lunch";
import { TournamentsSection } from "@/components/sections/tournaments";
import { ReviewsSection } from "@/components/sections/reviews";
import { FaqSection } from "@/components/sections/faq";
import { ContactsSection } from "@/components/sections/contacts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getPricing, getGames, getEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [pricing, games, events] = await Promise.all([
    getPricing(),
    getGames(),
    getEvents(),
  ]);

  return (
    <div className="min-h-screen bg-[#E7D8CC]">
      <Navbar />
      <Hero />
      <About />
      <WhyUs />
      <PricingSection pricing={pricing} />
      <GamesSection games={games} />
      <GallerySection />
      <MenuSection />
      <BusinessLunch />
      <TournamentsSection events={events} />
      <ReviewsSection />
      <FaqSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}
