"use client"

import { CreateListingForm } from "@/components/listings/create-listing-form"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

export default function NewListingPage() {
    return (
        <div className="flex min-w-5xl flex-col items-center justify-center ">
            <div className="flex flex-col items-center py-6">
                <h1 className="font-bold text-3xl text-white tracking-tight">
                    Créer une nouvelle annonce
                </h1>
                <p className="text-white">
                    Remplissez les informations pour publier votre annonce de
                    cession ou de remplacement
                </p>
            </div>

            <Card className="max-w-5xl border-blue-200 py-6">
                <CardHeader className="py-6">
                    <CardTitle>Nouvelle annonce</CardTitle>
                    <CardDescription>
                        Suivez les étapes pour créer votre annonce
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateListingForm />
                </CardContent>
            </Card>
        </div>
    )
}
