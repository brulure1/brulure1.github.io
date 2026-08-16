/** Thèmes du catalogue — source unique pour nav, grille et cartes */
export const CATEGORIES = [
	{ id: 'economie', label: 'Économie & fiscalité', navLabel: 'Économie', icon: '💶' },
	{ id: 'societe', label: 'Société & justice', navLabel: 'Société', icon: '⚖️' },
	{ id: 'culture', label: 'Culture & médias', navLabel: 'Culture', icon: '🎬' },
	{ id: 'travail', label: 'Travail & inégalités', navLabel: 'Travail', icon: '👷' },
	{ id: 'sante', label: 'Santé & nutrition', navLabel: 'Santé', icon: '🏥' },
	{ id: 'science', label: 'Science & nature', navLabel: 'Science', icon: '🔬' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
	CategoryId,
	(typeof CATEGORIES)[number]
>;
