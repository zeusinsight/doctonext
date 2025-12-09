import {
  Stethoscope,
  Smile,
  Pill,
  HeartPulse,
  MessageCircle,
  Syringe,
  Baby,
  Footprints,
  Microscope,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  "Médecin généraliste": Stethoscope,
  "Dentiste": Smile,
  "Pharmacien": Pill,
  "Médecin biologiste": Microscope,
  "Pharmacien biologiste": FlaskConical,
  "Kinésithérapeute": HeartPulse,
  "Orthophoniste": MessageCircle,
  "Infirmier(ère)": Syringe,
  "Sage-femme": Baby,
  "Podologue": Footprints,
};
