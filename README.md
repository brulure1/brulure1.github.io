# Scriptum Probat

> *Verba volant, scriptum probat.* — L'écrit prouve.

Référentiel francophone de **chiffres sourcés** : économie, société, santé. Neutre, nuancé, avec contre-exemples.

## Stack

- [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- Contenu en Markdown (`src/content/docs/`)
- Hébergement gratuit via **GitHub Pages**

## Développement local

```powershell
cd scriptum-probat
npm install
npm run dev
```

Site local : http://localhost:4325/scriptum-probat/ (ou port affiché)

## Ajouter une fiche (Cursor)

```
Ajoute une fiche : [QUESTION]
Catégorie : economie | travail | societe | sante
Suis FICHE-TEMPLATE.md — sources obligatoires, ton neutre.
```

## Déploiement GitHub Pages

1. Crée un repo GitHub **`scriptum-probat`** (public)
2. Édite `astro.config.mjs` si tu changes de compte ou de nom de repo
3. Push le code sur `main`
4. GitHub → **Settings → Pages → Source : GitHub Actions**
5. URL : `https://brulure1.github.io/`

## Structure

```
src/content/docs/
├── index.mdx              # Accueil
├── comment-utiliser.md    # Guide
├── economie/              # Fiches économie
├── travail/
├── societe/
└── sante/
```

## Anonymat

- Pas de nom personnel dans le site ni les commits (email GitHub noreply recommandé)
- Titre du site : Scriptum Probat uniquement
