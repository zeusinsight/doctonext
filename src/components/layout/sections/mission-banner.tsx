"use client";

export const MissionBanner = () => {
  return (
    <section
      className="relative overflow-hidden py-12"
      style={{ background: "linear-gradient(to right, #206dc5, #1a5ba3)" }}
    >
      {/* Decorative elements on the left */}
      <div className="absolute inset-y-0 left-0 hidden w-64 lg:block">
        <div className="relative h-full">
          {/* Floating circles */}
          <div className="absolute top-1/4 left-8 h-16 w-16 animate-pulse rounded-full bg-white/10 backdrop-blur-sm" />
          <div
            className="absolute top-1/2 left-16 h-12 w-12 animate-pulse rounded-full bg-white/15 backdrop-blur-sm"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-1/4 left-4 h-20 w-20 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"
            style={{ animationDelay: "1s" }}
          />
          {/* Medical icons */}
          <div className="absolute top-1/3 left-12 text-4xl opacity-30">
            <span>⚕️</span>
          </div>
          <div className="absolute bottom-1/3 left-8 text-3xl opacity-20">
            <span>🏥</span>
          </div>
        </div>
      </div>

      {/* Decorative elements on the right */}
      <div className="absolute inset-y-0 right-0 hidden w-64 lg:block">
        <div className="relative h-full">
          {/* Floating circles */}
          <div
            className="absolute top-1/3 right-12 h-14 w-14 animate-pulse rounded-full bg-white/10 backdrop-blur-sm"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-1/2 right-20 h-10 w-10 animate-pulse rounded-full bg-white/15 backdrop-blur-sm"
            style={{ animationDelay: "0.8s" }}
          />
          <div
            className="absolute bottom-1/4 right-8 h-16 w-16 animate-pulse rounded-full bg-white/5 backdrop-blur-sm"
            style={{ animationDelay: "1.2s" }}
          />
          {/* Medical icons */}
          <div className="absolute top-1/4 right-16 text-4xl opacity-30">
            <span>💼</span>
          </div>
          <div className="absolute bottom-1/3 right-12 text-3xl opacity-20">
            <span>📍</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center text-white">
          <h2 className="mb-3 flex items-center justify-center gap-2 font-bold text-2xl md:text-3xl">
            <span className="text-3xl">🎯</span>
            <span>
              Notre mission : devenir la plateforme n°1 des annonces médicales
              en France
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-blue-100 text-lg md:text-xl">
            Offrir à chaque professionnel de santé les meilleures opportunités,
            simplement et gratuitement.
          </p>
        </div>
      </div>
    </section>
  );
};
