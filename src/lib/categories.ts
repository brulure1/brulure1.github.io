/** Thèmes du catalogue — source unique pour nav, grille et cartes */
export const CATEGORIES = [
	{ id: 'economie', label: 'Économie & fiscalité', navLabel: 'Économie' },
	{ id: 'societe', label: 'Société & justice', navLabel: 'Société' },
	{ id: 'culture', label: 'Culture & médias', navLabel: 'Culture' },
	{ id: 'travail', label: 'Travail & inégalités', navLabel: 'Travail' },
	{ id: 'sante', label: 'Santé & nutrition', navLabel: 'Santé' },
	{ id: 'science', label: 'Science & nature', navLabel: 'Science' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
	CategoryId,
	(typeof CATEGORIES)[number]
>;
