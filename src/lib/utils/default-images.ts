/**
 * Get the default image URL for a listing type
 * @param listingType - The type of listing (transfer, replacement, collaboration)
 * @returns The URL to the default image
 */
export function getDefaultListingImage(
  listingType: "transfer" | "replacement" | "collaboration"
): string {
  const imageMap = {
    transfer: "/default-images/transfer.jpeg",
    replacement: "/default-images/replacement.jpeg",
    collaboration: "/default-images/collaboration.jpeg",
  };

  return imageMap[listingType];
}

/**
 * Check if default images exist, returns a placeholder if not
 * This function can be extended to check for actual file existence
 */
export function getListingImageOrDefault(
  imageUrl: string | null | undefined,
  listingType: "transfer" | "replacement" | "collaboration"
): string | null {
  if (imageUrl) {
    return imageUrl;
  }

  return getDefaultListingImage(listingType);
}
