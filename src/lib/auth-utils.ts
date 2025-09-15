import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export type UserRole = "user" | "admin"

export async function getCurrentUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return null
        }

        // Fetch full user data including role from database
        const { db } = await import("@/database/db")
        const { users } = await import("@/database/schema")
        const { eq } = await import("drizzle-orm")

        const [fullUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1)

        if (fullUser) {
            // Merge session data with database data
            return {
                ...session.user,
                ...fullUser
            }
        }

        return session.user
    } catch (error) {
        console.error("Error getting current user:", error)
        // Fallback to session user if database query fails
        const session = await auth.api.getSession({
            headers: await headers()
        })
        return session?.user || null
    }
}

export async function requireAuth() {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/auth/sign-in")
    }
    return user
}

export async function requireAdmin() {
    const user = await requireAuth()

    if ((user as any).role !== "admin") {
        redirect("/dashboard")
    }
    return user
}

export function isAdmin(user: any): boolean {
    return user?.role === "admin"
}

export function canManageBlog(user: any): boolean {
    return isAdmin(user)
}
