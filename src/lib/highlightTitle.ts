type Range = [start: number, end: number];

function normalize(str: string): string {
	return str
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase();
}

/** Mots-outils laissés en poids normal dans les titres de cartes (forme normalisée) */
const STOP_WORDS = new Set([
	'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'l', 'au', 'aux', 'en', 'et', 'ou', 'a',
	'est', 'il', 'elle', 'elles', 'ils', 'on', 'ce', 'se', 'ne', 'pas', 'plus', 'tres', 'trop', 'pour',
	'par', 'sur', 'dans', 'avec', 'sans', 'que', 'qui', 'qu', 'donc', 'sinon', 'vraiment', 'factuellement',
	'simple', 'quotidiennement', 'frequemment', 'longtemps', 'beaucoup', 'toujours', 'forcement',
	'reellement', 'particulierement', 'sont', 'subissent', 'passent', 'commis', 'fumaient', 'portaient',
	'partent', 'gagnent', 'augmentent', 'sert', 'bon', 'mauvais', 'bons', 'mauvaise', 'mauvaises',
	'sante', 'physique', 'mentale', 'quelque', 'chose', 'conditions', 'effet', 'placebo', 'entre',
	'uniquement', 'proportionnellement', 'manger', 'boire', 'cuisiner', 'couper', 'attacher', 'rester',
	'assis', 'mouiller', 'laver', 'francophones', 'meilleur', 'meilleure', 'noire', 'noires', 'ses',
	'plats', 'aliments', 'pays',
]);

const INTERRO_PREFIX =
	/^(Pourquoi|Comment|Quelle?|Quels?|Est-ce(?: que)?|Faut-il|Y a-t-il|Voit-on|Récupère-t-on|Ceux qui|Toutes les)\s+/iu;

const LEADING_VERB =
	/^(Manger|Boire|Se laver|Se mouiller|Cuisiner|Couper|Attacher|Rester assis)\s+/iu;

const QUESTION_TAIL =
	/\s+(?:est-(?:il|elle|ce)|sont-(?:ils|elles)|a-t-(?:il|elle)|sert-il|gagnent-ils|augmentent-ils|passent|subissent|commis|fumaient|portaient|partent|fait|voit-on|récupère-t-on|y a-t-il)[\s\S]*$/iu;

function escapeHtml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mergeRanges(ranges: Range[]): Range[] {
	if (!ranges.length) return [];
	const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const merged: Range[] = [sorted[0]];

	for (let i = 1; i < sorted.length; i++) {
		const prev = merged[merged.length - 1];
		const curr = sorted[i];
		if (curr[0] <= prev[1]) {
			prev[1] = Math.max(prev[1], curr[1]);
		} else {
			merged.push(curr);
		}
	}

	return merged;
}

