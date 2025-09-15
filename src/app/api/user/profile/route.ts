import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Return user data including role
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user as any).role || "user",
            image: user.image
        })
    } catch (error) {
        console.error("Error fetching user profile:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
