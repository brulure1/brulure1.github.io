---
title: Méthodologie de recherche
description: "Comment les fiches de Scriptum Probat sont recherchées, sourcées et vérifiées : hiérarchie des sources, gestion des désaccords scientifiques, pièges évités."
answerShort: "Chaque fiche s'appuie sur une hiérarchie de sources (agences officielles et méta-analyses en priorité), croise plusieurs origines indépendantes, signale explicitement les désaccords scientifiques réels, et distingue les seuils réglementaires officiels des seuils militants."
confidence: elevee
category: guide
tags: [meta, methodologie, sources, transparence]
---

> **Réponse courte :** Chaque fiche est construite à partir d'une hiérarchie de sources (agences officielles et scientifiques en priorité, méta-analyses avant études isolées), avec vérification croisée systématique, distinction explicite entre consensus et désaccord scientifique réel, et transparence sur les limites des données quand elles existent.

## Pourquoi cette page

Un chiffre mal sourcé ou une source biaisée non signalée suffit à discréditer une fiche entière. Cette page documente publiquement les règles suivies pour rechercher, vérifier et rédiger chaque fiche — pour que vous puissiez juger vous-même de la solidité d'une affirmation, pas seulement nous faire confiance sur parole.

## Hiérarchie des sources utilisées

Toutes les sources ne se valent pas. Voici l'ordre de priorité appliqué :

| Niveau | Type de source | Exemples |
|---|---|---|
| 1 (le plus solide) | Agences scientifiques et sanitaires officielles, indépendantes | EFSA, OMS/CIRC, INSEE, ANSES, Ademe, académies nationales des sciences |
| 2 | Méta-analyses et revues systématiques évaluées par les pairs | Cochrane, revues publiées dans des journaux à comité de lecture |
| 3 | Études primaires (essais randomisés, études de cohorte) | Publications individuelles indexées (PubMed, arXiv pour les études techniques) |
| 4 | Médias spécialisés et fact-checkers reconnus | Carbon Brief, IEA (analyses), presse scientifique établie |
| 5 (à manier avec précaution) | Think tanks, ONG militantes, sites de vulgarisation non académiques | Utilisés seulement en complément, jamais comme source unique sur un chiffre central — et toujours avec mention explicite de leur positionnement |

**Règle appliquée** : plus une affirmation est centrale dans une fiche, plus elle doit reposer sur une source de niveau 1 ou 2. Les sources de niveau 5 ne sont citées que pour du contexte, jamais pour établir un chiffre clé sans corroboration indépendante.

## Ce que l'on fait systématiquement

- **Vérification croisée** : un chiffre surprenant ou central est recherché dans au moins deux sources indépendantes avant d'être intégré.
- **Année, périmètre et méthode précisés** : un chiffre sans date ni méthode n'a pas de valeur probante — chaque donnée est accompagnée de son contexte de mesure.
- **Distinction entre corrélation et causalité** : une association statistique n'est jamais présentée comme un lien de cause à effet sans que l'étude elle-même l'établisse.
- **Signalement des désaccords scientifiques réels** : quand deux agences de référence arrivent à des conclusions différentes sur un même sujet (par exemple le CIRC/OMS et l'EFSA sur la classification du glyphosate), la fiche le dit explicitement plutôt que de trancher artificiellement.
- **Distinction entre seuil réglementaire officiel et seuil militant** : certaines ONG (ex. Environmental Working Group) fixent leurs propres seuils de précaution, parfois des milliers de fois plus stricts que les limites légales fixées par les agences (EPA, EFSA). Les deux sont mentionnés, avec la méthode de calcul de chacun, pour éviter de confondre un seuil de plaidoyer avec une limite de sécurité officielle.
- **Prudence sur les estimations tierces non confirmées** : quand une donnée provient d'une extrapolation indépendante sur un système propriétaire non transparent (par exemple la consommation énergétique de modèles d'IA fermés comme Sora), la fiche le signale comme une estimation non confirmée, pas comme une mesure directe.
- **Historique des révisions** : chaque fiche conserve une table `Historique` documentant les mises à jour de chiffres ou de sources, pour assumer qu'une donnée peut évoluer ou avoir été corrigée.

## Pièges que l'on cherche activement à éviter

- **Le piège de l'exagération médiatique** : certains chiffres viraux se révèlent, une fois vérifiés à la source, largement surestimés (l'exemple de référence : l'estimation initiale de la consommation électrique du streaming Netflix par *The Shift Project*, démentie et corrigée d'un facteur 30 à 80 par l'Agence internationale de l'énergie). Ce précédent sert de rappel méthodologique pour tout chiffre nouveau et frappant qui circule sans contre-expertise.
- **Le piège du biais de financement non déclaré** : une source dont le financement ou l'affiliation politique/économique n'est pas transparent est signalée comme telle, et évitée comme source unique sur un sujet sensible.
- **Le piège de l'autorité mal attribuée** : une étude parfois présentée comme « une revue Cochrane » ou « une étude de l'OMS » sans l'être réellement — un abus de crédibilité fréquent, y compris via des résumés produits par des IA génératives, que l'on corrige en remontant systématiquement à la source primaire.
- **Le piège du chiffre sorti de son périmètre** : un résultat obtenu sur une population spécifique (ex. hommes avec dysfonction érectile diagnostiquée) n'est jamais généralisé à la population générale sans le préciser.
- **Le piège de la fausse neutralité** : citer des sources idéologiquement opposées sur un même sujet pour « équilibrer » n'est utile que si les deux sont d'égale qualité méthodologique — un think tank peu rigoureux n'est pas mis sur le même plan qu'une étude académique au prétexte de représenter « l'autre camp ».

## Limites assumées

- Certains sujets manquent de données solides ou récentes : dans ce cas, la fiche l'indique explicitement et affiche `confidence: faible`.
- Les chiffres évoluent : une fiche reflète l'état des connaissances à sa date de dernière mise à jour, visible en bas de page.
- Aucune fiche n'invente de chiffre : en l'absence de source fiable, l'incertitude est assumée plutôt que comblée par une estimation non sourcée.

## Voir aussi

- [Comment utiliser ce site](/comment-utiliser/) — navigation et contribution
- Le fichier `FICHE-TEMPLATE.md` à la racine du dépôt Git — gabarit technique suivi pour structurer chaque fiche

## Historique

| Date | Modification |
|------|--------------|
| 2026-08-04 | Création de la page |
