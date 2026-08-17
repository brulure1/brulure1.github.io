---
title: Quel est le coût énergétique de la génération d'images et de vidéos par IA ?
cardImageCredit: "Derrick Coetzee from Berkeley, CA, USA — CC0, via Wikimedia Commons"
cardImage: "/cards/science--cout-energetique-ia-generative.webp"
cardTitle: "Quel est le coût **énergétique** de la **génération** **d'images** et de **vidéos** par **IA** ?"
description: "Consommation électrique mesurée de la génération d'images et vidéos par IA, comparée au streaming, à la publication sur réseaux sociaux et à des usages du quotidien (Hugging Face, IEA, ADEME)."
answerShort: "Très variable, mais la vidéo IA est de loin la plus coûteuse : une image générée consomme en moyenne 2,9 Wh (jusqu'à 11,5 Wh pour les modèles les plus lourds), soit environ 1/8 à 1/2 charge de smartphone. Une vidéo IA open-source coûte en moyenne 30 fois plus qu'une image (jusqu'à 110 Wh), et les estimations tierces sur Sora 2 avancent jusqu'à 936 Wh pour 10 secondes — soit l'équivalent de faire bouillir environ 8 bouilloires d'eau (110 Wh/L, Ademe), bien plus qu'une heure de streaming Netflix (~80 Wh, chiffre AIE)."
confidence: moyenne
category: science
tags: [intelligence-artificielle, energie, environnement, numerique, streaming]
sidebar:
  badge:
    text: Nuancé
    variant: caution
---

> **Réponse courte :** Très variable selon la tâche et le modèle, mais un ordre de grandeur clair se dégage : générer une **image** par IA consomme en moyenne **2,9 wattheures (Wh)** — jusqu'à 11,5 Wh pour les modèles les plus lourds (Hugging Face, étude *Power Hungry Processing*, 2023-2024) — soit entre 1/8 et 1/2 d'une charge de smartphone. Générer une **vidéo** par IA coûte **environ 30 fois plus** qu'une image en moyenne (jusqu'à 110 Wh pour un clip open-source de quelques secondes), et les estimations tierces sur des modèles fermés comme Sora 2 avancent jusqu'à **936 Wh pour une vidéo de 10 secondes** — soit l'équivalent de faire bouillir près de **8 bouilloires d'eau** (110 Wh/litre selon l'Ademe), bien plus qu'**une heure entière de streaming Netflix** (~80 Wh selon l'AIE).

## Contexte

La consommation énergétique de l'IA générative fait l'objet de nombreuses estimations, parfois contradictoires. Cette fiche s'appuie en priorité sur des **mesures directes publiées par des chercheurs indépendants** (notamment l'équipe de Sasha Luccioni chez Hugging Face, référence académique du domaine), complétées par des **estimations tierces prudentes** pour les modèles fermés (Sora, Veo) dont les entreprises ne communiquent aucun chiffre officiel — une limite méthodologique importante à garder en tête tout au long de la lecture.

## Données

### Génération d'images par IA (mesures directes, Hugging Face — *Power Hungry Processing*, 2023-2024)

| Modèle / tâche | Énergie par image (Wh) | Remarque |
|---|---|---|
| Moyenne toutes tâches d'IA generative d'image | **2,9 Wh** | Pour 1 000 inférences : 2,9 kWh |
| Modèle le plus efficace (études récentes 2025) | **0,09 à 0,36 Wh** | Selon résolution, nombre d'étapes de débruitage, quantification |
| Stable Diffusion XL (le plus gourmand testé) | **11,5 Wh** | Équivaut à environ une demi-charge de smartphone (0,022 kWh = charge complète) |
| Génération de texte (chatbot), à titre de comparaison | **0,047 Wh** | La génération d'image consomme en moyenne **62 fois plus** que la génération de texte |

**Facteurs qui font varier la consommation d'une image (étude 2025, *The Hidden Cost of an Image*) :** le choix du modèle (jusqu'à 46× d'écart), la résolution (×1,3 à ×4,7 par doublement), l'architecture (U-Net généralement plus économe que Transformer). Fait notable : la longueur ou le contenu du prompt texte n'a **pas d'effet significatif** mesuré sur la consommation.

### Génération de vidéos par IA (mesures directes sur modèles open-source, Hugging Face, 2025)

| Modèle | Énergie par clip (Wh, GPU) | Équivalent quotidien |
|---|---|---|
| AnimateDiff (clip très simple) | **0,11 Wh** | ≈ 50 minutes d'une ampoule LED de 10 W |
| LTX-Video | 3,2 Wh | — |
| CogVideoX-5b | 21,7 Wh | — |
| Mochi-1-preview | 46,8 Wh | ≈ 3 minutes de micro-ondes |
| WAN2.1-T2V-14B (le plus gourmand testé) | **93,8 Wh** | ≈ 7 charges complètes de smartphone |

