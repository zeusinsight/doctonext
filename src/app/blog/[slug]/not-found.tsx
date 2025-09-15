import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowLeft } from "lucide-react"

export default function BlogArticleNotFound() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/blog">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retour au blog
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="mb-6 h-16 w-16 text-muted-foreground" />
                        <h1 className="mb-4 font-bold text-2xl">
                            Article non trouvé
                        </h1>
                        <p className="mb-6 max-w-md text-center text-muted-foreground">
                            L'article que vous recherchez n'existe pas ou n'est
                            plus disponible. Il a peut-être été supprimé ou
                            déplacé.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/blog">
                                <Button>Parcourir le blog</Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline">
                                    Retour à l'accueil
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
