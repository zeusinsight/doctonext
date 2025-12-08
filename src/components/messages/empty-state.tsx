"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageCircle, Inbox, Search, Send } from "lucide-react"
import Link from "next/link"

type EmptyStateVariant = "no-conversations" | "no-messages" | "no-selection" | "no-results"

interface EmptyStateProps {
    variant: EmptyStateVariant
    className?: string
    onAction?: () => void
}

const variants = {
    "no-conversations": {
        icon: Inbox,
        title: "Aucune conversation",
        description: "Parcourez les annonces et contactez des professionnels pour démarrer une conversation.",
        actionLabel: "Parcourir les annonces",
        actionHref: "/annonces"
    },
    "no-messages": {
        icon: Send,
        title: "Démarrez la conversation",
        description: "Envoyez votre premier message pour entrer en contact.",
        actionLabel: null,
        actionHref: null
    },
    "no-selection": {
        icon: MessageCircle,
        title: "Sélectionnez une conversation",
        description: "Choisissez une conversation dans la liste pour afficher les messages.",
        actionLabel: null,
        actionHref: null
    },
    "no-results": {
        icon: Search,
        title: "Aucun résultat",
        description: "Aucune conversation ne correspond à votre recherche.",
        actionLabel: "Effacer la recherche",
        actionHref: null
    }
}

export function EmptyState({
    variant,
    className,
    onAction
}: EmptyStateProps) {
    const config = variants[variant]
    const Icon = config.icon

    return (
        <div
            className={cn(
                "flex flex-1 flex-col items-center justify-center p-8 text-center",
                className
            )}
            role="status"
            aria-label={config.title}
        >
            {/* Icon with decorative background */}
            <div className="relative mb-6">
                {/* Decorative rings */}
                <div className="absolute inset-0 animate-pulse">
                    <div className="absolute -inset-4 rounded-full bg-blue-100/50" />
                    <div className="absolute -inset-8 rounded-full bg-blue-50/30" />
                </div>

                {/* Main icon container */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 shadow-inner">
                    <Icon
                        className="h-10 w-10 text-blue-400"
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            {/* Text content */}
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {config.title}
            </h3>
            <p className="mb-6 max-w-xs text-sm text-gray-500 leading-relaxed">
                {config.description}
            </p>

            {/* Action button */}
            {config.actionLabel && (
                config.actionHref ? (
                    <Button asChild className="shadow-lg shadow-blue-500/20">
                        <Link href={config.actionHref}>
                            {config.actionLabel}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={onAction}
                        variant="outline"
                        className="shadow-sm"
                    >
                        {config.actionLabel}
                    </Button>
                )
            )}
        </div>
    )
}
