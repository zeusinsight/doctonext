"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Clock, Mail, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { site } from "@/config/site"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    email: z.string().email(),
    subject: z.string().min(2).max(255),
    message: z.string()
})

export const ContactSection = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "Question générale",
            message: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { firstName, lastName, email, subject, message } = values
        console.log(values)

        const mailToLink = `mailto:${site.mailSupport}?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`

        window.location.href = mailToLink
    }

    return (
        <section id="contact" className="container mx-auto px-4 py-24 sm:py-32">
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <div className="mb-4">
                        <h2 className="mb-2 text-lg text-care-evo-accent tracking-wider font-semibold">
                            Contact
                        </h2>

                        <h2 className="font-bold text-3xl text-gray-900 md:text-4xl">
                            Contactez-nous
                        </h2>
                    </div>
                    <p className="mb-8 text-gray-600 text-lg lg:w-5/6">
                        Nous sommes là pour répondre à toutes vos questions concernant Care Evo.
                        N'hésitez pas à nous contacter pour toute demande d'information.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="mb-1 flex gap-2 items-center">
                                <Building2 className="text-care-evo-primary h-5 w-5" />
                                <div className="font-bold text-gray-900">Adresse</div>
                            </div>

                            <div className="text-gray-600">
                                XX
                            </div>
                        </div>

                        <div>
                            <div className="mb-1 flex gap-2 items-center">
                                <Phone className="text-care-evo-primary h-5 w-5" />
                                <div className="font-bold text-gray-900">Téléphone</div>
                            </div>

                            <div className="text-gray-600">+xx xx xx xx xx</div>
                        </div>

                        <div>
                            <div className="mb-1 flex gap-2 items-center">
                                <Mail className="text-care-evo-primary h-5 w-5" />
                                <div className="font-bold text-gray-900">Email</div>
                            </div>

                            <div className="text-gray-600">{site.mailSupport}</div>
                        </div>

                        <div>
                            <div className="mb-1 flex gap-2 items-center">
                                <Clock className="text-care-evo-primary h-5 w-5" />
                                <div className="font-bold text-gray-900">Horaires</div>
                            </div>

                            <div className="text-gray-600">
                                <div>Lundi - Vendredi</div>
                                <div>8h00 - 16h00</div>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="border-t-4 border-t-care-evo-accent bg-white shadow-md">
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid w-full gap-4"
                            >
                                <div className="md:!flex-row flex flex-col gap-8">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Prénom
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Jean"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Dupont"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="vous@exemple.fr"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sujet</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sélectionnez un sujet" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Question générale">
                                                            Question générale
                                                        </SelectItem>
                                                        <SelectItem value="Cession de cabinet">
                                                            Cession de cabinet
                                                        </SelectItem>
                                                        <SelectItem value="Remplacement">
                                                            Remplacement
                                                        </SelectItem>
                                                        <SelectItem value="Collaboration">
                                                            Collaboration
                                                        </SelectItem>
                                                        <SelectItem value="Support technique">
                                                            Support technique
                                                        </SelectItem>
                                                        <SelectItem value="Autre">
                                                            Autre
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={5}
                                                        placeholder="Votre message..."
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    className="mt-4 w-fit hover:opacity-90"
                                    style={{ backgroundColor: "#206dc5" }}
                                >
                                    Envoyer le message
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter />
                </Card>
            </section>
        </section>
    )
}
