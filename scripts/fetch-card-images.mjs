/**
 * Télécharge les vignettes cartes depuis Wikimedia Commons (fichiers directs)
 * et met à jour le frontmatter des fiches.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'src/content/docs');
const cardsDir = path.join(root, 'public/cards');

/** id fiche → fichier Commons + crédit */
const ENTRIES = {
	'culture/representation-minorites-cinema': {
		file: 'Cinema_600_strikes_for_hollywood.jpg',
		credit: 'Wikimedia Commons — CC BY-SA 2.0',
	},
	'culture/test-bechdel-cinema': {
		file: 'Bechdel_test.svg',
		credit: 'Wikimedia Commons — CC BY-SA 3.0',
		skipSvg: false,
	},
	'economie/capitalisme-consommation-sante': {
		file: 'Shopping_cart_in_supermarket.jpg',
		credit: 'Wikimedia Commons',
	},
	'economie/exil-fiscal-impots': {
		file: 'Offshore_bank.jpg',
		credit: 'Wikimedia Commons',
	},
	'economie/heritage-baisse-inegalites': {
		file: 'Inheritance_tax.jpg',
		credit: 'Wikimedia Commons',
	},
	'economie/riches-heritiers-ou-self-made': {
		file: 'Startup_office.jpg',
		credit: 'Wikimedia Commons',
	},
	'economie/seuil-1-pourcent-riches': {
		file: 'Income_inequality_-_share_of_income_by_top_1%.png',
		credit: 'Wikimedia Commons — CC BY-SA 4.0',
	},
	'economie/taux-imposition-super-riches': {
		file: 'Tax_form_1040.jpg',
		credit: 'Wikimedia Commons',
	},
	'economie/travailler-plus-gagner-plus': {
		file: 'Office_workers.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/aliments-boite-conserve-sante': {
		file: 'Canned_food.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/aliments-libido': {
		file: 'Oysters_on_ice.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/attacher-cheveux-frequemment-sante': {
		file: 'Ponytail_hairstyle.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/augmentation-cancer': {
		file: 'Cancer_ribbon.svg',
		credit: 'Wikimedia Commons',
	},
	'sante/autodiagnostic-autisme': {
		file: 'Autism_strength.png',
		credit: 'Wikimedia Commons',
	},
	'sante/bain-de-bouche-utilite': {
		file: 'Mouthwash.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/baume-du-tigre-placebo': {
		file: 'Tiger_Balm_products.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/cafe-quotidien-sante': {
		file: 'A_small_cup_of_coffee.JPG',
		credit: 'Wikimedia Commons',
	},
	'sante/charcuterie-sante': {
		file: 'Charcuterie_board.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/cuisson-inox-sante': {
		file: 'Stainless_steel_pot.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/deficit-calorique-perte-poids': {
		file: 'Kitchen_scale.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/lait-avoine-sante': {
		file: 'Oat_milk.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/lait-cru-sante': {
		file: 'Raw_milk_glass.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/lentilles-corail-sante': {
		file: 'Red_lentils.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/liquide-boite-conserve-sante': {
		file: 'Chickpeas_canned.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/mais-sante': {
		file: 'Maize_plants.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/mouiller-cheveux-frequemment-sante': {
		file: 'Wet_hair.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/pates-sante': {
		file: 'Spaghetti_pasta.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/poils-repousse-coupe': {
		file: 'Razor_shaving.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/pois-chiches-sante': {
		file: 'Chickpeas.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/recuperation-musculaire-memoire': {
		file: 'Biceps_brachii_muscle.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/rester-assis-toilettes-longtemps-sante': {
		file: 'Toilet_bathroom.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/riz-sante': {
		file: 'Cooked_white_rice.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/savon-quotidien-sante': {
		file: 'Bar_of_soap.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/the-sante': {
		file: 'Green_tea_in_cup.jpg',
		credit: 'Wikimedia Commons',
	},
	'sante/thon-boite-sante': {
		file: 'Canned_tuna.jpg',
		credit: 'Wikimedia Commons',
	},
	'science/avion-altitude-distance': {
		file: 'Commercial_airplane_in_flight.jpg',
		credit: 'Wikimedia Commons',
	},
	'science/cout-energetique-ia-generative': {
		file: 'Data_center_servers.jpg',
		credit: 'Wikimedia Commons',
	},
	'science/pourquoi-fleurs-colorees': {
		file: 'Colorful_spring_flowers.jpg',
		credit: 'Wikimedia Commons',
	},
	'science/temperature-eau-riviere': {
		file: 'Mountain_river.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/amerindiens-pipe-plumes': {
		file: 'Native_American_peace_pipe.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/boycott-efficacite': {
		file: 'Demonstration_protest_signs.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/chine-cameras-surveillance': {
		file: 'Surveillance_cameras.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/culture-cowboy-noire': {
		file: 'Black_cowboy_rodeo.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/harcelement-femmes-france': {
		file: 'Women_protest_street.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/lfi-extreme-gauche': {
		file: 'Hemicycle_de_lAssemblee_nationale_france.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/logements-vacants-paris': {
		file: 'Paris_Haussmann_buildings.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/racisme-embauche-logement-minorites': {
		file: 'Job_interview.jpg',
		credit: 'Wikimedia Commons',
	},
	'societe/violences-sexuelles-mineurs-auteurs': {
		file: 'Scales_of_justice.svg',
		credit: 'Wikimedia Commons',
	},
	'travail/ecart-salaire-patron-salarie': {
		file: 'Executive_and_employee.jpg',
		credit: 'Wikimedia Commons',
	},
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function commonsUrl(fileName, width = 800) {
	return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName.replace(/ /g, '_'))}?width=${width}`;
}

async function fetchWithRetry(url, retries = 4) {
	for (let i = 0; i < retries; i++) {
		const res = await fetch(url, { redirect: 'follow' });
		if (res.status === 429) {
			await sleep(8000 * (i + 1));
			continue;
		}
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return Buffer.from(await res.arrayBuffer());
	}
	throw new Error('HTTP 429 (rate limit)');
}

async function searchCommons(query) {
	await sleep(2000);
	const params = new URLSearchParams({
		action: 'query',
		generator: 'search',
		gsrsearch: query,
		gsrnamespace: '6',
		gsrlimit: '5',
		prop: 'imageinfo',
		iiprop: 'url|mime',
		iiurlwidth: '800',
		format: 'json',
		origin: '*',
	});
	const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
	if (!res.ok) return null;
	const data = await res.json();
	const pages = Object.values(data.query?.pages ?? {});
	for (const p of pages) {
		const info = p.imageinfo?.[0];
		if (info?.thumburl && info.mime?.startsWith('image/') && !info.mime.includes('svg')) {
			return info.thumburl;
		}
	}
	return null;
}

async function downloadAndProcess(buffer, outPath) {
	await sharp(buffer)
		.resize(640, 360, { fit: 'cover', position: 'centre' })
		.webp({ quality: 78 })
		.toFile(outPath);
}

function slugFromId(id) {
	return id.replace(/\//g, '--');
}

function upsertFrontmatterField(raw, key, value) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return raw;
	const lines = match[1].split('\n').map((l) => l.replace(/\r$/, ''));
	const keyRe = new RegExp(`^${key}:`);
	const filtered = lines.filter((l) => !keyRe.test(l));
	const cardTitleIdx = filtered.findIndex((l) => l.startsWith('title:'));
	const insertAt = cardTitleIdx >= 0 ? cardTitleIdx + 1 : filtered.length;
	filtered.splice(insertAt, 0, `${key}: ${JSON.stringify(value)}`);
	return raw.replace(match[0], `---\n${filtered.join('\n')}\n---`);
}

async function resolveImage(entry, id) {
	const url = commonsUrl(entry.file);
	try {
		const buf = await fetchWithRetry(url);
		if (buf.length < 500) throw new Error('too small');
		return buf;
	} catch {
		const fallbackQuery = id.split('/').pop().replace(/-/g, ' ');
		const thumb = await searchCommons(fallbackQuery);
		if (!thumb) throw new Error(`not found: ${entry.file}`);
		return fetchWithRetry(thumb);
	}
}

async function main() {
	fs.mkdirSync(cardsDir, { recursive: true });
	let ok = 0;

	for (const [id, entry] of Object.entries(ENTRIES)) {
		const slug = slugFromId(id);
		const outPath = path.join(cardsDir, `${slug}.webp`);
		const mdPath = path.join(docsDir, `${id}.md`);

		if (!fs.existsSync(mdPath)) {
			console.warn(`SKIP: ${id}`);
			continue;
		}

		process.stdout.write(`→ ${id} … `);
		try {
			await sleep(2200);
			const buffer = await resolveImage(entry, id);
			await downloadAndProcess(buffer, outPath);
			const cardImage = `/cards/${slug}.webp`;
			let raw = fs.readFileSync(mdPath, 'utf8');
			raw = upsertFrontmatterField(raw, 'cardImage', cardImage);
			raw = upsertFrontmatterField(raw, 'cardImageCredit', entry.credit);
			fs.writeFileSync(mdPath, raw, 'utf8');
			ok++;
			console.log('✓');
		} catch (err) {
			console.log(`✗ ${err.message}`);
		}
	}

	console.log(`\n${ok}/${Object.keys(ENTRIES).length} images`);
}

main();
