import { SPECIALTY_SLUG_TO_LABEL, getSpecialtySlug } from "@/lib/constants/specialties";

/**
 * Map of specialty slugs to their default image filenames
 * This will be used to generate the full path
 */
const SPECIALTY_IMAGE_MAP: Record<string, string> = {
  "medecine-generale": "medecine-generale.jpg",
  dentistes: "dentistes.jpg",
  pharmacies: "pharmacies.jpg",
  kinesitherapie: "kinesitherapie.jpg",
  orthophoniste: "orthophoniste.jpg",
  infirmier: "infirmier.jpg",
  "sage-femme": "sage-femme.jpg",
  osteopathe: "osteopathe.jpg",
  cardiologie: "cardiologie.jpg",
  dermatologie: "dermatologie.jpg",
  gynecologie: "gynecologie.jpg",
  neurologie: "neurologie.jpg",
  ophtalmologie: "ophtalmologie.jpg",
  orthopédie: "orthopedie.jpg",
  pédiatrie: "pediatrie.jpg",
  psychiatrie: "psychiatrie.jpg",
  radiologie: "radiologie.jpg",
  chirurgie: "chirurgie.jpg",
  anesthésie: "anesthesie.jpg",
  endocrinologie: "endocrinologie.jpg",
  "gastro-enterologie": "gastro-enterologie.jpg",
  pneumologie: "pneumologie.jpg",
  rhumatologie: "rhumatologie.jpg",
  urologie: "urologie.jpg",
  orl: "orl.jpg",
  podologie: "podologie.jpg",
  psychologie: "psychologie.jpg",
  dietetique: "dietetique.jpg",
};

/**
 * Get the default image URL for a listing
 * Prioritizes specialty-specific images, falls back to listing type images
 * 
 * @param listingType - The type of listing (transfer, replacement, collaboration)
 * @param specialty - The medical specialty (optional)
 * @returns The URL to the default image
 */
export function getDefaultListingImage(
  listingType: "transfer" | "replacement" | "collaboration",
  specialty?: string | null
): string {
  // If specialty is provided, try to find a matching image
  if (specialty) {
    // The specialty might be the label (e.g. "Médecin généraliste") or the slug
    // Try to get the slug if it's a label
    const slug = getSpecialtySlug(specialty) || specialty;
    
    // Check if we have a mapping for this slug (normalized to lowercase just in case)
    const lowerSlug = slug.toLowerCase();
    if (lowerSlug in SPECIALTY_IMAGE_MAP) {
      return `/default-images/specialties/${SPECIALTY_IMAGE_MAP[lowerSlug]}`;
    }
  }

  // Fallback to listing type images
  const imageMap = {
    transfer: "/default-images/transfer.jpg",
    replacement: "/default-images/replacement.jpg",
    collaboration: "/default-images/collaboration.jpg",
  };

  return imageMap[listingType];
}

/**
 * Check if default images exist, returns a placeholder if not
 * This function can be extended to check for actual file existence
 */
export function getListingImageOrDefault(
  imageUrl: string | null | undefined,
  listingType: "transfer" | "replacement" | "collaboration",
  specialty?: string | null
): string | null {
  if (imageUrl) {
    return imageUrl;
  }

  return getDefaultListingImage(listingType, specialty);
}
