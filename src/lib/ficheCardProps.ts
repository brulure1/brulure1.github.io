import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { CATEGORY_BY_ID } from './categories';

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
		cardImage: fiche.data.cardImage,
		cardImageCredit: fiche.data.cardImageCredit,
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
