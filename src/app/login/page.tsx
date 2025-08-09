import { AuthLoading } from "@daveyplate/better-auth-ui"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WelcomeToast } from "@/components/layout/auth-loading-toast"
import { Button } from "@/components/ui/button"
import { LoginFormWrapper } from "@/components/auth/login-form-wrapper"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Connexion"
}

export default function LoginPage() {
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

                <Suspense fallback={null}>
                    <LoginFormWrapper />
                </Suspense>
            </div>
        </main>
    )
}