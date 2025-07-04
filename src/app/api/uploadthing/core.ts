import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
    // Define avatar upload route
    avatarUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            try {
                // Generate a unique filename with timestamp
                const date = new Date().toISOString().split('T')[0]
                const timestamp = Date.now().toString(36)
                const fileName = `${date}_${timestamp}`

                return {
                    fileName
                }
            } catch (error) {
                console.error("Error in upload middleware:", error)
                throw new Error("Unauthorized")
            }
        })
        .onUploadComplete(async ({ file }) => {
            return { ufsUrl: file.ufsUrl }
        })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
