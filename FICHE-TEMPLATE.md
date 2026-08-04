# Template de fiche — Scriptum Probat

Copier ce template pour chaque nouvelle fiche dans `src/content/docs/{categorie}/nom-du-fichier.md`.

```yaml
---
title: "[Question sous forme de titre ?]"
description: "[Une phrase résumant la réponse]"
answerShort: "[Réponse en une phrase avec chiffre(s) clé(s) et source]"
confidence: elevee  # elevee | moyenne | faible | controverse
category: economie  # economie | travail | societe | sante | culture
tags: [mot-cle1, mot-cle2]
---
```

Corps Markdown :

```markdown
> **Réponse courte :** [Reformulation de answerShort avec gras sur les chiffres]

## Contexte
[Définitions, périmètre, ce que la question ne couvre pas]

## Données
[Tableaux ou listes avec chiffre + source + année + méthode]

## Nuances
[Ce que le chiffre ne dit pas, biais, retard des données]

## Arguments courants en débat
| Argument | Ce que disent les données | Limite |
|----------|----------------------------|--------|
| « ... » | ... | ... |

## Pensée critique
- **Lecture possible à gauche :** ...
- **Lecture possible à droite :** ...
- **Conclusion honnête :** ...

## Sources
1. [Nom](URL) — description courte
2. ...

## Historique
| Date | Modification |
|------|--------------|
| YYYY-MM-DD | Création de la fiche |
```

## Règles pour le LLM

1. **Ne jamais inventer** un chiffre — si source introuvable, le dire et mettre `confidence: faible`.
2. **Toujours** préciser année, périmètre (France, UE…), définition.
3. **Contre-exemples** obligatoires dans « Pensée critique ».
4. Nom de fichier : kebab-case, sans accents (`seuil-1-pourcent-riches.md`).
5. Retirer `draft: true` une fois la fiche complète et sourcée.
