"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { SearchWithHistory } from "../ui/search-with-history";
import { NavUserPublic } from "./nav-user-public";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/listings?search=${encodeURIComponent(query.trim())}`);
    }
  };

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
          <NavUserPublic />
        </div>
      </div>
    </div>
  );
};
