"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ListingSearchHero } from "@/components/listings/listing-search-hero";
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card";
import {
  ListingsFilterModal,
  type ListingFilters,
} from "@/components/listings/listings-filter-modal";
import type { PublicListing } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Check } from "lucide-react";
import { createSavedSearch } from "@/lib/actions/saved-searches";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// Dynamic imports to prevent SSR issues
const FranceMap = dynamic(
  () => import("@/components/map/france-map").then((mod) => mod.FranceMap),
  { ssr: false },
);

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<PublicListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PublicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "sales" | "replacements" | "collaborations"
  >("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListingFilters>({
    specialties: [],
    regions: [],
    listingTypes: [],
    collaborationTypes: [],
    isBoostPlus: undefined,
  });
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = authClient.useSession();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set initial search query and filters from URL
    const urlSearchQuery = searchParams.get("search") || "";
    setSearchQuery(urlSearchQuery);

    // Read filter parameters from URL
    const urlSpecialties = searchParams.get("specialties");
    const urlRegions = searchParams.get("regions");
    const urlListingTypes = searchParams.get("listingTypes");
    const urlCollaborationTypes = searchParams.get("collaborationTypes");

    // Parse and set filters from URL
    const initialFilters: ListingFilters = {
      specialties: urlSpecialties ? urlSpecialties.split(",") : [],
      regions: urlRegions ? urlRegions.split(",") : [],
      listingTypes: urlListingTypes
        ? (urlListingTypes.split(",") as (
            | "transfer"
            | "replacement"
            | "collaboration"
          )[])
        : [],
      collaborationTypes: urlCollaborationTypes
        ? urlCollaborationTypes.split(",")
        : [],
      isBoostPlus: undefined,
    };

    setFilters(initialFilters);
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, searchQuery, activeTab, filters]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      const data = await response.json();

      if (data.success && data.data) {
        setListings(data.data.listings || []);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    // Filter by tab
    if (activeTab === "sales") {
      filtered = filtered.filter((l) => l.listingType === "transfer");
    } else if (activeTab === "replacements") {
      filtered = filtered.filter((l) => l.listingType === "replacement");
    } else if (activeTab === "collaborations") {
      filtered = filtered.filter((l) => l.listingType === "collaboration");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.description?.toLowerCase().includes(query) ||
          l.specialty?.toLowerCase().includes(query) ||
          l.location?.city?.toLowerCase().includes(query),
      );
    }

    // Filter by specialties
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(
        (l) => l.specialty && filters.specialties.includes(l.specialty),
      );
    }

    // Filter by regions
    if (filters.regions.length > 0) {
      filtered = filtered.filter(
        (l) =>
          l.location?.region && filters.regions.includes(l.location.region),
      );
    }

    // Filter by listing types
    if (filters.listingTypes.length > 0) {
      filtered = filtered.filter((l) =>
        filters.listingTypes.includes(l.listingType),
      );
    }

    // Filter by collaboration types (only if collaboration is in listing types and specific subtypes are selected)
    if (
      filters.collaborationTypes.length > 0 &&
      filters.listingTypes.includes("collaboration")
    ) {
      filtered = filtered.filter(
        (l) =>
          l.listingType === "collaboration" &&
          l.collaborationType &&
          filters.collaborationTypes.includes(l.collaborationType),
      );
    }

    // Filter by Boost Plus
    if (filters.isBoostPlus === true) {
      filtered = filtered.filter((l) => l.isBoostPlus);
    }

    setFilteredListings(filtered);
  };

  const handleSearch = useCallback(
    (query: string) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for debounced search - reduced from 600ms to 300ms
      searchTimeoutRef.current = setTimeout(() => {
        setSearchQuery(query);
        // Reset URL search params when performing a new search
        router.push("/annonces", { scroll: false });
      }, 300); // 300ms debounce delay for faster response
    },
    [router],
  );

  const handleTabChange = (
    tab: "all" | "sales" | "replacements" | "collaborations",
  ) => {
    setActiveTab(tab);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFiltersChange = (newFilters: ListingFilters) => {
    setFilters(newFilters);
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      toast.error("Veuillez entrer un nom pour votre recherche");
      return;
    }

    if (!session?.user) {
      toast.error("Vous devez être connecté pour sauvegarder une recherche");
      return;
    }

    setIsSaving(true);
    try {
      // Create search criteria with current search state
      const searchCriteria = {
        ...filters,
        searchQuery: searchQuery || undefined,
        activeTab: activeTab !== "all" ? activeTab : undefined,
      };

      const result = await createSavedSearch(
        searchName,
        searchCriteria as ListingFilters,
        emailAlerts,
      );
      if (result.success) {
        toast.success("Recherche sauvegardée avec succès");
        setShowSaveSearch(false);
        setSearchName("");
      } else {
        toast.error(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde de la recherche");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate active filters count
  const activeFiltersCount =
    filters.specialties.length +
    filters.regions.length +
    filters.listingTypes.length +
    filters.collaborationTypes.length +
    (filters.isBoostPlus ? 1 : 0);

  // Sort listings to show boosted ones first
  const sortedListings = [...filteredListings].sort((a, b) => {
    // If one has isBoostPlus and the other doesn't, prioritize the boosted one
    if (a.isBoostPlus && !b.isBoostPlus) return -1;
    if (!a.isBoostPlus && b.isBoostPlus) return 1;
    // If both are the same boost status, maintain original order
    return 0;
  });

  return (
    <>
      <ListingSearchHero
        initialSearch={searchQuery}
        onSearch={handleSearch}
        onTabChange={handleTabChange}
        onFilterClick={handleFilterClick}
        activeFiltersCount={activeFiltersCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ListingsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="space-y-8">
            <div>
              <div className="mb-6 h-8 w-64 animate-pulse rounded bg-gray-200" />
              {viewMode === "list" ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-xl border border-gray-100 bg-white"
                    >
                      {/* Image skeleton */}
                      <div className="relative aspect-[4/3] animate-pulse bg-gray-200">
                        {/* Badge skeletons */}
                        <div className="absolute top-2 left-2">
                          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-300" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="h-5 w-14 animate-pulse rounded-full bg-gray-300" />
                        </div>
                        {/* Favorite button skeleton */}
                        <div className="absolute right-2 bottom-2">
                          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
                        </div>
                      </div>

                      {/* Content skeleton */}
                      <div className="space-y-2 p-4">
                        {/* Title and price */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-16 shrink-0 animate-pulse rounded bg-gray-200" />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                        </div>

                        {/* Location */}
                        <div className="pt-1">
                          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[600px] animate-pulse rounded-lg bg-gray-200" />
              )}
            </div>
          </div>
        ) : (
          <>
            {(viewMode === "list" && sortedListings.length > 0) ||
            viewMode === "map" ? (
              <div>
                <h2 className="mb-6 font-bold text-2xl">
                  {viewMode === "list"
                    ? `Toutes les annonces (${sortedListings.length})`
                    : "Carte de France"}
                </h2>

                {viewMode === "list" ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {sortedListings.map((listing) => (
                      <SponsoredListingCard
                        key={listing.id}
                        listing={listing}
                        orientation="vertical"
                        className="h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[600px] w-full">
                    <FranceMap height="600px" listings={sortedListings} />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="font-medium text-lg">Aucune annonce trouvée</p>
                <p className="mt-2 text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>

                {/* Save Search Section */}
                {session?.user && (searchQuery || activeFiltersCount > 0) && (
                  <div className="mt-8 w-full max-w-md">
                    {!showSaveSearch ? (
                      <Button
                        variant="default"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => setShowSaveSearch(true)}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Sauvegarder cette recherche et recevoir des alertes
                      </Button>
                    ) : (
                      <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                        <div className="space-y-2">
                          <Label htmlFor="search-name">
                            Nom de la recherche
                          </Label>
                          <Input
                            id="search-name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Ex: Cabinets de généralistes en Île-de-France"
                            disabled={isSaving}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="email-alerts"
                            className="cursor-pointer"
                          >
                            Recevoir des alertes par email
                          </Label>
                          <Switch
                            id="email-alerts"
                            checked={emailAlerts}
                            onCheckedChange={setEmailAlerts}
                            disabled={isSaving}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowSaveSearch(false);
                              setSearchName("");
                            }}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={handleSaveSearch}
                            disabled={isSaving}
                            className="flex-1"
                          >
                            {isSaving ? (
                              "Sauvegarde..."
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function ListingsPageFallback() {
  return (
    <>
      <ListingSearchHero
        initialSearch=""
        onSearch={() => {}}
        onTabChange={() => {}}
        onFilterClick={() => {}}
        viewMode="list"
        onViewModeChange={() => {}}
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <div>
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsPageFallback />}>
      <ListingsContent />
    </Suspense>
  );
}
