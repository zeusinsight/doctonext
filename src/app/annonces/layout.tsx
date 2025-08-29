import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/layout/sections/footer"

export default function ListingsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <FooterSection />
        </>
    )
}