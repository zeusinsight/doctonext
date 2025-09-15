"use client"

import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui"
import { NavUser } from "@/components/layout/nav-user"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function ProtectedPage({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <RedirectToSignUp />
            <SignedIn>
                <div className="min-h-screen bg-blue-700">
                    <div className="mx-auto w-full">
                        <header className="flex items-center justify-between border-gray-200 border-b bg-gray-50 py-4 shadow-sm">
                            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6">
                                {/* Logo */}
                                <Link
                                    href="/"
                                    className="flex flex-shrink-0 items-center"
                                >
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
                                    <Link href="/dashboard/annonces/new">
                                        Déposer une annonce
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="default"
                                    size="sm"
                                    className="flex-shrink-0 whitespace-nowrap bg-green-600 hover:bg-green-700"
                                >
                                    <Link href="/annonces">Annonces</Link>
                                </Button>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* User Navigation */}
                                <div className="flex-shrink-0">
                                    <NavUser />
                                </div>
                            </div>
                        </header>
                        <div className="overflow-hidden">
                            <div className="mx-auto max-w-7xl p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </SignedIn>
        </>
    )
}
