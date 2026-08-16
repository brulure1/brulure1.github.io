// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE_URL = 'https://brulure1.github.io';
const BASE_PATH = '/';

export default defineConfig({
	site: SITE_URL,
	base: BASE_PATH,
	redirects: {
		'/fiches/': '/',
	},
	integrations: [
		starlight({
			title: 'Scriptum Probat',
			description:
				'Référentiel francophone de chiffres sourcés — économie, société, santé. Verba volant, scriptum probat.',
			logo: {
				src: './src/assets/logo.png',
				alt: 'Scriptum Probat — chouette',
			},
			favicon: '/favicon.png',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Français',
					lang: 'fr',
				},
			},
			lastUpdated: true,
			credits: false,
			customCss: [
				'@fontsource/plus-jakarta-sans/400.css',
				'@fontsource/plus-jakarta-sans/600.css',
				'@fontsource/plus-jakarta-sans/700.css',
				'@fontsource/plus-jakarta-sans/800.css',
				'@fontsource/caveat/600.css',
				'@fontsource/jetbrains-mono/500.css',
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Navigation',
					items: [
						{ label: 'Accueil', slug: 'index' },
						{ label: 'Comment utiliser', slug: 'comment-utiliser' },
						{ label: 'Méthodologie', slug: 'methodologie' },
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
					label: 'Culture & médias',
					items: [{ autogenerate: { directory: 'culture' } }],
				},
				{
					label: 'Santé & nutrition',
					items: [{ autogenerate: { directory: 'sante' } }],
				},
				{
					label: 'Science & nature',
					items: [{ autogenerate: { directory: 'science' } }],
				},
			],
			head: [
				{
					tag: 'meta',
					attrs: { name: 'author', content: 'Scriptum Probat' },
				},
				{
					tag: 'link',
					attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
				},
			],
		}),
	],
});
