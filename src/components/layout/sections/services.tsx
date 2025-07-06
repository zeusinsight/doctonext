import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

enum ServiceStatus {
    SOON = 1,
    READY = 0
}
interface ServiceProps {
    title: string
    pro: ServiceStatus
    description: string
}
const serviceList: ServiceProps[] = [
    {
        title: "Authentication System",
        description:
            "Complete auth system with email and social login support. Includes session management and user roles.",
        pro: 0
    },
    {
        title: "Dashboard & UI Kit",
        description:
            "Ready-to-use dashboard layout and beautiful UI components. Dark mode included.",
        pro: 0
    },
    {
        title: "File Upload System",
        description: "Secure file uploads with UploadThing integration for user content and avatars.",
        pro: 0
    },
    {
        title: "Payment Integration",
        description: "Stripe/Polar.sh payment system for your SaaS subscriptions (coming soon).",
        pro: 1
    }
]

export const ServicesSection = () => {
    return (
        <section id="services" className="container mx-auto py-24 sm:py-32">
            <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                Core Features
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                Built-in Functionality
            </h2>
            <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2">
                Start with a solid foundation. Our starter includes essential features 
                that every modern SaaS needs, saving you weeks of development time.
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />

            <div className="mx-auto grid w-full gap-4 sm:grid-cols-2 lg:w-[60%] lg:grid-cols-2">
                {serviceList.map(({ title, description, pro }) => (
                    <Card
                        key={title}
                        className="relative h-full bg-muted/60 dark:bg-card"
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <Badge
                            data-soon={ServiceStatus.SOON === pro}
                            variant="secondary"
                            className="-top-2 -right-3 absolute data-[soon=false]:hidden"
                        >
                            SOON
                        </Badge>
                    </Card>
                ))}
            </div>
        </section>
    )
}
