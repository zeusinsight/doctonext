"use client"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"

interface ReviewProps {
    image: string
    name: string
    userName: string
    comment: string
    rating: number
}

const reviewList: ReviewProps[] = [
    {
        image: "https://github.com/shadcn.png",
        name: "John Doe",
        userName: "Product Manager",
        comment:
            "Wow this is awesome!. This Starter Kit lets me change colors, fonts and images to match my brand identity. ",
        rating: 5.0
    },
    {
        image: "https://github.com/shadcn.png",
        name: "Sophia Collins",
        userName: "Cybersecurity Analyst",
        comment:
            "The security implementation is top-notch. Built-in authentication and proper data validation give me confidence in the platform. ",
        rating: 4.8
    },

    {
        image: "https://github.com/shadcn.png",
        name: "Adam Johnson",
        userName: "Chief Technology Officer",
        comment:
            "Perfect architecture and clean code structure. Our development team was able to scale quickly without technical debt issues.",
        rating: 4.9
    },
    {
        image: "https://github.com/shadcn.png",
        name: "Ethan Parker",
        userName: "Data Scientist",
        comment:
            "The analytics integration capabilities are excellent. Easy to implement tracking and gather meaningful insights from user behavior.",
        rating: 5.0
    },
    {
        image: "https://github.com/shadcn.png",
        name: "Ava Mitchell",
        userName: "IT Project Manager",
        comment:
            "Streamlined our deployment process significantly. The documentation and setup guide helped our team deliver projects faster.",
        rating: 5.0
    },
    {
        image: "https://github.com/shadcn.png",
        name: "Isabella Reed",
        userName: "DevOps Engineer",
        comment:
            "Amazing CI/CD integration and containerization support. The deployment pipeline configurations saved us weeks of setup time.",
        rating: 4.9
    }
]

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="container mx-auto px-4 py-24 sm:py-32">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                    Testimonials
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                    Hear What Our 1000+ Clients Say
                </h2>
            </div>

            <Carousel
                opts={{
                    align: "start"
                }}
                className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
            >
                <CarouselContent>
                    {reviewList.map((review) => (
                        <CarouselItem
                            key={review.name}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="flex h-full flex-col bg-muted/50 dark:bg-card">
                                <CardContent className="flex flex-grow flex-col pt-6 pb-4">
                                    <div className="flex gap-1 pb-6">
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                    </div>
                                    <div className="flex flex-grow items-start">
                                        <p className="text-sm leading-relaxed">{`"${review.comment}"`}</p>
                                    </div>
                                </CardContent>

                                <CardHeader className="pt-4">
                                    <div className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src="https://avatars.githubusercontent.com/u/75042455?v=4"
                                                alt="radix"
                                            />
                                            <AvatarFallback>SV</AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col">
                                            <CardTitle className="text-lg">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.userName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    )
}
