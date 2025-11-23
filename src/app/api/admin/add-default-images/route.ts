import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { listings, listingMedia } from "@/database/schema";
import { eq, and, isNull } from "drizzle-orm";
import { getDefaultListingImage } from "@/lib/utils/default-images";

/**
 * API endpoint to add default images to listings that don't have any media
 * This should be called once to populate existing listings with default images
 */
export async function POST() {
  try {
    console.log("Starting to add default images to listings without media...");

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
      return NextResponse.json({
        success: true,
        message: "No listings need default images. All set!",
        count: 0,
      });
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

    console.log("Summary by listing type:", summary);

    return NextResponse.json({
      success: true,
      message: `Successfully added default images to ${mediaToInsert.length} listings`,
      count: mediaToInsert.length,
      summary,
    });

  } catch (error) {
    console.error("Error adding default images:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add default images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
