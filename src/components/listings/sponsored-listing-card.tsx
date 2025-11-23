"use client";

import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getDefaultListingImage } from "@/lib/utils/default-images";
import type { ListingWithDetails, PublicListing } from "@/types/listing";

interface SponsoredListingCardProps {
  listing: PublicListing | ListingWithDetails;
  className?: string;
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
}

export function SponsoredListingCard({
  listing,
  className,
  orientation = "horizontal",
  compact = false,
}: SponsoredListingCardProps) {
  const firstImage =
    "media" in listing && listing.media?.length > 0 ? listing.media[0] : null;

  // Use default image if no media is available
  const imageUrl =
    firstImage?.fileUrl || getDefaultListingImage(listing.listingType, listing.specialty);

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPrice = () => {
    if (listing.listingType === "transfer" && "salePrice" in listing) {
      return formatPrice(listing.salePrice);
    }
    if (listing.listingType === "replacement" && "dailyRate" in listing) {
      const rate = formatPrice(listing.dailyRate);
      return rate ? `${rate}/jour` : null;
    }
    if (
      listing.listingType === "collaboration" &&
      "investmentAmount" in listing
    ) {
      const amount = listing.investmentAmount;
      if (amount === "to_discuss") return "À discuter";
      if (amount) return formatPrice(Number(amount));
    }
    return null; // No price available
  };

  const price = getPrice();

  if (orientation === "vertical") {
    return (
      <Link href={`/annonces/${listing.id}`} className="group block">
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-md",
            className,
          )}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute right-2 bottom-2">
              <FavoriteButton
                listingId={listing.id}
                listingTitle={listing.title || "Cabinet médical moderne"}
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                showToast={false}
              />
            </div>
            <div className="absolute top-2 left-2">
              <Badge className="border-0 bg-white/90 px-2 py-0.5 text-emerald-700 text-xs backdrop-blur-sm">
                {listing.listingType === "transfer"
                  ? "Cession"
                  : listing.listingType === "replacement"
                    ? "Remplacement"
                    : "Collaboration"}
              </Badge>
            </div>
            {"isBoostPlus" in listing && listing.isBoostPlus && (
              <div className="absolute top-2 right-2">
                <Badge className="border-amber-500/60 bg-amber-50/90 px-2 py-0.5 text-amber-600 text-xs backdrop-blur-sm">
                  Boost+
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 font-medium text-gray-900 text-sm transition-colors group-hover:text-blue-600">
                {listing.title || "Cabinet médical moderne"}
              </h3>
              <span className="shrink-0 font-semibold text-gray-900 text-sm">
                {price || "-"}
              </span>
            </div>
            <p className="line-clamp-2 text-gray-600 text-xs leading-relaxed">
              {listing.description ||
                "Opportunité exceptionnelle dans un quartier dynamique avec forte patientèle établie"}
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MapPin className="h-3 w-3" />
                <span>{listing.location?.city || "Paris"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/annonces/${listing.id}`} className="group block">
      <div
        className={cn(
          "rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-sm",
          className,
        )}
      >
        <div className={cn("flex gap-3", compact ? "p-2" : "p-3")}>
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-lg bg-gray-50",
              compact ? "h-20 w-20" : "h-28 w-28",
            )}
          >
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-1 left-1">
              <Badge className="border-0 bg-white/90 px-1.5 py-0.5 text-[10px] text-emerald-700 backdrop-blur-sm">
                {listing.listingType === "transfer"
                  ? "Cession"
                  : listing.listingType === "replacement"
                    ? "Remplacement"
                    : "Collaboration"}
              </Badge>
            </div>
            {"isBoostPlus" in listing && listing.isBoostPlus && (
              <div className="absolute top-1 right-1">
                <Badge className="border-amber-500/60 bg-amber-50/90 px-1.5 py-0.5 text-[10px] text-amber-600 backdrop-blur-sm">
                  Boost+
                </Badge>
              </div>
            )}
            {!compact && (
              <div className="absolute right-1 bottom-1">
                <FavoriteButton
                  listingId={listing.id}
                  listingTitle={listing.title || "Cabinet médical moderne"}
                  variant="ghost"
                  className="h-6 w-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  showToast={false}
                />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div>
              <div
                className={cn(
                  "mb-1 flex items-start justify-between gap-3",
                  compact && "pr-6",
                )}
              >
                <h3 className="line-clamp-1 font-medium text-gray-900 text-sm transition-colors group-hover:text-blue-600">
                  {listing.title || "Cabinet médical moderne"}
                </h3>
                <span className="shrink-0 font-semibold text-gray-900 text-sm">
                  {price || "-"}
                </span>
              </div>
              {listing.specialty && (
                <p className="mb-1.5 text-gray-500 text-xs">
                  {listing.specialty}
                </p>
              )}
              <p className="line-clamp-2 text-gray-600 text-xs leading-relaxed">
                {listing.description ||
                  "Opportunité exceptionnelle dans un quartier dynamique avec forte patientèle établie"}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">
                    {listing.location?.city || "Paris"}
                  </span>
                </div>
                {!compact && (
                  <Badge
                    variant="secondary"
                    className="h-5 border-emerald-200 bg-emerald-50 px-1.5 text-[10px] text-emerald-700"
                  >
                    {listing.listingType === "transfer"
                      ? "Cession"
                      : listing.listingType === "replacement"
                        ? "Remplacement"
                        : "Collaboration"}
                  </Badge>
                )}
              </div>
              {!compact && (
                <span className="text-[10px] text-gray-400">
                  {listing.publishedAt
                    ? new Date(listing.publishedAt).toLocaleDateString("fr-FR")
                    : "Aujourd'hui"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
