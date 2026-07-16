// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE_URL = 'https://brulure1.github.io';
const BASE_PATH = '/';

export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	integrations: [
		starlight({
			title: 'Scriptum Probat',
			description:
				'Référentiel francophone de chiffres sourcés — économie, société, santé. Verba volant, scriptum probat.',
			logo: {
				src: './src/assets/logo.svg',
				alt: 'Scriptum Probat',
			},
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Français',
					lang: 'fr',
				},
			},
			lastUpdated: true,
			customCss: [
				'@fontsource/cormorant-garamond/500.css',
				'@fontsource/cormorant-garamond/600.css',
				'@fontsource/source-sans-3/400.css',
				'@fontsource/source-sans-3/600.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Guide',
					items: [{ label: 'Comment utiliser', slug: 'comment-utiliser' }],
				},
				{
					label: 'Économie & fiscalité',
					items: [{ autogenerate: { directory: 'economie' } }],
				},
				{
					label: 'Travail & inégalités',
					items: [{ autogenerate: { directory: 'travail' } }],
				},
				{
					label: 'Société & justice',
					items: [{ autogenerate: { directory: 'societe' } }],
				},
				{
					label: 'Santé & nutrition',
					items: [{ autogenerate: { directory: 'sante' } }],
				},
			],
			head: [
				{
					tag: 'meta',
					attrs: { name: 'author', content: 'Scriptum Probat' },
				},
			],
		}),
	],
});
