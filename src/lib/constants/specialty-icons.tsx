import {
  Stethoscope,
  Smile,
  Pill,
  HeartPulse,
  MessageCircle,
  Syringe,
  Baby,
  Bone,
  Heart,
  Sparkles,
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
  "Ostéopathe": Bone,
  "Cardiologue": Heart,
  "Dermatologue": Sparkles,
};
