"use client";

import { RedirectToSignUp, SignedIn } from "@daveyplate/better-auth-ui";
import { NavUser } from "@/components/layout/nav-user";
import { Button } from "@/components/ui/button";
import { SearchWithHistory } from "@/components/ui/search-with-history";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/listings?search=${encodeURIComponent(query.trim())}`);
    }
  };
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

                {/* Deposit button */}
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 hidden sm:flex whitespace-nowrap flex-shrink-0"
                >
                  <Link href="/dashboard/listings/new">
                    📝 Déposer une annonce
                  </Link>
                </Button>

                {/* Search Bar - Full width */}
                <SearchWithHistory
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={handleSearch}
                  placeholder="Rechercher sur Doctonext"
                  className="flex-1"
                  inputClassName="h-9 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />

                {/* User Navigation */}
                <div className="flex-shrink-0">
                  <NavUser />
                </div>
              </div>
            </header>
            <div className="overflow-hidden">
              <div className="max-w-6xl mx-auto p-6">{children}</div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
