import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { savedSearches } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const savedSearchId = searchParams.get("id")

        if (!savedSearchId) {
            return new NextResponse(
                `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Erreur - Care Evo</title>
                    <style>
                        body { 
                            font-family: system-ui, -apple-system, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #f9fafb;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background: white;
                            border-radius: 0.5rem;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            max-width: 400px;
                        }
                        h1 { color: #ef4444; margin-bottom: 1rem; }
                        p { color: #6b7280; margin-bottom: 1.5rem; }
                        a {
                            display: inline-block;
                            background: #3b82f6;
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 0.375rem;
                            text-decoration: none;
                        }
                        a:hover { background: #2563eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Erreur</h1>
                        <p>Lien de désabonnement invalide.</p>
                        <a href="/dashboard/saved-searches">Gérer mes recherches</a>
                    </div>
                </body>
                </html>
                `,
                {
                    status: 400,
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                }
            )
        }

        // Disable email alerts for this saved search
        const [updatedSearch] = await db
            .update(savedSearches)
            .set({
                emailAlertsEnabled: false,
                updatedAt: new Date()
            })
            .where(eq(savedSearches.id, savedSearchId))
            .returning()

        if (!updatedSearch) {
            return new NextResponse(
                `
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Recherche non trouvée - Care Evo</title>
                    <style>
                        body { 
                            font-family: system-ui, -apple-system, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #f9fafb;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background: white;
                            border-radius: 0.5rem;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            max-width: 400px;
                        }
                        h1 { color: #f59e0b; margin-bottom: 1rem; }
                        p { color: #6b7280; margin-bottom: 1.5rem; }
                        a {
                            display: inline-block;
                            background: #3b82f6;
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 0.375rem;
                            text-decoration: none;
                        }
                        a:hover { background: #2563eb; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Recherche non trouvée</h1>
                        <p>Cette recherche sauvegardée n'existe plus.</p>
                        <a href="/">Retour à l'accueil</a>
                    </div>
                </body>
                </html>
                `,
                {
                    status: 404,
                    headers: { "Content-Type": "text/html; charset=utf-8" }
                }
            )
        }

        return new NextResponse(
            `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Désabonnement réussi - Care Evo</title>
                <style>
                    body { 
                        font-family: system-ui, -apple-system, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f9fafb;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 0.5rem;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        max-width: 400px;
                    }
                    .icon {
                        width: 48px;
                        height: 48px;
                        margin: 0 auto 1rem;
                        background: #10b981;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .icon svg {
                        width: 24px;
                        height: 24px;
                        stroke: white;
                        stroke-width: 3;
                    }
                    h1 { color: #111827; margin-bottom: 1rem; }
                    p { color: #6b7280; margin-bottom: 1.5rem; }
                    .buttons {
                        display: flex;
                        gap: 1rem;
                        justify-content: center;
                    }
                    a {
                        display: inline-block;
                        padding: 0.5rem 1rem;
                        border-radius: 0.375rem;
                        text-decoration: none;
                    }
                    .primary {
                        background: #3b82f6;
                        color: white;
                    }
                    .primary:hover { background: #2563eb; }
                    .secondary {
                        background: white;
                        color: #6b7280;
                        border: 1px solid #e5e7eb;
                    }
                    .secondary:hover { background: #f9fafb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">
                        <svg fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1>Désabonnement réussi</h1>
                    <p>Vous ne recevrez plus d'alertes email pour la recherche "${updatedSearch.name}".</p>
                    <p style="font-size: 0.875rem;">Vous pouvez réactiver les alertes à tout moment depuis votre tableau de bord.</p>
                    <div class="buttons">
                        <a href="/dashboard/saved-searches" class="primary">Gérer mes recherches</a>
                        <a href="/" class="secondary">Accueil</a>
                    </div>
                </div>
            </body>
            </html>
            `,
            {
                status: 200,
                headers: { "Content-Type": "text/html; charset=utf-8" }
            }
        )
    } catch (error) {
        console.error("Error unsubscribing from alerts:", error)
        return new NextResponse(
            `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erreur - Care Evo</title>
                <style>
                    body { 
                        font-family: system-ui, -apple-system, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f9fafb;
                    }
                    .container {
                        text-align: center;
                        padding: 2rem;
                        background: white;
                        border-radius: 0.5rem;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        max-width: 400px;
                    }
                    h1 { color: #ef4444; margin-bottom: 1rem; }
                    p { color: #6b7280; margin-bottom: 1.5rem; }
                    a {
                        display: inline-block;
                        background: #3b82f6;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 0.375rem;
                        text-decoration: none;
                    }
                    a:hover { background: #2563eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Erreur</h1>
                    <p>Une erreur est survenue lors du désabonnement.</p>
                    <a href="/dashboard/saved-searches">Gérer mes recherches</a>
                </div>
            </body>
            </html>
            `,
            {
                status: 500,
                headers: { "Content-Type": "text/html; charset=utf-8" }
            }
        )
    }
}
