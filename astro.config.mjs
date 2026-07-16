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
				'@fontsource/plus-jakarta-sans/400.css',
				'@fontsource/plus-jakarta-sans/600.css',
				'@fontsource/plus-jakarta-sans/700.css',
				'@fontsource/plus-jakarta-sans/800.css',
				'@fontsource/jetbrains-mono/500.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Navigation',
					items: [
						{ label: 'Accueil', slug: 'index' },
						{ label: 'Toutes les fiches', slug: 'fiches' },
						{ label: 'Comment utiliser', slug: 'comment-utiliser' },
					],
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