/** Cherche une séquence de mots de tag dans le titre (accents tolérés) */
function findTagSequence(title: string, tag: string): Range[] {
	const parts = tag.split('-').filter(Boolean);
	if (!parts.length) return [];

	const wordRe = /[\p{L}\p{N}']+/gu;
	const words: { start: number; end: number; norm: string }[] = [];
	let match: RegExpExecArray | null;

	while ((match = wordRe.exec(title)) !== null) {
		words.push({
			start: match.index,
			end: match.index + match[0].length,
			norm: normalize(match[0]),
		});
	}

	const ranges: Range[] = [];

	for (let i = 0; i <= words.length - parts.length; i++) {
		let ok = true;
		for (let j = 0; j < parts.length; j++) {
			if (!wordMatch(words[i + j].norm, normalize(parts[j]))) {
				ok = false;
				break;
			}
		}
		if (ok) {
			ranges.push([words[i].start, words[i + parts.length - 1].end]);
		}
	}

	return ranges;
}

function findTagRanges(title: string, tags: string[]): Range[] {
	const ranges: Range[] = [...tags].sort((a, b) => b.length - a.length).flatMap((tag) => findTagSequence(title, tag));

	// Acronymes / sigles présents dans les tags (ex. lfi, ia)
	for (const tag of tags) {
		if (!/^[a-z0-9]{2,6}$/i.test(tag) || tag.includes('-')) continue;
		const re = new RegExp(`\\b${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'giu');
		let m: RegExpExecArray | null;
		while ((m = re.exec(title)) !== null) {
			ranges.push([m.index, m.index + m[0].length]);
		}
	}

	return mergeRanges(ranges);
}

function findKeywordWordRanges(title: string, tags: string[]): Range[] {
	const ranges: Range[] = [];
	const wordRe = /[\p{L}\p{N}']+/gu;
	let match: RegExpExecArray | null;

	while ((match = wordRe.exec(title)) !== null) {
		const word = match[0];
		if (isImportantWord(word, tags)) {
			ranges.push([match.index, match.index + word.length]);
		}
	}

	return ranges;
}

function findParenthesisRanges(title: string): Range[] {
	const ranges: Range[] = [];
	const re = /\([^)]+\)/gu;
	let match: RegExpExecArray | null;
	while ((match = re.exec(title)) !== null) {
		ranges.push([match.index, match.index + match[0].length]);
	}
	return ranges;
}

function findTopicRanges(title: string): Range[] {
	let body = title.trim();
	if (body.endsWith('?')) body = body.slice(0, -1).trim();

	if (body.includes(' — ')) {
		const main = body.split(' — ')[0].trim();
		const start = title.indexOf(main);
		if (start >= 0) return [[start, start + main.length]];
	}

	let prefixLen = 0;
	const inter = body.match(INTERRO_PREFIX);
	if (inter) prefixLen = inter[0].length;

	let suffixLen = 0;
	const tail = body.match(QUESTION_TAIL);
	if (tail?.index !== undefined && tail.index > prefixLen) {
		suffixLen = tail[0].length;
	}

	let topic = body.slice(prefixLen, body.length - suffixLen).trim();
	let topicStart = title.indexOf(topic);
	if (topicStart < 0) return [];

	let verbLen = 0;
	const verb = topic.match(LEADING_VERB);
	if (verb) {
		verbLen = verb[0].length;
		topicStart += verbLen;
		topic = topic.slice(verbLen).trim();
	}

	const article = topic.match(/^(Le|La|Les|L'|Un|Une|Des)\s+/iu);
	if (article) {
		topicStart += article[0].length;
		topic = topic.slice(article[0].length);
	}

	if (!topic) return [];
	return [[topicStart, topicStart + topic.length]];
}

function wordMatch(a: string, b: string): boolean {
	const na = normalize(a);
	const nb = normalize(b);
	if (na === nb) return true;
	// Pluriels / flexions simples : conserve/conserves, boite/boites
	return na.replace(/(?:s|es|eaux|aux)$/u, '') === nb.replace(/(?:s|es|eaux|aux)$/u, '');
}

function isImportantWord(word: string, tags: string[]): boolean {
	const norm = normalize(word);
	if (STOP_WORDS.has(norm)) return false;
	if (word.length >= 2 && /^[A-Z]{2,}$/.test(word)) return true;
	if (/\d/.test(word)) return true;
	if (tags.some((tag) => tag.split('-').some((part) => wordMatch(word, part)))) return true;
	if (tags.some((tag) => wordMatch(word, tag.replace(/-/g, ' ')))) return true;
	return word.length >= 5;
}

function renderTitle(title: string, boldRanges: Range[]): string {
	const ranges = mergeRanges(boldRanges);
	if (!ranges.length) return escapeHtml(title);

	let html = '';
	let cursor = 0;

	for (const [start, end] of ranges) {
		if (start > cursor) html += escapeHtml(title.slice(cursor, start));
		html += `<strong>${escapeHtml(title.slice(start, end))}</strong>`;
		cursor = end;
	}

	if (cursor < title.length) html += escapeHtml(title.slice(cursor));
	return html;
}

/** Met en gras les mots-clés d'une question pour les cartes catalogue */
export function highlightQuestionTitle(title: string, tags: string[] = []): string {
	if (title.includes(' — ')) {
		const q = title.endsWith('?');
		const idx = title.indexOf(' — ');
		const main = title.slice(0, idx);
		const sub = title.slice(idx + 3).trim();
		const mainRanges = mergeRanges([...findTagRanges(main, tags), ...findKeywordWordRanges(main, tags)]);
		const mainHtml = renderTitle(main, mainRanges);
		return `${mainHtml} — ${escapeHtml(sub)}${q && !sub.endsWith('?') ? ' ?' : ''}`;
	}

	const tagRanges = findTagRanges(title, tags);
	const topicRanges = findTopicRanges(title);
	const parenRanges = findParenthesisRanges(title);

	const topicKeywordRanges = topicRanges.flatMap(([start, end]) => {
		const slice = title.slice(start, end);
		return findKeywordWordRanges(slice, tags).map(([s, e]) => [start + s, start + e] as Range);
	});

	const boldRanges = mergeRanges([...tagRanges, ...parenRanges, ...topicKeywordRanges]);
	return renderTitle(title, boldRanges);
}
