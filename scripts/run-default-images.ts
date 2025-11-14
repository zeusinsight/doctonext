#!/usr/bin/env tsx

/**
 * Simple runner script to add default images to existing listings
 * Usage: npx tsx scripts/run-default-images.ts
 */

import { addDefaultImages } from "./add-default-images";

console.log("🖼️  Adding default images to listings without media...");
console.log("This will update existing listings in the database.\n");

addDefaultImages()
  .then(() => {
    console.log("\n✅ Default images have been successfully added!");
    console.log("Existing listings now have appropriate default images based on their type.");
  })
  .catch((error) => {
    console.error("\n❌ Failed to add default images:", error);
    process.exit(1);
  });
