/** Retry missing card images only */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'src/content/docs');
const cardsDir = path.join(root, 'public/cards');

const FIXES = {
	'economie/heritage-baisse-inegalites': { file: 'Euro_coins_and_banknotes.jpg', credit: 'Wikimedia Commons' },
	'economie/seuil-1-pourcent-riches': {
		file: 'Wealth Inequality by Group 1989 to 2019.png',
		credit: 'Wikimedia Commons — CC BY-SA 4.0',
	},
	'economie/taux-imposition-super-riches': { file: 'Taxes (Photo).jpg', credit: 'Wikimedia Commons' },
	'sante/attacher-cheveux-frequemment-sante': { file: 'Ponytail.jpg', credit: 'Wikimedia Commons' },
	'sante/autodiagnostic-autisme': { file: 'Autism awareness.png', credit: 'Wikimedia Commons' },
	'sante/baume-du-tigre-placebo': { file: 'Tigerbalm.jpg', credit: 'Wikimedia Commons' },
	'sante/charcuterie-sante': {
		file: 'Salume Filetto di maiale prodotto in Calabria ( Bivongi agosto 2023).jpg',
		credit: 'Wikimedia Commons — CC BY-SA 4.0',
	},
	'sante/cuisson-inox-sante': { file: 'Stainless steel saucepan.jpg', credit: 'Wikimedia Commons' },
	'sante/deficit-calorique-perte-poids': { file: 'Digital kitchen scale.jpg', credit: 'Wikimedia Commons' },
	'sante/lait-avoine-sante': { file: 'Oat milk glass.jpg', credit: 'Wikimedia Commons' },
	'sante/lait-cru-sante': { file: 'Raw milk.jpg', credit: 'Wikimedia Commons' },
	'sante/lentilles-corail-sante': { file: 'Red lentils in bowl.jpg', credit: 'Wikimedia Commons' },
	'sante/liquide-boite-conserve-sante': { file: 'Chickpeas in can.jpg', credit: 'Wikimedia Commons' },
	'sante/pois-chiches-sante': { file: 'Chickpea.jpg', credit: 'Wikimedia Commons' },
	'sante/recuperation-musculaire-memoire': { file: 'Biceps brachii muscle.jpg', credit: 'Wikimedia Commons' },
	'sante/rester-assis-toilettes-longtemps-sante': { file: 'Toilet seat up.jpg', credit: 'Wikimedia Commons' },
	'sante/savon-quotidien-sante': { file: 'Soap bar.jpg', credit: 'Wikimedia Commons' },
	'science/cout-energetique-ia-generative': { file: 'Server-room.jpg', credit: 'Wikimedia Commons' },
	'science/pourquoi-fleurs-colorees': { file: 'Colorful-flowers-2.jpg', credit: 'Wikimedia Commons' },
	'societe/amerindiens-pipe-plumes': { file: 'Peace pipe.jpg', credit: 'Wikimedia Commons' },
	'societe/boycott-efficacite': { file: 'Demonstration against Trump.jpg', credit: 'Wikimedia Commons' },
	'societe/culture-cowboy-noire': { file: 'Bill Pickett cowboy.jpg', credit: 'Wikimedia Commons' },
	'societe/harcelement-femmes-france': { file: 'Women\'s March 2018 in London.jpg', credit: 'Wikimedia Commons' },
	'societe/violences-sexuelles-mineurs-auteurs': { file: 'Justice scale.svg', credit: 'Wikimedia Commons' },
	'travail/ecart-salaire-patron-salarie': { file: 'Office workers in meeting.jpg', credit: 'Wikimedia Commons' },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugFromId(id) {
	return id.replace(/\//g, '--');
}

function commonsUrl(file) {
	return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=800`;
}

async function fetchBuffer(url) {
	for (let i = 0; i < 5; i++) {
		const res = await fetch(url, { redirect: 'follow' });
		if (res.status === 429) {
			await sleep(10000 * (i + 1));
			continue;
		}
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buf = Buffer.from(await res.arrayBuffer());
		if (buf.length > 800) return buf;
		throw new Error('too small');
	}
	throw new Error('rate limit');
}

async function openverse(query) {
	await sleep(1500);
	const params = new URLSearchParams({
		q: query,
		license: 'cc0,pdm,by,by-sa',
		page_size: '1',
	});
	const res = await fetch(`https://api.openverse.org/v1/images/?${params}`);
	if (!res.ok) return null;
	const data = await res.json();
	const hit = data.results?.[0];
	if (!hit?.url) return null;
	return { url: hit.url, credit: `${hit.creator || 'Openverse'} — ${hit.license?.toUpperCase() ?? 'CC'}` };
}

async function searchCommons(query) {
	await sleep(2500);
	const params = new URLSearchParams({
		action: 'query',
		generator: 'search',
		gsrsearch: query,
		gsrnamespace: '6',
		gsrlimit: '6',
		prop: 'imageinfo',
		iiprop: 'url|mime',
		iiurlwidth: '800',
		format: 'json',
		origin: '*',
	});
	const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
	if (!res.ok) return null;
	const data = await res.json();
	for (const p of Object.values(data.query?.pages ?? {})) {
		const info = p.imageinfo?.[0];
		if (info?.thumburl && info.mime?.startsWith('image/')) return info.thumburl;
	}
	return null;
}

function upsert(raw, key, val) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return raw;
	const lines = m[1].split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => !new RegExp(`^${key}:`).test(l));
	const i = lines.findIndex((l) => l.startsWith('title:'));
	lines.splice(i >= 0 ? i + 1 : lines.length, 0, `${key}: ${JSON.stringify(val)}`);
	return raw.replace(m[0], `---\n${lines.join('\n')}\n---`);
}

async function main() {
	let ok = 0;
	for (const [id, entry] of Object.entries(FIXES)) {
		const slug = slugFromId(id);
		const out = path.join(cardsDir, `${slug}.webp`);
		const md = path.join(docsDir, `${id}.md`);
		if (fs.existsSync(out)) {
			console.log(`skip ${id}`);
			ok++;
			continue;
		}
		process.stdout.write(`→ ${id} … `);
		try {
			let buffer;
			let credit = entry.credit;
			try {
				buffer = await fetchBuffer(commonsUrl(entry.file));
			} catch {
				const q = id.split('/').pop().replace(/-/g, ' ');
				const thumb = await searchCommons(q);
				if (thumb) {
					buffer = await fetchBuffer(thumb);
				} else {
					const ov = await openverse(q);
					if (!ov) throw new Error('no source');
					buffer = await fetchBuffer(ov.url);
					credit = `${ov.credit}, via Openverse`;
				}
			}
			await sharp(buffer).resize(640, 360, { fit: 'cover' }).webp({ quality: 78 }).toFile(out);
			let raw = fs.readFileSync(md, 'utf8');
			raw = upsert(raw, 'cardImage', `/cards/${slug}.webp`);
			raw = upsert(raw, 'cardImageCredit', credit);
			fs.writeFileSync(md, raw, 'utf8');
			ok++;
			console.log('✓');
			await sleep(2500);
		} catch (e) {
			console.log(`✗ ${e.message}`);
		}
	}
	console.log(`\n${ok}/${Object.keys(FIXES).length}`);
}

main();
