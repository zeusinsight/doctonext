import { ProfessionalRegisterForm } from "@/components/auth/professional-register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Inscription Professionnelle - Créer un compte"
}

export default function RegisterPage() {
    return <ProfessionalRegisterForm />
}