**Constat global de l'étude :** la génération vidéo consomme en moyenne **30 fois plus qu'une image** et **2 000 fois plus qu'un texte** généré par IA — la vidéo est, de très loin, la tâche d'IA générative la plus énergivore mesurée à ce jour.

### Cas des modèles fermés grand public (Sora 2, Veo) : estimations tierces, à prendre avec prudence

**OpenAI et Google ne publient aucune donnée officielle de consommation** pour Sora ou Veo. Une estimation tierce, construite à partir de données de marché sur le matériel utilisé (analyste SemiAnalysis, relayée par Forbes), avance qu'une vidéo Sora 2 de 10 secondes nécessiterait environ **40 minutes de calcul sur une puce Nvidia H100** (1 300 W avec refroidissement), soit environ **0,936 kWh (936 Wh)** — et environ 466 grammes de CO2 (mix électrique britannique). **Cette estimation n'est ni confirmée ni démentie par OpenAI** et repose sur des hypothèses de tarification indirectes ; elle doit être lue comme un ordre de grandeur possible, pas une donnée certaine.

### Tableau de comparaison — mettre les chiffres en perspective

| Activité | Énergie consommée | Source |
|---|---|---|
| Générer 1 image par IA (moyenne) | **2,9 Wh** | Hugging Face, 2023-2024 |
| Générer 1 image par IA (modèle le plus gourmand) | 11,5 Wh | Hugging Face, 2023-2024 |
| Générer 1 vidéo IA open-source (moyenne à gourmande) | 0,1 à 94 Wh | Hugging Face, 2025 |
| Générer 1 vidéo Sora 2 de 10 secondes (estimation tierce, non confirmée) | ≈ 936 Wh | SemiAnalysis / Forbes (via analyse tierce) |
| Charger un smartphone (charge complète) | ≈ 22 Wh | Hugging Face (citant des données constructeur) |
| Faire bouillir 1 litre d'eau (bouilloire électrique) | ≈ 110 Wh | Ademe |
| 1 heure de streaming vidéo HD (Netflix, estimation la plus fiable) | **≈ 80 Wh** (fourchette 18-110 Wh selon appareil/réseau) | AIE (2020, actualisé) |
| 1 minute de défilement TikTok (lecture automatique vidéo) | ≈ 2,6 g CO2e/min (pas directement en Wh) | Étude Greenspector / Yotta, 2023 |
| 1 minute de défilement YouTube (hors génération) | ≈ 0,46 g CO2e/min | Étude Greenspector / Yotta, 2023 |

