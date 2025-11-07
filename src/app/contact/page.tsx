import { site } from "@/config/site";
import { ContactSection } from "@/components/layout/sections/contact";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: `Contact - ${site.name}`,
  description: "Contactez-nous pour toute question ou demande d'information concernant Care Evo.",
  openGraph: {
    type: "website",
    url: `${site.url}/contact`,
    title: `Contact - ${site.name}`,
    description: "Contactez-nous pour toute question ou demande d'information concernant Care Evo.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <ContactSection />
      </main>
      <FooterSection />
    </>
  );
}
