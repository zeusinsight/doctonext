export const MissionBanner = () => {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center text-white">
                    <h2 className="mb-3 flex items-center justify-center gap-2 font-bold text-2xl md:text-3xl">
                        <span className="text-3xl">🎯</span>
                        <span>Notre mission : devenir la plateforme n°1 des annonces médicales en France</span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-blue-100 text-lg md:text-xl">
                        Offrir à chaque professionnel de santé les meilleures opportunités, simplement et gratuitement.
                    </p>
                </div>
            </div>
        </section>
    )
}
