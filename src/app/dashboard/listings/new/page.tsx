"use client"

import { CreateListingForm } from "@/components/listings/create-listing-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewListingPage() {
    return (
        <div className="flex flex-col justify-center items-center min-w-5xl ">
            <div className="flex flex-col items-center py-6">
                <h1 className="text-3xl font-bold tracking-tight">Créer une nouvelle annonce</h1>
                <p className="text-muted-foreground">
                    Remplissez les informations pour publier votre annonce de cession ou de remplacement
                </p>
            </div>

            <Card className="max-w-5xl">
                <CardHeader>
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