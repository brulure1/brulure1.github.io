/**
 * Complète / remplace les vignettes via recherche Commons (photos JPEG).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'src/content/docs');
const cardsDir = path.join(root, 'public/cards');

const SKIP_TITLE = /clip.?art|chart|graph|diagram|svg|logo|icon|map|screenshot|scan of|pdf|coat of arms|flag of|qr.?code/i;

const JOBS = {
	'culture/representation-minorites-cinema': 'movie theater cinema seats interior',
	'economie/capitalisme-consommation-sante': 'supermarket grocery aisle',
	'economie/exil-fiscal-impots': 'private jet airplane luxury',
	'economie/heritage-baisse-inegalites': 'family house residential street',
	'economie/riches-heritiers-ou-self-made': 'office laptop entrepreneur',
	'economie/taux-imposition-super-riches': 'calculator euro coins taxes',
	'economie/travailler-plus-gagner-plus': 'office workers desk computer',
	'sante/aliments-boite-conserve-sante': 'canned food supermarket shelves',
	'sante/attacher-cheveux-frequemment-sante': 'woman ponytail hair',
	'sante/autodiagnostic-autisme': 'person reading book window',
	'sante/bain-de-bouche-utilite': 'toothbrush toothpaste bathroom',
	'sante/baume-du-tigre-placebo': 'Tiger Balm ointment',
	'sante/charcuterie-sante': 'jamon serrano ham sliced',
	'sante/cuisson-inox-sante': 'stainless steel saucepan kitchen',
	'sante/lait-avoine-sante': 'oat milk glass oats',
	'sante/lentilles-corail-sante': 'red lentils bowl',
	'sante/liquide-boite-conserve-sante': 'canned chickpeas open can',
	'sante/mouiller-cheveux-frequemment-sante': 'woman wet hair shower',
	'sante/poils-repousse-coupe': 'safety razor shaving',
	'sante/recuperation-musculaire-memoire': 'weightlifting gym dumbbell',
	'sante/rester-assis-toilettes-longtemps-sante': 'modern bathroom interior',
	'sante/the-sante': 'green tea cup',
	'sante/thon-boite-sante': 'canned tuna supermarket',
	'science/cout-energetique-ia-generative': 'data center server racks',
	'societe/amerindiens-pipe-plumes': 'calumet peace pipe museum',
	'societe/boycott-efficacite': 'street protest demonstration signs',
	'societe/chine-cameras-surveillance': 'CCTV surveillance camera',
	'societe/lfi-extreme-gauche': 'Assemblée nationale hémicycle Paris',
	'societe/logements-vacants-paris': 'Paris Haussmann apartment facade',
	'societe/violences-sexuelles-mineurs-auteurs': 'courthouse palace of justice building',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slug(id) {
	return id.replace(/\//g, '--');
}

function upsert(raw, key, val) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return raw;
	const lines = m[1]
		.split('\n')
		.map((l) => l.replace(/\r$/, ''))
		.filter((l) => !new RegExp(`^${key}:`).test(l));
	const i = lines.findIndex((l) => l.startsWith('title:'));
	lines.splice(i >= 0 ? i + 1 : lines.length, 0, `${key}: ${JSON.stringify(val)}`);
	return raw.replace(m[0], `---\n${lines.join('\n')}\n---`);
}

async function searchCommons(query) {
	const params = new URLSearchParams({
		action: 'query',
		generator: 'search',
		gsrsearch: `${query} filetype:bitmap`,
		gsrnamespace: '6',
		gsrlimit: '10',
		prop: 'imageinfo',
		iiprop: 'url|mime|size|extmetadata',
		iiurlwidth: '1280',
		format: 'json',
		origin: '*',
	});
	const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
		headers: { 'User-Agent': 'ScriptumProbat/1.0 (https://brulure1.github.io; card images)' },
	});
	if (res.status === 429) throw new Error('429');
	if (!res.ok) throw new Error(`API ${res.status}`);
	const data = await res.json();
	const pages = Object.values(data.query?.pages ?? {});

	return pages
		.map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
		.filter((p) => p.info)
		.filter((p) => p.info.mime === 'image/jpeg' || p.info.mime === 'image/png')
		.filter((p) => (p.info.size ?? 0) > 200_000)
		.filter((p) => !SKIP_TITLE.test(p.title))
		.filter((p) => p.info.thumburl || p.info.url);
}

async function download(url) {
	const res = await fetch(url, {
		redirect: 'follow',
		headers: { 'User-Agent': 'ScriptumProbat/1.0 (https://brulure1.github.io; card images)' },
	});
	if (!res.ok) throw new Error(`DL ${res.status}`);
	const buf = Buffer.from(await res.arrayBuffer());
	if (buf.length < 15_000) throw new Error('tiny download');
	return buf;
}

function creditFrom(info) {
	const artist = info.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, '').trim();
	const license = info.extmetadata?.LicenseShortName?.value ?? 'CC';
	return artist
		? `${artist} — ${license}, via Wikimedia Commons`
		: `${license}, via Wikimedia Commons`;
}

async function main() {
	let ok = 0;
	const failed = [];

	for (const [id, query] of Object.entries(JOBS)) {
		const out = path.join(cardsDir, `${slug(id)}.webp`);
		const md = path.join(docsDir, `${id}.md`);
		process.stdout.write(`${id} … `);
		try {
			await sleep(1600);
			const candidates = await searchCommons(query);
			if (!candidates.length) throw new Error('no candidates');

			let saved = false;
			for (const c of candidates.slice(0, 5)) {
				try {
					const buf = await download(c.info.thumburl || c.info.url);
					const meta = await sharp(buf).metadata();
					if ((meta.width ?? 0) < 700) continue;
					await sharp(buf)
						.resize(800, 450, { fit: 'cover', position: 'attention' })
						.webp({ quality: 82 })
						.toFile(out);
					if (fs.statSync(out).size < 14_000) continue;
					let raw = fs.readFileSync(md, 'utf8');
					raw = upsert(raw, 'cardImage', `/cards/${slug(id)}.webp`);
					raw = upsert(raw, 'cardImageCredit', creditFrom(c.info));
					fs.writeFileSync(md, raw, 'utf8');
					saved = true;
					break;
				} catch {
					/* next candidate */
				}
			}
			if (!saved) throw new Error('all candidates failed');
			ok++;
			console.log('✓');
		} catch (e) {
			failed.push(id);
			console.log(`✗ ${e.message}`);
			if (e.message === '429') await sleep(12_000);
		}
	}

	console.log(`\n${ok}/${Object.keys(JOBS).length}`);
	if (failed.length) console.log('Échecs:', failed.join(', '));
}

main();
