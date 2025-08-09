"use client"

import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui"
import { NavUser } from "@/components/layout/nav-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { site } from "@/config/site"
import { RiSearchLine } from "@remixicon/react"

export default function ProtectedPage({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <RedirectToSignUp />
            <SignedIn>
                <div className="">
                    <div className="mx-auto w-full">
                        <header className="flex items-center justify-between border-b py-4 overflow-x-auto">
                            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full min-w-0">
                            {/* Left side - Logo and text */}
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    <span className="font-bold text-lg text-blue-600 whitespace-nowrap">
                                        Docto<span className="text-green-600">next</span>
                                    </span>
                                </Link>
                                <Button
                                    asChild
                                    variant="default"
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 hidden sm:flex whitespace-nowrap"
                                >
                                    <Link href="/dashboard/listings/new">
                                        📝 Déposer une annonce
                                    </Link>
                                </Button>
                                
                                {/* Search Bar - Responsive width */}
                                <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                    <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher des annonces..."
                                        className="pl-10 w-full h-9 min-w-0"
                                    />
                                </div>
                            </div>
                            {/* Right side - Navigation */}
                            <div className="flex-shrink-0">
                                <NavUser />
                            </div>
                            </div>
                        </header>
                        <div className="overflow-hidden">
                            <div className="max-w-6xl mx-auto p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SignedIn>
        </>
    )
}
