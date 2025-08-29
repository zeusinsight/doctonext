"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { NavUserPublic } from "./nav-user-public"
import { SmartListingButton } from "../ui/smart-listing-button"

export const Navbar = () => {
    return (
        <div className="sticky top-0 z-50 w-full border-gray-200 border-b bg-gray-50 shadow-sm">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
                {/* Logo */}
                <Link href="/" className="flex flex-shrink-0 items-center">
                    <Image
                        src="/logo.png"
                        alt="DoctoNext"
                        width={120}
                        height={40}
                        className="h-6 w-auto"
                    />
                </Link>

                {/* Navigation buttons */}
                <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700"
                >
                    <SmartListingButton>Déposer une annonce</SmartListingButton>
                </Button>

                <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap bg-green-600 hover:bg-green-700"
                >
                    <Link href="/annonces">Annonces</Link>
                </Button>

                {/* Additional Navigation Links */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Link href="/a-propos">À propos</Link>
                </Button>

                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 whitespace-nowrap text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Link href="/blog">Blog</Link>
                </Button>

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
