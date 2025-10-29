"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { NavUserPublic } from "./nav-user-public"
import { SmartListingButton } from "../ui/smart-listing-button"
import { usePathname } from "next/navigation"

export const Navbar = () => {
    const pathname = usePathname()
    const isAnnoncesActive = pathname?.startsWith("/annonces")
    const isAboutActive = pathname === "/a-propos"
    const isBlogActive = pathname?.startsWith("/blog")
    return (
        <div className="sticky top-0 z-50 w-full border-gray-200 border-b bg-white shadow-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex flex-shrink-0 items-center">
                    <Image
                        src="/logo.png"
                        alt="Care Evo"
                        width={130}
                        height={20}
                        className=" w-auto"
                    />
                </Link>

                {/* Primary CTA */}
                <Button
                    asChild
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap hover:opacity-90"
                    style={{ backgroundColor: "#206dc5", color: "#ffffff" }}
                >
                    <SmartListingButton>Déposer une annonce</SmartListingButton>
                </Button>

                {/* Annonces as accent button (turquoise) */}
                <Button
                    asChild
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap hover:opacity-90"
                    style={{ backgroundColor: "#14b8a6", color: "#ffffff" }}
                >
                    <Link href="/annonces">Annonces</Link>
                </Button>

                <Link
                    href="/a-propos"
                    className={`group relative inline-flex flex-shrink-0 items-center whitespace-nowrap p-2 text-sm ${
                        isAboutActive
                            ? "font-medium text-blue-600"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    À propos
                    <div
                        className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${
                            isAboutActive
                                ? "-translate-x-1/2 w-full"
                                : "w-0 group-hover:-translate-x-1/2 group-hover:w-full"
                        }`}
                    />
                </Link>

                <Link
                    href="/blog"
                    className={`group relative inline-flex flex-shrink-0 items-center whitespace-nowrap p-2 text-sm ${
                        isBlogActive
                            ? "font-medium text-blue-600"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Blog
                    <div
                        className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${
                            isBlogActive
                                ? "-translate-x-1/2 w-full"
                                : "w-0 group-hover:-translate-x-1/2 group-hover:w-full"
                        }`}
                    />
                </Link>

                {/* Spacer */}
                <div className="flex-1" />

                {/* User Navigation */}
                <div className="flex-shrink-0">
                    <NavUserPublic />
                </div>
            </div>
        </div>
    )
}
