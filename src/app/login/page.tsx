import { AuthLoading } from "@daveyplate/better-auth-ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { WelcomeToast } from "@/components/layout/auth-loading-toast";
import { Button } from "@/components/ui/button";
import { LoginFormWrapper } from "@/components/auth/login-form-wrapper";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #206dc5, #1a5ba3)",
      }}
    >
      {/* Background decorations similar to hero section */}
      <div
        className="-z-10 absolute top-0 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl filter"
        style={{ backgroundColor: "#4a8dd9" }}
      />
      <div
        className="-z-10 absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-30 blur-3xl filter"
        style={{ backgroundColor: "#14b8a6" }}
      />

      <div className="container mx-auto flex min-h-screen grow flex-col items-center justify-center gap-4 self-center py-18 sm:py-22">
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

        <AuthLoading>
          <WelcomeToast />
        </AuthLoading>

        <Suspense fallback={null}>
          <LoginFormWrapper />
        </Suspense>
      </div>
    </main>
  );
}
