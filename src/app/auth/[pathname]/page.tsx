import { AuthCard, AuthLoading } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WelcomeToast } from "@/components/layout/auth-loading-toast"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Authentication"
}

export function generateStaticParams() {
    return Object.values(authViewPaths).map((pathname) => ({ pathname }))
}

export default async function AuthPage({
    params
}: {
    params: Promise<{ pathname: string }>
}) {
    const { pathname } = await params

   

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden">
            {/* Background decorations similar to hero section */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-30 -z-10" />
            
            <div className="container mx-auto flex grow flex-col items-center justify-center gap-4 self-center py-18 sm:py-22 min-h-screen">
                <Link href="/" className="absolute top-6 left-8">
                    <Button
                        variant="outline"
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                        size="sm"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Button>
                </Link>

                <AuthLoading>
                    <WelcomeToast />
                </AuthLoading>

                <AuthCard
                    pathname={pathname}
                    classNames={{
                        base: "bg-white/95 backdrop-blur-md shadow-2xl",
                        header: "text-blue-700",
                        content: "text-gray-700",
                        footer: "text-gray-600",
                        footerLink: "text-blue-600 hover:text-blue-700",
                        form: {
                            base: "space-y-4",
                            input: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                            label: "text-gray-700 font-medium",
                            button: "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all",
                            error: "text-red-600"
                        }
                    }}
                    localization={{
                        SIGN_IN: "Connexion",
                        SIGN_IN_ACTION: "Se connecter",
                        SIGN_IN_DESCRIPTION: "Entrez votre email pour vous connecter à votre compte",
                        SIGN_UP: "Inscription",
                        SIGN_UP_ACTION: "Créer un compte",
                        SIGN_UP_DESCRIPTION: "Entrez vos informations pour créer un compte",
                        EMAIL: "Email",
                        EMAIL_PLACEHOLDER: "nom@exemple.fr",
                        EMAIL_REQUIRED: "L'adresse email est requise",
                        PASSWORD: "Mot de passe",
                        PASSWORD_PLACEHOLDER: "Mot de passe",
                        PASSWORD_REQUIRED: "Le mot de passe est requis",
                        CONFIRM_PASSWORD: "Confirmer le mot de passe",
                        CONFIRM_PASSWORD_PLACEHOLDER: "Confirmer le mot de passe",
                        CONFIRM_PASSWORD_REQUIRED: "La confirmation du mot de passe est requise",
                        PASSWORDS_DO_NOT_MATCH: "Les mots de passe ne correspondent pas",
                        NAME: "Nom",
                        NAME_PLACEHOLDER: "Jean Dupont",
                        FORGOT_PASSWORD: "Mot de passe oublié",
                        FORGOT_PASSWORD_LINK: "Mot de passe oublié ?",
                        FORGOT_PASSWORD_ACTION: "Envoyer le lien de réinitialisation",
                        FORGOT_PASSWORD_DESCRIPTION: "Entrez votre email pour réinitialiser votre mot de passe",
                        RESET_PASSWORD: "Réinitialiser le mot de passe",
                        RESET_PASSWORD_ACTION: "Enregistrer le nouveau mot de passe",
                        RESET_PASSWORD_DESCRIPTION: "Entrez votre nouveau mot de passe ci-dessous",
                        RESET_PASSWORD_SUCCESS: "Mot de passe réinitialisé avec succès",
                        NEW_PASSWORD: "Nouveau mot de passe",
                        NEW_PASSWORD_PLACEHOLDER: "Nouveau mot de passe",
                        ALREADY_HAVE_AN_ACCOUNT: "Déjà un compte ?",
                        DONT_HAVE_AN_ACCOUNT: "Pas encore de compte ?",
                        INVALID_USERNAME_OR_PASSWORD: "Email ou mot de passe incorrect",
                        USER_ALREADY_EXISTS: "Un utilisateur avec cette adresse email existe déjà",
                        UNEXPECTED_ERROR: "Une erreur inattendue s'est produite"
                    }}
                />

                {["sign-up"].includes(pathname) && (
                    <div className="text-center text-white/90 text-sm">
                        <p>
                            En continuant, vous acceptez nos{" "}
                            <Link
                                href="/terms"
                                className="underline text-white hover:text-white/80"
                            >
                                Conditions d'utilisation
                            </Link>{" "}
                            et notre{" "}
                            <Link
                                href="/privacy"
                                className="underline text-white hover:text-white/80"
                            >
                                Politique de confidentialité
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
