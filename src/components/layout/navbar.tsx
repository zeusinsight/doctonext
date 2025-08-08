"use client"
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui"
import { Menu, X, Home, ListOrdered, LogIn, Plus, UserPlus } from "lucide-react"
import Link from "next/link"
import React from "react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "../ui/sheet"

interface RouteProps {
    href: string
    label: string
}

const routeList: RouteProps[] = [
    {
        href: "/",
        label: "Accueil"
    },
    {
        href: "/annonces",
        label: "Annonces"
    },
    {
        href: "/comment-ca-marche",
        label: "Comment ça marche"
    }
]

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
            <nav className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between px-4 py-4 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="font-bold text-2xl"
                    >
                        <span className="text-blue-600">Docto</span>
                        <span className="text-green-600">next</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-8 lg:flex">
                        {routeList.map(({ href, label }, index) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                            >
                                {index === 0 && <Home className="size-4" />}
                                {index === 1 && <ListOrdered className="size-4" />}
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <SignedOut>
                            <Button
                                asChild
                                variant="ghost"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                            >
                                <Link href="/auth/sign-in">
                                    <LogIn className="size-4" />
                                    Connexion
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                <Link href="/auth/sign-up">
                                    <UserPlus className="size-4" />
                                    Inscription
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <Link href="/deposer-annonce">
                                    <Plus className="size-4" />
                                    Déposer une annonce
                                </Link>
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <Button
                                asChild
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <Link href="/deposer-annonce">
                                    <Plus className="size-4" />
                                    Déposer une annonce
                                </Link>
                            </Button>
                            <UserButton />
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg hover:bg-accent/50"
                                    aria-label="Toggle menu"
                                >
                                    {isOpen ? (
                                        <X className="size-4" />
                                    ) : (
                                        <Menu className="size-4" />
                                    )}
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-full max-w-sm border-l bg-white"
                            >
                                <div className="flex h-full flex-col">
                                    <SheetHeader className="pb-4">
                                        <SheetTitle>
                                            <Link
                                                href="/"
                                                className="font-bold text-2xl text-blue-600"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Doctonext
                                            </Link>
                                        </SheetTitle>
                                    </SheetHeader>

                                    <Separator className="mb-4" />

                                    {/* Mobile Navigation Links */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="space-y-1">
                                            {routeList.map(
                                                ({ href, label }, index) => (
                                                    <Button
                                                        key={href}
                                                        onClick={() =>
                                                            setIsOpen(false)
                                                        }
                                                        asChild
                                                        variant="ghost"
                                                        className="h-auto w-full justify-start px-3 py-2.5 font-medium hover:bg-gray-100"
                                                    >
                                                        <Link href={href} className="flex items-center gap-2">
                                                            {index === 0 && <Home className="size-4" />}
                                                            {index === 1 && <ListOrdered className="size-4" />}
                                                            {label}
                                                        </Link>
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Actions */}
                                    <SheetFooter className="flex-col gap-2 border-t pt-4">
                                        <SignedOut>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full flex items-center gap-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Link href="/auth/sign-in">
                                                    <LogIn className="size-4" />
                                                    Connexion
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Link href="/auth/sign-up">
                                                    <UserPlus className="size-4" />
                                                    Inscription
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Link href="/deposer-annonce">
                                                    <Plus className="size-4" />
                                                    Déposer une annonce
                                                </Link>
                                            </Button>
                                        </SignedOut>
                                        <SignedIn>
                                            <Button
                                                asChild
                                                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Link href="/deposer-annonce">
                                                    <Plus className="size-4" />
                                                    Déposer une annonce
                                                </Link>
                                            </Button>
                                            <div className="flex justify-center pt-2">
                                                <UserButton />
                                            </div>
                                        </SignedIn>
                                    </SheetFooter>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </div>
    )
}