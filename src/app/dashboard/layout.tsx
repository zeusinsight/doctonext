"use client";

import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui";
import { NavUser } from "@/components/layout/nav-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RedirectToSignUp />
      <SignedIn>
        <div className="min-h-screen" style={{ backgroundColor: "#206dc5" }}>
          <div className="mx-auto w-full">
            <header className="flex items-center border-gray-200 border-b bg-gray-50 py-3 sm:py-4 shadow-sm">
              <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 sm:gap-4 px-3 sm:px-6">
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

                {/* Navigation buttons (desktop) */}
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="whitespace-nowrap text-white"
                    style={{ backgroundColor: "#206dc5" }}
                  >
                    <Link href="/dashboard/annonces/new">
                      Déposer une annonce
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="whitespace-nowrap text-white"
                    style={{ backgroundColor: "#14b8a6" }}
                  >
                    <Link href="/annonces">Annonces</Link>
                  </Button>
                </div>

                {/* Spacer */}
                <div className="hidden md:block flex-1" />

                {/* User Navigation (desktop) */}
                <div className="hidden md:block min-w-0">
                  <NavUser />
                </div>

                {/* Mobile menu */}
                <div className="ml-auto md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Ouvrir le menu">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 sm:max-w-sm">
                      <SheetHeader>
                        <SheetTitle>Menu</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 space-y-3">
                        <Button
                          asChild
                          className="w-full text-white"
                          style={{ backgroundColor: "#206dc5" }}
                        >
                          <Link href="/dashboard/annonces/new">Déposer une annonce</Link>
                        </Button>
                        <Button
                          asChild
                          variant="secondary"
                          className="w-full"
                          style={{ backgroundColor: "#e5e7eb", color: "#111827" }}
                        >
                          <Link href="/annonces">Annonces</Link>
                        </Button>
                        <div className="h-px bg-muted" />
                        <Link href="/dashboard/favorites" className="block rounded-md px-2 py-2 hover:bg-muted">
                          Favoris
                        </Link>
                        <Link href="/dashboard/messages" className="block rounded-md px-2 py-2 hover:bg-muted">
                          Messages
                        </Link>
                        <Link href="/dashboard" className="block rounded-md px-2 py-2 hover:bg-muted">
                          Profil
                        </Link>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </header>
            <div className="overflow-hidden">
              <div className="mx-auto max-w-[1600px] p-6">{children}</div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
