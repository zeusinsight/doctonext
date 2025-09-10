#!/usr/bin/env tsx

import { db } from "../src/database/db"
import { contractTemplates } from "../src/database/schema"
import { nanoid } from "nanoid"

const templates = [
    // Doctor Templates
    {
        id: nanoid(),
        name: "Contrat de Remplacement - Médecin",
        profession: "Médecin",
        contractType: "replacement",
        templateContent: `
CONTRAT DE REMPLACEMENT - MÉDECIN

Entre :
- Dr. [REMPLAÇANT], inscrit à l'Ordre des Médecins sous le numéro [RPPS_REMPLAÇANT]
- Dr. [REMPLACÉ], inscrit à l'Ordre des Médecins sous le numéro [RPPS_REMPLACE]

CONDITIONS :
- Période : du [DATE_DEBUT] au [DATE_FIN]
- Lieu : [ADRESSE_CABINET]
- Rétrocession : [POURCENTAGE]%
- Logement fourni : [OUI/NON]

Conforme au Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "REMPLAÇANT", type: "text", required: true },
                { name: "RPPS_REMPLAÇANT", type: "text", required: true },
                { name: "REMPLACÉ", type: "text", required: true },
                { name: "RPPS_REMPLACE", type: "text", required: true },
                { name: "DATE_DEBUT", type: "date", required: true },
                { name: "DATE_FIN", type: "date", required: true },
                { name: "ADRESSE_CABINET", type: "text", required: true },
                { name: "POURCENTAGE", type: "number", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    },
    {
        id: nanoid(),
        name: "Contrat de Cession de Patientèle - Médecin",
        profession: "Médecin",
        contractType: "transfer",
        templateContent: `
CONTRAT DE CESSION DE PATIENTÈLE - MÉDECIN

Entre :
- Dr. [CÉDANT], inscrit à l'Ordre des Médecins sous le numéro [RPPS_CEDANT]
- Dr. [CESSIONNAIRE], inscrit à l'Ordre des Médecins sous le numéro [RPPS_CESSIONNAIRE]

OBJET DE LA CESSION :
- Patientèle du cabinet situé : [ADRESSE_CABINET]
- Nombre de patients : [NOMBRE_PATIENTS]
- Chiffre d'affaires annuel : [CA_ANNUEL] €
- Prix de cession : [PRIX_CESSION] €

Conforme aux dispositions de l'article L.162-2 du Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "CÉDANT", type: "text", required: true },
                { name: "RPPS_CEDANT", type: "text", required: true },
                { name: "CESSIONNAIRE", type: "text", required: true },
                { name: "RPPS_CESSIONNAIRE", type: "text", required: true },
                { name: "ADRESSE_CABINET", type: "text", required: true },
                { name: "NOMBRE_PATIENTS", type: "number", required: true },
                { name: "CA_ANNUEL", type: "number", required: true },
                { name: "PRIX_CESSION", type: "number", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    },
    {
        id: nanoid(),
        name: "Contrat de Collaboration - Médecin",
        profession: "Médecin",
        contractType: "collaboration",
        templateContent: `
CONTRAT DE COLLABORATION - MÉDECIN

Entre :
- Dr. [COLLABORATEUR], inscrit à l'Ordre des Médecins sous le numéro [RPPS_COLLABORATEUR]
- Dr. [TITULAIRE], inscrit à l'Ordre des Médecins sous le numéro [RPPS_TITULAIRE]

CONDITIONS DE COLLABORATION :
- Cabinet situé : [ADRESSE_CABINET]
- Durée : [DUREE] mois
- Répartition des honoraires : [REPARTITION]%
- Frais partagés : [FRAIS_PARTAGES]

Conforme aux articles L.4113-6 et suivants du Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "COLLABORATEUR", type: "text", required: true },
                { name: "RPPS_COLLABORATEUR", type: "text", required: true },
                { name: "TITULAIRE", type: "text", required: true },
                { name: "RPPS_TITULAIRE", type: "text", required: true },
                { name: "ADRESSE_CABINET", type: "text", required: true },
                { name: "DUREE", type: "number", required: true },
                { name: "REPARTITION", type: "number", required: true },
                { name: "FRAIS_PARTAGES", type: "text", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    },

    // Dentist Templates
    {
        id: nanoid(),
        name: "Contrat de Remplacement - Chirurgien-Dentiste",
        profession: "Chirurgien-Dentiste",
        contractType: "replacement",
        templateContent: `
CONTRAT DE REMPLACEMENT - CHIRURGIEN-DENTISTE

Entre :
- Dr. [REMPLAÇANT], inscrit à l'Ordre des Chirurgiens-Dentistes sous le numéro [RPPS_REMPLAÇANT]
- Dr. [REMPLACÉ], inscrit à l'Ordre des Chirurgiens-Dentistes sous le numéro [RPPS_REMPLACE]

CONDITIONS :
- Période : du [DATE_DEBUT] au [DATE_FIN]
- Cabinet dentaire : [ADRESSE_CABINET]
- Rétrocession : [POURCENTAGE]%
- Équipements mis à disposition : [EQUIPEMENTS]

Conforme au Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "REMPLAÇANT", type: "text", required: true },
                { name: "RPPS_REMPLAÇANT", type: "text", required: true },
                { name: "REMPLACÉ", type: "text", required: true },
                { name: "RPPS_REMPLACE", type: "text", required: true },
                { name: "DATE_DEBUT", type: "date", required: true },
                { name: "DATE_FIN", type: "date", required: true },
                { name: "ADRESSE_CABINET", type: "text", required: true },
                { name: "POURCENTAGE", type: "number", required: true },
                { name: "EQUIPEMENTS", type: "text", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    },

    // Physiotherapist Templates
    {
        id: nanoid(),
        name: "Contrat de Remplacement - Kinésithérapeute",
        profession: "Kinésithérapeute",
        contractType: "replacement",
        templateContent: `
CONTRAT DE REMPLACEMENT - MASSEUR-KINÉSITHÉRAPEUTE

Entre :
- [REMPLAÇANT], Masseur-Kinésithérapeute ADELI n° [ADELI_REMPLAÇANT]
- [REMPLACÉ], Masseur-Kinésithérapeute ADELI n° [ADELI_REMPLACE]

CONDITIONS :
- Période : du [DATE_DEBUT] au [DATE_FIN]
- Cabinet de kinésithérapie : [ADRESSE_CABINET]
- Rétrocession : [POURCENTAGE]%
- Matériel mis à disposition : [MATERIEL]

Conforme au Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "REMPLAÇANT", type: "text", required: true },
                { name: "ADELI_REMPLAÇANT", type: "text", required: true },
                { name: "REMPLACÉ", type: "text", required: true },
                { name: "ADELI_REMPLACE", type: "text", required: true },
                { name: "DATE_DEBUT", type: "date", required: true },
                { name: "DATE_FIN", type: "date", required: true },
                { name: "ADRESSE_CABINET", type: "text", required: true },
                { name: "POURCENTAGE", type: "number", required: true },
                { name: "MATERIEL", type: "text", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    },

    // Nurse Templates
    {
        id: nanoid(),
        name: "Contrat de Remplacement - Infirmier",
        profession: "Infirmier",
        contractType: "replacement",
        templateContent: `
CONTRAT DE REMPLACEMENT - INFIRMIER DIPLÔMÉ D'ÉTAT

Entre :
- [REMPLAÇANT], Infirmier D.E. ADELI n° [ADELI_REMPLAÇANT]
- [REMPLACÉ], Infirmier D.E. ADELI n° [ADELI_REMPLACE]

CONDITIONS :
- Période : du [DATE_DEBUT] au [DATE_FIN]
- Secteur d'exercice : [SECTEUR]
- Rétrocession : [POURCENTAGE]%
- Tournées : [TOURNEES]

Conforme au Code de la Santé Publique.
        `.trim(),
        fieldsSchema: {
            fields: [
                { name: "REMPLAÇANT", type: "text", required: true },
                { name: "ADELI_REMPLAÇANT", type: "text", required: true },
                { name: "REMPLACÉ", type: "text", required: true },
                { name: "ADELI_REMPLACE", type: "text", required: true },
                { name: "DATE_DEBUT", type: "date", required: true },
                { name: "DATE_FIN", type: "date", required: true },
                { name: "SECTEUR", type: "text", required: true },
                { name: "POURCENTAGE", type: "number", required: true },
                { name: "TOURNEES", type: "text", required: true }
            ]
        },
        priceCents: 500,
        isActive: true,
        version: "1.0"
    }
]

async function seedContractTemplates() {
    console.log("🌱 Seeding contract templates...")

    try {
        // Check if templates already exist
        const existingTemplates = await db.select().from(contractTemplates).limit(1)
        
        if (existingTemplates.length > 0) {
            console.log("📋 Contract templates already exist, skipping seed...")
            return
        }

        // Insert all templates
        await db.insert(contractTemplates).values(templates)

        console.log(`✅ Successfully seeded ${templates.length} contract templates`)
        console.log("📋 Templates created:")
        templates.forEach(template => {
            console.log(`   - ${template.name} (${template.profession})`)
        })

    } catch (error) {
        console.error("❌ Error seeding contract templates:", error)
        process.exit(1)
    }
}

// Run the seed function
seedContractTemplates()
    .then(() => {
        console.log("🎉 Contract templates seeding completed!")
        process.exit(0)
    })
    .catch((error) => {
        console.error("💥 Seeding failed:", error)
        process.exit(1)
    })