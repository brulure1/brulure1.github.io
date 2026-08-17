/** Dernière passe — Openverse + Commons pour fiches sans image */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'src/content/docs');
const cardsDir = path.join(root, 'public/cards');

const REMAINING = {
	'economie/taux-imposition-super-riches': { commons: 'Tax form.jpg', openverse: 'tax documents money' },
	'sante/autodiagnostic-autisme': { openverse: 'autism neurodiversity' },
	'sante/cuisson-inox-sante': { openverse: 'stainless steel pot cooking' },
	'sante/deficit-calorique-perte-poids': { openverse: 'kitchen food scale' },
	'sante/lait-cru-sante': { openverse: 'raw milk bottle' },
	'sante/lentilles-corail-sante': { openverse: 'red lentils food' },
	'sante/liquide-boite-conserve-sante': { commons: 'Canned chickpeas.jpg', openverse: 'canned food liquid' },
	'sante/rester-assis-toilettes-longtemps-sante': { commons: 'Toilet.jpg', openverse: 'toilet bathroom' },
	'sante/savon-quotidien-sante': { commons: 'Soap.jpg', openverse: 'bar soap hygiene' },
	'science/cout-energetique-ia-generative': { openverse: 'data center servers energy' },
	'societe/boycott-efficacite': { openverse: 'protest boycott demonstration' },
	'societe/culture-cowboy-noire': { openverse: 'black cowboy american west' },
	'societe/harcelement-femmes-france': { openverse: 'women protest march' },
	'societe/violences-sexuelles-mineurs-auteurs': { openverse: 'justice courthouse law' },
	'travail/ecart-salaire-patron-salarie': { openverse: 'office meeting business people' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slug(id) {
	return id.replace(/\//g, '--');
}

function upsert(raw, key, val) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return raw;
	const lines = m[1].split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => !new RegExp(`^${key}:`).test(l));
	const i = lines.findIndex((l) => l.startsWith('title:'));
	lines.splice(i >= 0 ? i + 1 : lines.length, 0, `${key}: ${JSON.stringify(val)}`);
	return raw.replace(m[0], `---\n${lines.join('\n')}\n---`);
}

async function fetchBuf(url) {
	const res = await fetch(url, { redirect: 'follow' });
	if (!res.ok) throw new Error(String(res.status));
	const b = Buffer.from(await res.arrayBuffer());
	if (b.length < 800) throw new Error('small');
	return b;
}

async function fromCommons(file) {
	const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=800`;
	return { buffer: await fetchBuf(url), credit: 'Wikimedia Commons' };
}

async function fromOpenverse(q) {
	await sleep(1200);
	const res = await fetch(`https://api.openverse.org/v1/images/?${new URLSearchParams({ q, license: 'cc0,pdm,by,by-sa', page_size: '1' })}`);
	const data = await res.json();
	const hit = data.results?.[0];
	if (!hit?.url) throw new Error('openverse empty');
	return {
		buffer: await fetchBuf(hit.url),
		credit: `${hit.creator || 'Auteur inconnu'} — ${(hit.license || 'CC').toUpperCase()}, via Openverse`,
	};
}

async function main() {
	let ok = 0;
	for (const [id, src] of Object.entries(REMAINING)) {
		const out = path.join(cardsDir, `${slug(id)}.webp`);
		if (fs.existsSync(out)) {
			ok++;
			continue;
		}
		process.stdout.write(`${id} … `);
		try {
			let result;
			if (src.commons) {
				try {
					result = await fromCommons(src.commons);
				} catch {
					result = await fromOpenverse(src.openverse);
				}
			} else {
				result = await fromOpenverse(src.openverse);
			}
			await sharp(result.buffer).resize(640, 360, { fit: 'cover' }).webp({ quality: 78 }).toFile(out);
			const md = path.join(docsDir, `${id}.md`);
			let raw = fs.readFileSync(md, 'utf8');
			raw = upsert(raw, 'cardImage', `/cards/${slug(id)}.webp`);
			raw = upsert(raw, 'cardImageCredit', result.credit);
			fs.writeFileSync(md, raw, 'utf8');
			ok++;
			console.log('✓');
			await sleep(2000);
		} catch (e) {
			console.log(`✗ ${e.message}`);
		}
	}
	console.log(`${ok}/${Object.keys(REMAINING).length}`);
}

main();
