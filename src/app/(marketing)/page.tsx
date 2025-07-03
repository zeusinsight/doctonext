import { BenefitsSection } from "@/components/layout/sections/benefits"
import { CommunitySection } from "@/components/layout/sections/community"
import { ContactSection } from "@/components/layout/sections/contact"
import { FAQSection } from "@/components/layout/sections/faq"
import { FeaturesSection } from "@/components/layout/sections/features"
import { HeroSection } from "@/components/layout/sections/hero"
import { PricingSection } from "@/components/layout/sections/pricing"
import { ServicesSection } from "@/components/layout/sections/services"
import { TeamSection } from "@/components/layout/sections/team"
import { TestimonialSection } from "@/components/layout/sections/testimonial"
import Trusted from "@/components/layout/sections/trusted"

export const metadata = {
    title: "Indie Saas",
    description: "Boilerplate Template with Postgres(neon.tech), Drizzle, BetterAuth UI, shadcn/ui and Tanstack Query",
    openGraph: {
        type: "website",
        url: "https://github.com/indieceo/IndieSaas-STARTER",
        title: "Indie Saas",
        description: "Boilerplate for Indie-Hackers",
        images: [
            {
                url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
                width: 1200,
                height: 630,
                alt: "Indie Saas"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        site: "https://github.com/indieceo/IndieSaas-STARTER",
        title: "Indie Saas",
        description: "Boilerplate for Indie-Hackers",
        images: [
            "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg"
        ]
    }
}

export default function Home() {
    return (
        <>
            <HeroSection />
            <Trusted />
            <BenefitsSection />
            <FeaturesSection />
            <ServicesSection />
            <TestimonialSection />
            <TeamSection />
            <CommunitySection />
            <PricingSection />
            <ContactSection />
            <FAQSection />
        </>
    )
}
