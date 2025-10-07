/**
 * Mapping between URL slugs and database labels for medical specialties
 */

export const SPECIALTY_SLUG_TO_LABEL: Record<string, string> = {
  "medecine-generale": "Médecin généraliste",
  dentistes: "Dentiste",
  pharmacies: "Pharmacien",
  kinesitherapie: "Kinésithérapeute",
  orthophoniste: "Orthophoniste",
  infirmier: "Infirmier(ère)",
  "sage-femme": "Sage-femme",
  osteopathe: "Ostéopathe",
  cardiologie: "Cardiologue",
  dermatologie: "Dermatologue",
  gynecologie: "Gynécologue",
  neurologie: "Neurologue",
  ophtalmologie: "Ophtalmologue",
  orthopédie: "Orthopédiste",
  pédiatrie: "Pédiatre",
  psychiatrie: "Psychiatre",
  radiologie: "Radiologue",
  chirurgie: "Chirurgien",
  anesthésie: "Anesthésiste",
  endocrinologie: "Endocrinologue",
  "gastro-enterologie": "Gastro-entérologue",
  pneumologie: "Pneumologue",
  rhumatologie: "Rhumatologue",
  urologie: "Urologue",
  orl: "ORL",
  podologie: "Podologue",
  psychologie: "Psychologue",
  dietetique: "Diététicien(ne)",
} as const;

export const SPECIALTY_LABEL_TO_SLUG: Record<string, string> = Object.entries(
  SPECIALTY_SLUG_TO_LABEL
).reduce(
  (acc, [slug, label]) => {
    acc[label] = slug;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Get the database label from a URL slug
 */
export function getSpecialtyLabel(slug: string): string | undefined {
  return SPECIALTY_SLUG_TO_LABEL[slug];
}

/**
 * Get the URL slug from a database label
 */
export function getSpecialtySlug(label: string): string | undefined {
  return SPECIALTY_LABEL_TO_SLUG[label];
}