**Pour fixer les idées :** une seule vidéo Sora 2 (selon l'estimation tierce ci-dessus) consommerait autant qu'**environ 8 bouilloires d'eau bouillies successivement**, ou **plus de 11 heures de streaming Netflix**, ou **plus de 40 charges de smartphone** — pour 10 secondes de contenu généré.

## Nuances

- **Les données sur les modèles fermés grand public restent des estimations, pas des mesures** : contrairement aux modèles open-source (mesurables directement par des chercheurs via des outils comme CodeCarbon), la consommation réelle de Sora, Veo, Midjourney ou DALL-E n'est **jamais officiellement publiée** par les entreprises — toute comparaison avec ces outils repose sur des extrapolations à partir du matériel utilisé, pas sur une mesure directe.
- **Précédent édifiant sur les exagérations médiatiques : le cas du streaming vidéo.** En 2019, une étude du think tank français *The Shift Project* affirmait qu'une heure de Netflix consommait **6,1 kWh** d'électricité — un chiffre repris massivement dans la presse mondiale. L'Agence internationale de l'énergie (AIE) a ensuite démontré, via une analyse détaillée, que ce chiffre était **surestimé d'un facteur 30 à 80** : la réalité se situe plutôt autour de **0,08 kWh (80 Wh)**. Cet épisode invite à la **même prudence** pour les chiffres qui circulent aujourd'hui sur l'IA générative, notamment ceux basés sur des extrapolations de tiers plutôt que sur des mesures directes.
- **Immense variabilité selon les paramètres techniques** : pour une même tâche, l'écart de consommation entre modèles peut atteindre un facteur 46 à 800 selon les études — comparer « l'IA » à un usage du quotidien sans préciser le modèle et la résolution utilisés n'a donc qu'une valeur illustrative, pas une valeur de référence universelle.
- **La consommation par unité ne dit rien du volume total** : même une image « peu coûteuse » à l'unité peut représenter un impact considérable une fois multipliée par les usages à l'échelle mondiale (des centaines de millions de générations par jour sur les plateformes grand public) — un effet d'échelle qui s'applique aussi bien à l'IA qu'au streaming vidéo.
- **« Publier une vidéo sur les réseaux sociaux » est mal quantifié en tant que tel** : les études disponibles mesurent surtout l'empreinte de la **consultation/du défilement** (autoplay, scroll) plutôt que celle de l'acte de publication isolé (compression, upload, stockage) — un vrai manque de données pour une comparaison directe et équitable avec la génération par IA.

## Arguments courants en débat

| Argument | Ce que disent les données | Limite |
|---|---|---|
| « Générer une image par IA, c'est négligeable » | Vrai à l'unité pour la plupart des modèles (quelques Wh, moins qu'une charge de smartphone) | Ignore l'effet d'échelle : des centaines de millions d'images générées chaque jour dans le monde |
| « L'IA générative de vidéo va faire exploser la consommation électrique mondiale » | Cohérent avec les mesures : la vidéo consomme 30× plus qu'une image et 2 000× plus qu'un texte, et les usages explosent (Sora, Veo) | Les chiffres sur les modèles les plus utilisés (Sora, Veo) restent des estimations tierces non confirmées par les entreprises |
| « Le streaming vidéo est pire que l'IA » | Une heure de streaming (≈ 80 Wh) reste inférieure à une vidéo IA gourmande (jusqu'à 94-936 Wh selon le modèle) | Dépend fortement du modèle IA choisi et de la durée de streaming comparée — comparaison à manier avec prudence |

## Pensée critique

- **Deux biais opposés à éviter** : sous-estimer l'impact de l'IA générative en ne citant que les modèles les plus économes, ou le surestimer en citant sans recul des extrapolations tierces sur des modèles fermés comme s'il s'agissait de mesures confirmées — l'épisode du streaming Netflix en 2019 montre que les deux biais ont déjà eu lieu par le passé sur un sujet technologique comparable.
- **Le vrai enjeu est la transparence, pas seulement le chiffre** : la principale limite de ce débat aujourd'hui n'est pas tant l'ampleur exacte de la consommation, mais le fait que les plus grandes entreprises d'IA générative (OpenAI, Google, Midjourney) **ne publient aucune donnée officielle vérifiable** — une situation différente de celle du streaming, où l'AIE a pu mener une contre-expertise publique détaillée.
- **Conclusion honnête** : sur la base des données mesurées disponibles (modèles open-source), la génération d'image par IA a un coût énergétique unitaire modeste (quelques Wh, comparable à une fraction de charge de smartphone), tandis que la génération de vidéo est nettement plus coûteuse (jusqu'à l'équivalent de plusieurs bouilloires d'eau bouillies pour les modèles les plus lourds ou les estimations les plus hautes sur les outils fermés). Mais toute affirmation chiffrée sur les outils grand public les plus utilisés (Sora, Veo) doit être présentée comme une **estimation tierce non confirmée**, faute de transparence des entreprises concernées.

## Sources

1. [Luccioni, Jernite, Strubell (2023-2024) — Power Hungry Processing: Watts Driving the Cost of AI Deployment? (arXiv)](https://arxiv.org/html/2311.16863v3)
2. [The Hidden Cost of an Image: Quantifying the Energy Consumption of AI Image Generation (2025, arXiv)](https://arxiv.org/pdf/2506.17016)
3. [Hugging Face — How Much Power does a SOTA Open Video Model Use?](https://huggingface.co/blog/jdelavande/text-to-video-energy-cost)
4. [CNET — Your AI Videos Use Way More Energy Than Chatbots. It's a Big Problem](https://www.cnet.com/tech/services-and-software/your-ai-videos-use-way-more-energy-than-chatbots-its-a-big-problem/)
5. [Reclaimed Systems (Substack) — Every Sora AI video burns 1 Kilowatt hour (estimation tierce, méthodologie SemiAnalysis/Forbes)](https://reclaimedsystems.substack.com/p/every-sora-ai-video-burns-1-kilowatt)
6. [IEA — The carbon footprint of streaming video: fact-checking the headlines](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines)
7. [Carbon Brief — Factcheck: What is the carbon footprint of streaming video on Netflix?](https://www.carbonbrief.org/factcheck-what-is-the-carbon-footprint-of-streaming-video-on-netflix/)
8. [Alterna Énergie / Ademe — La bouilloire électrique : combien consomme-t-elle vraiment ?](https://www.alterna-energie.fr/comprendre-et-reduire-sa-consommation/bouilloire-electrique-consommation)
9. [Yotta — Empreinte carbone des réseaux sociaux : Instagram, TikTok, YouTube (étude Greenspector, 2023)](https://www.yotta.paris/blog/reseaux-sociaux-pollution-numerique)
10. [Carenews — Quel est l'impact carbone d'un influenceur ? (étude 1000heads/Footsprint)](https://www.carenews.com/carenews-info/news/quel-est-l-impact-carbone-d-un-influenceur)

## Historique

| Date | Modification |
|------|--------------|
| 2026-08-04 | Création de la fiche |
