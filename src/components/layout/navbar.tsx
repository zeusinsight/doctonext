"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { NavUserPublic } from "./nav-user-public";

export const Navbar = () => {

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-4 w-full py-4">
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
          <Link href="/dashboard/listings/new">
            Déposer une annonce
          </Link>
        </Button>
        
        <Button
          asChild
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700 whitespace-nowrap flex-shrink-0"
        >
          <Link href="/listings">
            Annonces
          </Link>
        </Button>
        
        {/* Spacer */}
        <div className="flex-1"></div>

        {/* User Navigation */}
        <div className="flex-shrink-0">
          <NavUserPublic />
        </div>
      </div>
    </div>
  );
};
