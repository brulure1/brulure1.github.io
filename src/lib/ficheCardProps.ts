import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { CATEGORY_BY_ID } from './categories';

export const CONFIDENCE_CLASS: Record<string, string> = {
	elevee: 'sp-badge--high',
	moyenne: 'sp-badge--mid',
	faible: 'sp-badge--low',
	controverse: 'sp-badge--warn',
};

export const CONFIDENCE_LABEL: Record<string, string> = {
	elevee: 'Élevée',
	moyenne: 'Moyenne',
	faible: 'Faible',
	controverse: 'Controversé',
};

export type CatalogFiche = CollectionEntry<'docs'>;

export async function getCatalogFiches(): Promise<CatalogFiche[]> {
	const docs = await getCollection('docs');
	return docs
		.filter((doc) => doc.data.answerShort && doc.data.category && doc.data.category !== 'guide')
		.filter((doc) => !doc.data.draft);
}

export function toCardProps(fiche: CatalogFiche, index = 0) {
	const cat = fiche.data.category ? CATEGORY_BY_ID[fiche.data.category] : undefined;
	return {
		href: `/${fiche.id}/`,
		title: fiche.data.title,
		cardTitle: fiche.data.cardTitle,
		confidenceClass: fiche.data.confidence ? CONFIDENCE_CLASS[fiche.data.confidence] : '',
		confidenceLabel: fiche.data.confidence ? CONFIDENCE_LABEL[fiche.data.confidence] : undefined,
		categoryLabel: cat?.label,
		accent: fiche.data.category ?? 'default',
		index,
	};
}

/** Mélange Fisher-Yates (ordre aléatoire à chaque build) */
export function shuffleFiches<T>(items: T[]): T[] {
	const list = [...items];
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	return list;
}
