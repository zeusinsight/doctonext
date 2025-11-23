import "dotenv/config";
import { db } from "../src/database/db";
import { listings, listingMedia } from "../src/database/schema";
import { eq, and, isNull, sql, like } from "drizzle-orm";
import { getDefaultListingImage } from "../src/lib/utils/default-images";

/**
 * Script to add default images to listings that don't have any media
 * This should be run once to populate existing listings with default images
 */

async function addDefaultImages() {
  console.log("Starting to add default images to listings without media...");

  try {
    // Optional: Clear existing default images to force update
    // This is useful since we changed the file extension and logic
    console.log("Cleaning up old default images...");
    const deleted = await db
      .delete(listingMedia)
      .where(like(listingMedia.fileName, "default-%"));
    console.log("Deleted old default images");

    // Find all listings that don't have any media using LEFT JOIN
    const listingsWithoutMedia = await db
      .select({
        id: listings.id,
        listingType: listings.listingType,
        specialty: listings.specialty,
      })
      .from(listings)
      .leftJoin(listingMedia, eq(listings.id, listingMedia.listingId))
      .where(isNull(listingMedia.id));

    console.log(`Found ${listingsWithoutMedia.length} listings without media`);

    if (listingsWithoutMedia.length === 0) {
      console.log("No listings need default images. All set!");
      return;
    }

    // Insert default images for each listing
    const mediaToInsert = listingsWithoutMedia.map((listing) => {
      const fileUrl = getDefaultListingImage(
        listing.listingType as "transfer" | "replacement" | "collaboration",
        listing.specialty
      );
      const fileName = listing.specialty 
        ? `default-${listing.specialty}-${listing.listingType}.jpg`
        : `default-${listing.listingType}.jpg`;

      return {
        id: `default_${listing.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        listingId: listing.id,
        fileUrl,
        fileName,
        fileType: "image/jpeg",
        fileSize: null,
        uploadKey: null,
        displayOrder: 0,
      };
    });

    // Insert all default images in a batch
    await db.insert(listingMedia).values(mediaToInsert);

    console.log(`Successfully added default images to ${mediaToInsert.length} listings`);

    // Summary by listing type
    const summary = listingsWithoutMedia.reduce((acc, listing) => {
      acc[listing.listingType] = (acc[listing.listingType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("Summary by listing type:");
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} listings`);
    });

  } catch (error) {
    console.error("Error adding default images:", error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  addDefaultImages()
    .then(() => {
      console.log("Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}

export { addDefaultImages };
