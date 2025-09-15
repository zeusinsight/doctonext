import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Redirect all old auth paths to new ones
    if (pathname.startsWith("/auth/")) {
        if (pathname === "/auth/sign-in" || pathname.includes("sign-in")) {
            const searchParams = request.nextUrl.search
            return NextResponse.redirect(
                new URL(`/login${searchParams}`, request.url)
            )
        }
        if (pathname === "/auth/sign-up" || pathname.includes("sign-up")) {
            const searchParams = request.nextUrl.search
            return NextResponse.redirect(
                new URL(`/register${searchParams}`, request.url)
            )
        }
        // Handle other auth paths by keeping them under /auth
        return NextResponse.next()
    }

    // Check cookie for optimistic redirects for protected routes
    // Email verification will be handled at the page/component level
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        const redirectTo = request.nextUrl.pathname + request.nextUrl.search
        return NextResponse.redirect(
            new URL(`/login?redirectTo=${redirectTo}`, request.url)
        )
    }

    return NextResponse.next()
}

export const config = {
    // Protected routes - all dashboard routes and auth settings, plus auth redirects
    matcher: ["/dashboard/:path*", "/auth/:path*"]
}
