"use client"

import { AuthCard } from "@daveyplate/better-auth-ui"

export function LoginFormWrapper() {
    return (
        <AuthCard
            pathname="sign-in"
            redirectTo="/dashboard"
            classNames={{
                base: "bg-white/95 backdrop-blur-md shadow-2xl",
                header: "text-blue-700",
                content: "text-gray-700",
                footer: "text-gray-600",
                footerLink: "text-blue-600 hover:text-blue-700",
                form: {
                    base: "space-y-2",
                    input: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                    label: "text-gray-700 font-medium",
                    button: "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all",
                    error: "text-red-600"
                }
            }}
            localization={{
                SIGN_IN: "Connexion",
                SIGN_IN_ACTION: "Se connecter",
                SIGN_IN_DESCRIPTION:
                    "Entrez votre email pour vous connecter à votre compte",
                SIGN_UP: "Inscription",
                SIGN_UP_ACTION: "Créer un compte",
                SIGN_UP_DESCRIPTION:
                    "Entrez vos informations pour créer un compte",
                EMAIL: "Email",
                EMAIL_PLACEHOLDER: "nom@exemple.fr",
                EMAIL_REQUIRED: "L'adresse email est requise",
                PASSWORD: "Mot de passe",
                PASSWORD_PLACEHOLDER: "Mot de passe",
                PASSWORD_REQUIRED: "Le mot de passe est requis",
                CONFIRM_PASSWORD: "Confirmer le mot de passe",
                CONFIRM_PASSWORD_PLACEHOLDER: "Confirmer le mot de passe",
                CONFIRM_PASSWORD_REQUIRED:
                    "La confirmation du mot de passe est requise",
                PASSWORDS_DO_NOT_MATCH:
                    "Les mots de passe ne correspondent pas",
                NAME: "Nom",
                NAME_PLACEHOLDER: "Jean Dupont",
                FORGOT_PASSWORD: "Mot de passe oublié",
                FORGOT_PASSWORD_LINK: "Mot de passe oublié ?",
                FORGOT_PASSWORD_ACTION: "Envoyer le lien de réinitialisation",
                FORGOT_PASSWORD_DESCRIPTION:
                    "Entrez votre email pour réinitialiser votre mot de passe",
                RESET_PASSWORD: "Réinitialiser le mot de passe",
                RESET_PASSWORD_ACTION: "Enregistrer le nouveau mot de passe",
                RESET_PASSWORD_DESCRIPTION:
                    "Entrez votre nouveau mot de passe ci-dessous",
                RESET_PASSWORD_SUCCESS: "Mot de passe réinitialisé avec succès",
                NEW_PASSWORD: "Nouveau mot de passe",
                NEW_PASSWORD_PLACEHOLDER: "Nouveau mot de passe",
                ALREADY_HAVE_AN_ACCOUNT: "Déjà un compte ?",
                DONT_HAVE_AN_ACCOUNT: "Pas encore de compte ?",
                INVALID_USERNAME_OR_PASSWORD: "Email ou mot de passe incorrect",
                USER_ALREADY_EXISTS:
                    "Un utilisateur avec cette adresse email existe déjà",
                UNEXPECTED_ERROR: "Une erreur inattendue s'est produite"
            }}
        />
    )
}
