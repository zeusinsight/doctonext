"use client"
import { Search, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const HeroSection = () => {
    return (
        <section className="relative w-full bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden">
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            La première plateforme de mise en relation médicale professionnelle
                        </h1>
                        
                        <p className="text-lg md:text-xl text-white/90">
                            Simplifiez l'achat et la vente de patientèle et de fonds de commerce dans le domaine médical.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100 font-medium"
                            >
                                <Link href="/annonces" className="flex items-center gap-2">
                                    <Search className="size-5" />
                                    Trouver une annonce
                                </Link>
                            </Button>
                            
                            <Button
                                asChild
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white font-medium"
                            >
                                <Link href="/deposer-annonce" className="flex items-center gap-2">
                                    <Plus className="size-5" />
                                    Déposer une annonce
                                </Link>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Right Image */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/demo-img.png"
                                alt="Medical professional working on laptop"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-30 -z-10" />
        </section>
    )
}