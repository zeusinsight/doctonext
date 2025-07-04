import { createUploadthing, type FileRouter } from "uploadthing/next"
import { authClient } from "@/lib/auth-client"

const f = createUploadthing()

// Helper to get user info from the request
async function getUserFromRequest(req: Request) {
    try {
        const sessionCookie = req.headers
            .get("cookie")
            ?.split(";")
            .find((c) => c.trim().startsWith("session="))
            ?.split("=")[1]

        if (!sessionCookie) {
            throw new Error("No session cookie")
        }

        const session = await authClient.getSession(undefined, {
            headers: {
                cookie: `session=${sessionCookie}`
            }
        })

        const user = session?.data?.user
        if (!user?.id) {
            throw new Error("No user in session")
        }

        // Clean the name for file naming
        const cleanName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '')

        return {
            id: user.id,
            name: cleanName || `user${user.id}`
        }
    } catch (error) {
        console.error("Error getting user:", error)
        return { id: "anonymous", name: "anonymous" }
    }
}

export const ourFileRouter = {
    // Define avatar upload route
    avatarUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async ({ req }) => {
            const user = await getUserFromRequest(req)
            const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
            
            // Format: YYYY-MM-DD_userid_name
            const fileName = `${date}_${user.id}_${user.name}`

            return {
                fileName
            }
        })
        .onUploadComplete(async ({ file }) => {
            return { ufsUrl: file.ufsUrl }
        })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
