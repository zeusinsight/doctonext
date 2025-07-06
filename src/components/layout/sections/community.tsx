import { Github, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

export const CommunitySection = () => {
    return (
        <section id="community" className="container mx-auto py-12 ">
            <hr className="border-secondary" />
            <div className="container py-20 sm:py-20">
                <div className="mx-auto lg:w-[60%]">
                    <Card className="flex flex-col items-center justify-center border-none bg-background text-center shadow-none">
                        <CardHeader>
                            <CardTitle className="flex flex-col items-center font-bold text-4xl md:text-5xl">
                                <Github className="mb-4 h-16 w-16" />
                                <div>
                                    Contribute to this
                                    <span className="bg-gradient-to-r from-[#da5319] to-primary bg-clip-text pl-2 text-transparent">
                                        Project
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground text-xl lg:w-[80%]">
                            Join our open-source community on GitHub! Star the repo, report issues, 
                            contribute code, and help make this starter even better.
                        </CardContent>

                        <CardFooter>
                            <Button asChild variant="outline">
                                <a
                                    href="https://github.com/indieceo/Indiesaas"
                                    target="_blank"
                                    rel="noopener"
                                    className="flex items-center gap-2"
                                >
                                    <Star className="h-5 w-5" />
                                    Star on GitHub
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <hr className="border-secondary" />
        </section>
    )
}
