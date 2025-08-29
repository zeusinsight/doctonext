"use client";

import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui";
import { NavUser } from "@/components/layout/nav-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RedirectToSignUp />
      <SignedIn>
        <div className="min-h-screen bg-blue-700">
          <div className="mx-auto w-full">
            <header className="flex items-center justify-between border-b border-gray-200 py-4 bg-gray-50 shadow-sm">
              <div className="max-w-6xl mx-auto px-6 flex items-center gap-4 w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center flex-shrink-0">
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
                  className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap flex-shrink-0"
                >
                  <Link href="/dashboard/annonces/new">
                    Déposer une annonce
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 whitespace-nowrap flex-shrink-0"
                >
                  <Link href="/annonces">
                    Annonces
                  </Link>
                </Button>
                
                {/* Spacer */}
                <div className="flex-1"></div>

                {/* User Navigation */}
                <div className="flex-shrink-0">
                  <NavUser />
                </div>
              </div>
            </header>
            <div className="overflow-hidden">
              <div className="max-w-7xl mx-auto p-6">{children}</div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
