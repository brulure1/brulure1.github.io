/**
 * Prépare logo + favicons depuis la source détourée (chouette-mask-source.png).
 */
import sharp from 'sharp';

const INPUT = 'src/assets/chouette-mask-source.png';
const LOGO_OUT = 'src/assets/logo.png';

async function main() {
	let buf = await sharp(INPUT).ensureAlpha().png().toBuffer();
	buf = await sharp(buf).trim({ threshold: 10 }).png().toBuffer();
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

await main();
