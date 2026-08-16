import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/** Schéma étendu pour les fiches factuelles Scriptum Probat */
const ficheSchema = z.object({
	/** Réponse en une phrase — affichée en tête de fiche */
	answerShort: z.string().optional(),
	/** Niveau de confiance dans les données */
	confidence: z.enum(['elevee', 'moyenne', 'faible', 'controverse']).optional(),
	/** Catégorie principale (navigation) */
	category: z.enum(['economie', 'travail', 'societe', 'sante', 'science', 'culture', 'guide']).optional(),
	/** Titre carte catalogue — **mots-clés** en gras (markdown minimal) */
	cardTitle: z.string().optional(),
	/** Mots-clés pour recherche et filtrage */
	tags: z.array(z.string()).default([]),
});

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: ficheSchema,
		}),
	}),
};
