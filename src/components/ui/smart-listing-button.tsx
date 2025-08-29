"use client"

import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import type { ReactNode } from "react"

interface SmartListingButtonProps {
    children: ReactNode
    className?: string
    unauthenticatedHref?: string
}

export function SmartListingButton({
    children,
    className,
    unauthenticatedHref = "/login"
}: SmartListingButtonProps) {
    const { data: session } = useQuery({
        queryKey: ["auth", "session"],
        queryFn: () => authClient.getSession()
    })

    const isAuthenticated = !!session?.data?.user
    const href = isAuthenticated
        ? "/dashboard/annonces/new"
        : unauthenticatedHref

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}
