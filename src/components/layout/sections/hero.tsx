"use client"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
    const { theme } = useTheme()
    return (
        <section className="container mx-auto w-full">
            <div className="mx-auto grid place-items-center gap-8 py-20 md:py-32 lg:max-w-screen-xl">
                <div className="space-y-8 text-center">
                    <Badge
                        variant="outline"
                        className="rounded-2xl py-2 text-sm"
                    >
                        <span className="mr-2 text-primary">
                            <Badge>New</Badge>
                        </span>
                        <span> Template is out now! </span>
                    </Badge>

                    <div className="mx-auto max-w-screen-md text-center font-bold text-4xl md:text-6xl">
                        <h1>
                            Experience the
                            <span className="bg-gradient-to-r from-[#D14424] to-primary bg-clip-text px-2 text-transparent">
                                Indie Saas
                            </span>
                            Boilerplate
                        </h1>
                    </div>

                    <p className="mx-auto max-w-screen-sm text-muted-foreground text-xl">
                        {`A complete Next.js starter with authentication, beautiful UI components, 
            and everything you need to launch your SaaS product quickly and efficiently.`}
                    </p>

                    <div className="space-y-4 md:space-x-4 md:space-y-0">
                        <Button asChild className="group/arrow w-5/6 font-bold md:w-1/4">
                            <Link href="/auth/sign-up">
                                Get Started
                                <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="secondary"
                            className="w-5/6 font-bold md:w-1/4"
                        >
                            <Link
                                href="https://github.com/indieceo/Indiesaas"
                                target="_blank"
                            >
                                Github respository
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="group relative mt-14">
                    <div className="lg:-top-8 -translate-x-1/2 absolute top-2 left-1/2 mx-auto h-24 w-[90%] transform rounded-full bg-primary/50 blur-3xl lg:h-80" />
                    <Image
                        width={1200}
                        height={1200}
                        className="rouded-lg relative mx-auto flex w-full items-center rounded-lg border border-secondary border-t-2 border-t-primary/30 leading-none md:w-[1200px]"
                        src={
                            theme === "light"
                                ? "/demo-light.png"
                                : "/demo.png"
                        }
                        alt="dashboard"
                    />

                    <div className="absolute bottom-0 left-0 h-20 w-full rounded-lg bg-gradient-to-b from-background/0 via-background/50 to-background md:h-28" />
                </div>
            </div>
        </section>
    )
}
