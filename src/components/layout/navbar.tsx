"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { NavUserPublic } from "./nav-user-public"
import { SmartListingButton } from "../ui/smart-listing-button"
import { usePathname } from "next/navigation"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle
} from "../ui/sheet"
import { Menu } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export const Navbar = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const isAboutActive = pathname === "/a-propos"
    const isBlogActive = pathname?.startsWith("/blog")

    const closeSheet = () => setIsOpen(false)

    return (
        <div className="sticky top-0 z-50 w-full border-gray-200 border-b bg-white shadow-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3 md:px-6 md:py-4">
                {/* Logo */}
                <Link href="/" className="flex flex-shrink-0 items-center">
                    <Image
                        src="/logo.png"
                        alt="Care Evo"
                        width={130}
                        height={20}
                        className="max-h-9 w-auto md:max-h-none"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-4 md:flex">
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
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Desktop User Navigation */}
                <div className="hidden flex-shrink-0 md:block">
                    <NavUserPublic />
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                        <VisuallyHidden>
                            <SheetTitle>Menu de navigation</SheetTitle>
                        </VisuallyHidden>
                        <nav className="mt-8 flex flex-col gap-4">
                            {/* Primary CTA */}
                            <Button
                                asChild
                                className="w-full hover:opacity-90"
                                style={{ backgroundColor: "#206dc5", color: "#ffffff" }}
                                onClick={closeSheet}
                            >
                                <SmartListingButton>Déposer une annonce</SmartListingButton>
                            </Button>

                            {/* Annonces */}
                            <Button
                                asChild
                                className="w-full hover:opacity-90"
                                style={{ backgroundColor: "#14b8a6", color: "#ffffff" }}
                                onClick={closeSheet}
                            >
                                <Link href="/annonces">Annonces</Link>
                            </Button>

                            <div className="my-2 border-t" />

                            {/* Navigation Links */}
                            <Link
                                href="/a-propos"
                                onClick={closeSheet}
                                className={`rounded-md px-3 py-2 text-base ${
                                    isAboutActive
                                        ? "bg-blue-50 font-medium text-blue-600"
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                                }`}
                            >
                                À propos
                            </Link>

                            <Link
                                href="/blog"
                                onClick={closeSheet}
                                className={`rounded-md px-3 py-2 text-base ${
                                    isBlogActive
                                        ? "bg-blue-50 font-medium text-blue-600"
                                        : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                                }`}
                            >
                                Blog
                            </Link>

                            <div className="my-2 border-t" />

                            {/* User Navigation in Mobile */}
                            <NavUserPublic />
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
