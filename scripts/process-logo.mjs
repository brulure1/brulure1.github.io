/**
 * Détourage logo chouette — fond papier/gris + halo blanc (surtout en bas).
 */
import sharp from 'sharp';
import { mkdir } from 'fs/promises';

const INPUT = 'src/assets/chouette-mask-source.png';
const LOGO_OUT = 'src/assets/logo.png';

function colorStats(r, g, b) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const sat = max === 0 ? 0 : (max - min) / max;
	const light = (r + g + b) / 3;
	return { sat, light };
}

/** Fond connecté aux bords (papier blanc / gris neutre). */
function isBorderBackground(r, g, b) {
	const { sat, light } = colorStats(r, g, b);
	if (light > 215 && sat < 0.22) return true;
	if (sat < 0.07 && light >= 75 && light <= 245) return true;
	return false;
}

/** Halo blanc/crème collé au masque. */
function isFringe(r, g, b, y, height) {
	const { sat, light } = colorStats(r, g, b);
	const bottomBias = y / height > 0.55 ? 18 : 0;
	if (light > 185 - bottomBias && sat < 0.32) return true;
	if (light > 165 - bottomBias && sat < 0.12) return true;
	return false;
}

function floodFillBackground(px, width, height) {
	const visited = new Uint8Array(width * height);
	const q = [];

	const seed = (x, y) => {
		const i = y * width + x;
		if (visited[i]) return;
		const p = i * 4;
		if (isBorderBackground(px[p], px[p + 1], px[p + 2])) {
			visited[i] = 1;
			q.push([x, y]);
		}
	};

	for (let x = 0; x < width; x++) {
		seed(x, 0);
		seed(x, height - 1);
	}
	for (let y = 0; y < height; y++) {
		seed(0, y);
		seed(width - 1, y);
	}

	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
	];

	while (q.length) {
		const [x, y] = q.pop();
		for (const [dx, dy] of dirs) {
			const nx = x + dx;
			const ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
			const i = ny * width + nx;
			if (visited[i]) continue;
			const p = i * 4;
			if (isBorderBackground(px[p], px[p + 1], px[p + 2])) {
				visited[i] = 1;
				q.push([nx, ny]);
			}
		}
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (visited[y * width + x]) px[(y * width + x) * 4 + 3] = 0;
		}
	}
}

/** Halo blanc/crème — pixels très clairs et peu saturés (résidu du fond). */
function removeWhiteHalo(px, width, height) {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			if (px[i + 3] === 0) continue;
			const { sat, light } = colorStats(px[i], px[i + 1], px[i + 2]);
			if (light > 224 && sat < 0.12) px[i + 3] = 0;
			else if (light > 208 && sat < 0.07) px[i + 3] = 0;
		}
	}
}

/** Érosion du halo depuis les pixels déjà transparents. */
function erodeFringe(px, width, height, passes = 8) {
	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
	];

	for (let pass = 0; pass < passes; pass++) {
		const copy = Buffer.from(px);
		const extraPasses = pass >= 4 ? 1 : 0;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const i = (y * width + x) * 4;
				if (copy[i + 3] === 0) continue;

				const r = copy[i];
				const g = copy[i + 1];
				const b = copy[i + 2];

				let touchesTransparent = false;
				for (const [dx, dy] of dirs) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
					if (copy[(ny * width + nx) * 4 + 3] === 0) touchesTransparent = true;
				}

				if (!touchesTransparent) continue;

				const bottomZone = y / height > 0.5;
				const passesHere = bottomZone ? passes + extraPasses : passes;

				if (isFringe(r, g, b, y, height) || (bottomZone && pass < passesHere && colorStats(r, g, b).light > 175)) {
					px[i + 3] = 0;
				}
			}
		}
	}
}

/** Passe finale agressive en bas : tout pixel très clair proche du transparent. */
function cleanBottomZone(px, width, height) {
	const dirs = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
		[1, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
	];
	const yStart = Math.floor(height * 0.42);

	for (let pass = 0; pass < 6; pass++) {
		const copy = Buffer.from(px);
		for (let y = yStart; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const i = (y * width + x) * 4;
				if (copy[i + 3] === 0) continue;

				let touchesTransparent = false;
				for (const [dx, dy] of dirs) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
					if (copy[(ny * width + nx) * 4 + 3] === 0) touchesTransparent = true;
				}
				if (!touchesTransparent) continue;

				const { sat, light } = colorStats(copy[i], copy[i + 1], copy[i + 2]);
				if (light > 155 && sat < 0.35) px[i + 3] = 0;
			}
		}
	}
}

async function main() {
	const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const px = Buffer.from(data);
	const { width, height } = info;

	floodFillBackground(px, width, height);
	removeWhiteHalo(px, width, height);
	erodeFringe(px, width, height, 10);
	cleanBottomZone(px, width, height);
	removeWhiteHalo(px, width, height);
	erodeFringe(px, width, height, 6);

	let buf = await sharp(px, { raw: { width, height, channels: 4 } })
		.png()
		.toBuffer();

	buf = await sharp(buf).trim({ threshold: 8 }).png().toBuffer();
	await sharp(buf).toFile(LOGO_OUT);

	await sharp(LOGO_OUT)
		.resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile('public/favicon.png');

	await sharp(LOGO_OUT)
		.resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
		.png()
		.toFile('public/apple-touch-icon.png');

	console.log('Logo traité →', LOGO_OUT);
}

await mkdir('scripts', { recursive: true });
await main();
