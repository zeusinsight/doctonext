"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface ProfessionalRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialty: string;
  rppsAdeli?: string;
  isProfessional: boolean;
}

const MEDICAL_SPECIALTIES = [
  "Médecin généraliste",
  "Cardiologue",
  "Dermatologue",
  "Gynécologue",
  "Neurologue",
  "Ophtalmologue",
  "Orthopédiste",
  "Pédiatre",
  "Psychiatre",
  "Radiologue",
  "Chirurgien",
  "Anesthésiste",
  "Endocrinologue",
  "Gastro-entérologue",
  "Pneumologue",
  "Rhumatologue",
  "Urologue",
  "ORL",
  "Dentiste",
  "Pharmacien",
  "Kinésithérapeute",
  "Infirmier(ère)",
  "Sage-femme",
  "Ostéopathe",
  "Podologue",
  "Orthophoniste",
  "Psychologue",
  "Diététicien(ne)",
  "Autre",
];

export function ProfessionalRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProfessionalRegisterData>({
    defaultValues: {
      isProfessional: false,
    },
  });

  const password = watch("password");
  const specialty = watch("specialty");
  const isProfessional = watch("isProfessional");

  const onSubmit = async (data: ProfessionalRegisterData) => {
    if (!data.specialty) {
      setError("specialty", {
        message: "La spécialité médicale est requise",
      });
      toast.error("Veuillez sélectionner votre spécialité médicale");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!data.isProfessional) {
      toast.error("Vous devez certifier être un professionnel de santé");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
        },
      );

      console.log("SignUp result:", result);
      console.log("SignUp result stringified:", JSON.stringify(result));

      // Check if the result indicates an error
      if (result?.error) {
        console.log("Found error in result:", result.error);
        if (
          result.error.code === "USER_ALREADY_EXISTS" ||
          result.error.message?.includes("User already exists") ||
          JSON.stringify(result.error).includes("USER_ALREADY_EXISTS")
        ) {
          toast.error("Un compte existe déjà avec cette adresse email");
        } else {
          toast.error("Une erreur est survenue lors de la création du compte");
        }
        return;
      }

      // Check if result itself has error codes
      if ((result as any)?.code === "USER_ALREADY_EXISTS") {
        toast.error("Un compte existe déjà avec cette adresse email");
        return;
      }

      // Check for data property with error
      if ((result as any)?.data?.error) {
        const errorData = (result as any).data.error;
        if (
          errorData.code === "USER_ALREADY_EXISTS" ||
          errorData.message?.includes("User already exists")
        ) {
          toast.error("Un compte existe déjà avec cette adresse email");
        } else {
          toast.error("Une erreur est survenue lors de la création du compte");
        }
        return;
      }

      toast.success("Compte créé avec succès ! Vérifiez votre email.");
    } catch (error: any) {
      console.error("Registration error:", error);
      console.log("Error code:", error?.code);
      console.log("Error message:", error?.message);
      console.log("Full error:", JSON.stringify(error));

      // Handle different error types - check for the specific error structure
      if (
        error?.code === "USER_ALREADY_EXISTS" ||
        error?.message === "User already exists" ||
        error?.message?.includes("USER_ALREADY_EXISTS") ||
        JSON.stringify(error).includes("USER_ALREADY_EXISTS")
      ) {
        toast.error("Un compte existe déjà avec cette adresse email");
      } else if (error?.code === "INVALID_EMAIL") {
        toast.error("Format d'email invalide");
      } else if (error?.code === "WEAK_PASSWORD") {
        toast.error("Le mot de passe est trop faible");
      } else {
        toast.error("Une erreur est survenue lors de la création du compte");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #206dc5, #1a5ba3)",
      }}
    >
      {/* Background decorations */}
      <div
        className="-z-10 absolute top-0 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl filter"
        style={{ backgroundColor: "#4a8dd9" }}
      />
      <div
        className="-z-10 absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-30 blur-3xl filter"
        style={{ backgroundColor: "#14b8a6" }}
      />

      <div className="container mx-auto flex min-h-screen grow flex-col items-center justify-center gap-4 self-center py-8 sm:py-12">
        <Link href="/" className="absolute top-6 left-8">
          <Button
            variant="outline"
            className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>

        <Card className="w-full max-w-4xl bg-white/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle
              className="font-bold text-2xl"
              style={{ color: "#206dc5" }}
            >
              Inscription Professionnelle
            </CardTitle>
            <CardDescription className="text-gray-600">
              Créez votre compte professionnel de santé
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column - Professional Identity */}
                <div className="space-y-4">
                  <h3 className="border-b pb-2 font-medium text-gray-700">
                    Identité professionnelle
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium text-gray-700">
                      Nom complet *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. Jean Dupont"
                      className="border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      {...register("name", {
                        required: "Le nom est requis",
                      })}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="specialty"
                      className="font-medium text-gray-700"
                    >
                      Spécialité médicale *
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("specialty", value, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEDICAL_SPECIALTIES.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialty && (
                      <p className="text-red-600 text-sm">
                        {errors.specialty.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="rppsAdeli"
                      className="font-medium text-gray-700"
                    >
                      N° RPPS ou ADELI{" "}
                      <span className="text-gray-500">(facultatif)</span>
                    </Label>
                    <Input
                      id="rppsAdeli"
                      type="text"
                      placeholder="123456789"
                      className="border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      {...register("rppsAdeli")}
                    />
                  </div>

                  {/* Certification */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="isProfessional"
                        checked={isProfessional}
                        onCheckedChange={(checked) =>
                          setValue("isProfessional", !!checked)
                        }
                        className="mt-1"
                      />
                      <Label
                        htmlFor="isProfessional"
                        className="font-medium text-gray-700 text-sm leading-5"
                      >
                        Je certifie être un professionnel de santé *
                      </Label>
                    </div>
                    {errors.isProfessional && (
                      <p className="text-red-600 text-sm">
                        Vous devez certifier être un professionnel de santé
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Login Credentials */}
                <div className="space-y-4">
                  <h3 className="border-b pb-2 font-medium text-gray-700">
                    Informations de connexion
                  </h3>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="font-medium text-gray-700"
                    >
                      Adresse email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@exemple.fr"
                      className="border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      {...register("email", {
                        required: "L'email est requis",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Format d'email invalide",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="font-medium text-gray-700"
                    >
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe"
                        className="border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
                        {...register("password", {
                          required: "Le mot de passe est requis",
                          minLength: {
                            value: 8,
                            message:
                              "Le mot de passe doit contenir au moins 8 caractères",
                          },
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="font-medium text-gray-700"
                    >
                      Confirmer le mot de passe *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmer le mot de passe"
                        className="border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
                        {...register("confirmPassword", {
                          required: "La confirmation est requise",
                          validate: (value) =>
                            value === password ||
                            "Les mots de passe ne correspondent pas",
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 text-gray-500 text-xs">
                    <p>Le mot de passe doit contenir au moins 8 caractères</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-medium text-white shadow-lg transition-all hover:shadow-xl"
                  style={{ backgroundColor: "#206dc5" }}
                >
                  {isLoading
                    ? "Création en cours..."
                    : "Créer mon compte professionnel"}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Déjà inscrit ?{" "}
                <Link
                  href="/login"
                  className="font-medium underline"
                  style={{ color: "#206dc5" }}
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 max-w-md text-center text-sm text-white/90">
          <p>
            En continuant, vous acceptez nos{" "}
            <Link
              href="/terms"
              className="text-white underline hover:text-white/80"
            >
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              href="/privacy"
              className="text-white underline hover:text-white/80"
            >
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
