"use client";

import { FileText, Search } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <section
      className="relative py-16 sm:py-24"
      style={{
        background: "linear-gradient(to bottom right, #206dc5, #1a5ba3)",
      }}
    >
      {/* Séparation visuelle en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            "linear-gradient(to right, transparent, #14b8a6, transparent)",
        }}
      ></div>

      <div className="container mx-auto px-4">
        <div className="rounded-2xl p-8 text-center md:p-16">
          <h2 className="mb-4 font-bold text-3xl md:text-5xl text-white">
            Prêt à faire le prochain pas?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-white text-lg">
            Rejoignez des milliers de professionnels de santé qui transforment
            leur carrière avec Care Evo.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/annonces">
              <button
                className="flex items-center gap-2 px-8 py-6 font-semibold text-lg transition-all duration-200 shadow-lg rounded-md"
                style={{ backgroundColor: "#ffffff", color: "#206dc5" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <Search className="h-5 w-5" />
                Explorer les annonces
              </button>
            </Link>

            <Link href="/dashboard/annonces/new">
              <button
                className="flex items-center gap-2 px-8 py-6 font-semibold text-lg text-white transition-all duration-200 shadow-lg rounded-md"
                style={{ backgroundColor: "#14b8a6" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2dd4bf")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#14b8a6")
                }
              >
                <FileText className="h-5 w-5" />
                Déposer une annonce
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
