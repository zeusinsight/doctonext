import { requireAdmin } from "@/lib/auth-utils"
import { CreateListingForm } from "@/components/listings/create-listing-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default async function AdminNewListingPage() {
    await requireAdmin()

    return (
        <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-5xl">
                <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/admin/annonces" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retour aux annonces
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col items-center py-6 text-center">
                    <div className="mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-amber-500" />
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 text-sm font-medium">
                            Mode Administrateur
                        </span>
                    </div>
                    <h1 className="font-bold text-2xl text-white tracking-tight sm:text-3xl">
                        Créer une annonce pour un utilisateur
                    </h1>
                    <p className="text-white text-sm sm:text-base">
                        L'annonce sera assignée à l'email spécifié et visible par l'utilisateur dès son inscription
                    </p>
                </div>

                <Card className="w-full border-blue-200 py-6">
                    <CardHeader className="py-6">
                        <CardTitle>Nouvelle annonce (Admin)</CardTitle>
                        <CardDescription>
                            Créez une annonce et assignez-la à un utilisateur par son email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateListingForm isAdminMode={true} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
