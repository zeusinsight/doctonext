"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { 
    RiLoader4Line, 
    RiGoogleLine,
    RiGithubLine,
    RiLinkedinLine,
    RiTwitterLine,
    RiFacebookLine,
    RiDiscordLine,
    RiCheckLine,
    RiTimeLine
} from "@remixicon/react"
import { Link, Unlink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Account {
    id: string
    providerId: string
    providerAccountId: string
    type: string
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    createdAt: Date
    updatedAt: Date
}

interface Provider {
    id: string
    name: string
    icon: React.ReactNode
    color: string
    description: string
}

interface ProvidersCardProps {
    className?: string
}

const AVAILABLE_PROVIDERS: Provider[] = [
    {
        id: "google",
        name: "Google",
        icon: <RiGoogleLine className="w-5 h-5" />,
        color: "text-red-600",
        description: "Connectez votre compte Google"
    },
    {
        id: "github",
        name: "GitHub",
        icon: <RiGithubLine className="w-5 h-5" />,
        color: "text-gray-900",
        description: "Connectez votre compte GitHub"
    },
    {
        id: "discord",
        name: "Discord",
        icon: <RiDiscordLine className="w-5 h-5" />,
        color: "text-indigo-600",
        description: "Connectez votre compte Discord"
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: <RiFacebookLine className="w-5 h-5" />,
        color: "text-blue-600",
        description: "Connectez votre compte Facebook"
    },
    {
        id: "twitter",
        name: "Twitter",
        icon: <RiTwitterLine className="w-5 h-5" />,
        color: "text-sky-500",
        description: "Connectez votre compte Twitter"
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: <RiLinkedinLine className="w-5 h-5" />,
        color: "text-blue-700",
        description: "Connectez votre compte LinkedIn"
    }
]

export function ProvidersCard({ className }: ProvidersCardProps) {
    const { data: session } = authClient.useSession()
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [linkingProvider, setLinkingProvider] = useState<string | null>(null)
    const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null)

    const loadAccounts = async () => {
        try {
            // Note: Better Auth might not have a direct listAccounts method
            // This would typically be implemented with a custom API endpoint
            // For now, we'll simulate based on user data
            const userAccounts: Account[] = []
            
            // Add mock accounts based on what we might expect
            // In a real implementation, you'd fetch this from your API
            setAccounts(userAccounts)
        } catch (error) {
            console.error("Error loading accounts:", error)
            toast.error("Erreur lors du chargement des comptes liés")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadAccounts()
    }, [])

    const linkProvider = async (providerId: string) => {
        setLinkingProvider(providerId)
        
        try {
            await authClient.linkSocial({
                provider: providerId,
                callbackURL: `/dashboard/settings?linked=${providerId}`
            })
            
            // The redirect will handle the success flow
            // toast.success(`Compte ${getProviderName(providerId)} lié avec succès`)
        } catch (error: any) {
            console.error("Error linking provider:", error)
            
            if (error.message?.includes("already linked")) {
                toast.error("Ce compte est déjà lié")
            } else if (error.message?.includes("email exists")) {
                toast.error("Cette adresse email est déjà utilisée par un autre compte")
            } else {
                toast.error(`Erreur lors de la liaison avec ${getProviderName(providerId)}`)
            }
        } finally {
            setLinkingProvider(null)
        }
    }

    const unlinkProvider = async (providerId: string) => {
        setUnlinkingProvider(providerId)
        
        try {
            await authClient.unlinkAccount({
                providerId: providerId
            })
            
            // Update local state
            setAccounts(prev => prev.filter(account => account.providerId !== providerId))
            toast.success(`Compte ${getProviderName(providerId)} dissocié avec succès`)
        } catch (error: any) {
            console.error("Error unlinking provider:", error)
            
            if (error.message?.includes("last provider")) {
                toast.error("Vous ne pouvez pas dissocier le dernier moyen de connexion")
            } else {
                toast.error(`Erreur lors de la dissociation de ${getProviderName(providerId)}`)
            }
        } finally {
            setUnlinkingProvider(null)
        }
    }

    const getProviderName = (providerId: string) => {
        return AVAILABLE_PROVIDERS.find(p => p.id === providerId)?.name || providerId
    }

    const getProvider = (providerId: string) => {
        return AVAILABLE_PROVIDERS.find(p => p.id === providerId)
    }

    const isProviderLinked = (providerId: string) => {
        return accounts.some(account => account.providerId === providerId)
    }

    const getLinkedAccount = (providerId: string) => {
        return accounts.find(account => account.providerId === providerId)
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const linkedProviders = AVAILABLE_PROVIDERS.filter(provider => 
        isProviderLinked(provider.id)
    )
    const availableProviders = AVAILABLE_PROVIDERS.filter(provider => 
        !isProviderLinked(provider.id)
    )

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Comptes liés</CardTitle>
                <CardDescription>
                    Gérez les fournisseurs d'authentification connectés à votre compte
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                        <div className="h-3 bg-gray-200 rounded w-40" />
                                    </div>
                                    <div className="w-20 h-8 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Linked Providers */}
                        {linkedProviders.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-gray-900">
                                        Comptes connectés ({linkedProviders.length})
                                    </h4>
                                </div>
                                
                                <div className="space-y-3">
                                    {linkedProviders.map((provider) => {
                                        const account = getLinkedAccount(provider.id)
                                        return (
                                            <div 
                                                key={provider.id}
                                                className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("flex-shrink-0", provider.color)}>
                                                        {provider.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-sm">
                                                                {provider.name}
                                                            </span>
                                                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                                                                <RiCheckLine className="w-3 h-3 mr-1" />
                                                                Connecté
                                                            </Badge>
                                                        </div>
                                                        {account && (
                                                            <div className="text-xs text-gray-600 space-y-1">
                                                                <div className="flex items-center gap-1">
                                                                    <RiTimeLine className="w-3 h-3" />
                                                                    Connecté le {formatDate(account.createdAt)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => unlinkProvider(provider.id)}
                                                    disabled={unlinkingProvider === provider.id}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    {unlinkingProvider === provider.id ? (
                                                        <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Unlink className="w-4 h-4 mr-2" />
                                                    )}
                                                    Dissocier
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Available Providers */}
                        {availableProviders.length > 0 && (
                            <>
                                {linkedProviders.length > 0 && <Separator />}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-gray-900">
                                            Comptes disponibles
                                        </h4>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {availableProviders.map((provider) => (
                                            <div 
                                                key={provider.id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("flex-shrink-0", provider.color)}>
                                                        {provider.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm mb-1">
                                                            {provider.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {provider.description}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => linkProvider(provider.id)}
                                                    disabled={linkingProvider === provider.id}
                                                >
                                                    {linkingProvider === provider.id ? (
                                                        <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Link className="w-4 h-4 mr-2" />
                                                    )}
                                                    Connecter
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {linkedProviders.length === 0 && availableProviders.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-6">
                                Aucun fournisseur d'authentification disponible
                            </p>
                        )}
                    </div>
                )}
                
                <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Conseil :</strong> Connecter plusieurs comptes vous permet de vous connecter 
                        avec n'importe lequel de ces fournisseurs tout en conservant le même profil utilisateur.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}