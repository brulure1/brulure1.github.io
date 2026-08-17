/** Préfixe un chemin local avec le base path Astro (ex. /scriptum-probat/). */
export function withBase(path: string): string {
	if (!path || /^https?:\/\//i.test(path)) return path;

	const base = import.meta.env.BASE_URL;
	const normalized = path.startsWith('/') ? path.slice(1) : path;
	return `${base}${normalized}`;
}
