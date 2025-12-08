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
        <div className="flex w-full flex-col items-center justify-center px-4 sm:px-6">
            <div className="flex flex-col items-center py-6 text-center">
                <h1 className="font-bold text-2xl text-white tracking-tight sm:text-3xl">
                    Créer une nouvelle annonce
                </h1>
                <p className="text-white text-sm sm:text-base">
                    Remplissez les informations pour publier votre annonce de
                    cession ou de remplacement
                </p>
            </div>

            <Card className="w-full max-w-5xl border-blue-200 py-6">
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
