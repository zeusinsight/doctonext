# Images par défaut pour les annonces

Ce dossier contient les images par défaut utilisées lorsqu'une annonce n'a pas de photo.

## Structure des fichiers

Veuillez placer les images suivantes dans ce dossier :

- `replacement.jpg` - Image par défaut pour les annonces de type "Remplacement"
- `transfer.jpg` - Image par défaut pour les annonces de type "Cession"
- `collaboration.jpg` - Image par défaut pour les annonces de type "Collaboration"

## Spécifications des images

- **Format** : JPG, PNG ou WebP
- **Dimensions recommandées** : 1200x900 pixels (ratio 4:3)
- **Poids** : Maximum 500KB par image
- **Style** : Images professionnelles représentant le secteur médical

## Utilisation

Les images sont automatiquement utilisées par le composant `SponsoredListingCard` lorsqu'aucune image n'est fournie pour une annonce.

Le système sélectionne l'image appropriée en fonction du type d'annonce (`listingType`) :
- `replacement` → `replacement.jpg`
- `transfer` → `transfer.jpg`
- `collaboration` → `collaboration.jpg`
