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
    title: "Indie Saas Starter",
    description: "Open Source Next.js Saas Starter. Built with Better Auth UI, Shadcn/Ui, Drizzle ORM, UploadThing and Tanstack Query",
    openGraph: {
        type: "website",
        url: "https://indiesaas.vercel.app",
        title: "Indie Saas Starter",
        description: "Open Source Next.js Saas Starter. Built with Better Auth UI, Shadcn/Ui, Drizzle ORM, UploadThing and Tanstack Query",
        images: [
            {
                url: "/demo-img.png",
                width: 1200,
                height: 630,
                alt: "Indie Saas"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        site: "https://indiesaas.vercel.app",
        title: "Indie Saas Starter",
        description: "Open Source Next.js Saas Starter. Built with Better Auth UI, Shadcn/Ui, Drizzle ORM, UploadThing and Tanstack Query",
        images: [
            "/logo.png"
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
