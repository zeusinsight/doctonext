import { CTASection } from "@/components/layout/sections/cta";
import { HeroSection } from "@/components/layout/sections/hero";
import { HowItWorksSection } from "@/components/layout/sections/howitworks";
import { MissionBanner } from "@/components/layout/sections/mission-banner";
import { SpecialtiesSection } from "@/components/layout/sections/specialties";
import { TestimonialSection } from "@/components/layout/sections/testimonial";
import { site } from "@/config/site";

export const metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.name,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: site.url,
    title: site.name,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: site.name,
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <MissionBanner />
      <SpecialtiesSection />
      <TestimonialSection />

      <HowItWorksSection />

      <CTASection />
    </>
  );
}
