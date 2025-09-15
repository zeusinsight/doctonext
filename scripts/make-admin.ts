import { db } from "@/database/db"
import { users } from "@/database/schema"
import { eq } from "drizzle-orm"

// Replace with your email - update this with your actual email
const ADMIN_EMAIL = "thomas@zeusinlabs.com"

async function makeAdmin() {
    try {
        const result = await db
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.email, ADMIN_EMAIL))
            .returning()

        if (result.length > 0) {
            console.log(`✅ User ${ADMIN_EMAIL} is now an admin`)
        } else {
            console.log(`❌ User ${ADMIN_EMAIL} not found`)
        }
    } catch (error) {
        console.error("Error:", error)
    }

    process.exit(0)
}

makeAdmin()
