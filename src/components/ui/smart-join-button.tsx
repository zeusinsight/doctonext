"use client"

import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import type { ReactNode } from "react"

interface SmartJoinButtonProps {
    children: ReactNode
    className?: string
}

export function SmartJoinButton({
    children,
    className
}: SmartJoinButtonProps) {
    const { data: session } = useQuery({
        queryKey: ["auth", "session"],
        queryFn: () => authClient.getSession()
    })

    const isAuthenticated = !!session?.data?.user
    const href = isAuthenticated ? "/dashboard" : "/register"

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    )
}
