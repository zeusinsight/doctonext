import {
  Stethoscope,
  Smile,
  Pill,
  HeartPulse,
  MessageCircle,
  Syringe,
  Baby,
  Footprints,
  type LucideIcon,
} from "lucide-react";

export const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  "Médecin généraliste": Stethoscope,
  "Dentiste": Smile,
  "Pharmacien": Pill,
  "Kinésithérapeute": HeartPulse,
  "Orthophoniste": MessageCircle,
  "Infirmier(ère)": Syringe,
  "Sage-femme": Baby,
  "Podologue": Footprints,
};
