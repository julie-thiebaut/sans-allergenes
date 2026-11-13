# Sans Allergènes

Application web listant des restaurants à Paris et les informations disponibles sur les allergènes de leurs plats.

MVP statique : aucun compte, aucun avis, aucune contribution publique, aucun backend, aucune base de données.

## Données

**`public/data/` publie le jeu réel** : des établissements parisiens dont le document allergènes a été téléchargé, dont **le contenu a été vérifié** (pas seulement son lien), et relu un par un. Il est construit par un pipeline d'import qui vit dans un dépôt séparé, `sans-allergenes-data`, avec le recensement complet des établissements parisiens et le verdict de chacun ; `npm run publish:data` (depuis ce dépôt-là) copie son résultat ici, et `npm run validate:data` (depuis celui-ci) le revérifie à l'arrivée.

Le schéma garde par ailleurs un jeu de démonstration, marqué `isDemoData` et signalé comme tel dans l'interface : quelques établissements fictifs qui servent aux tests, aux fixtures et au développement, jamais mêlés aux vrais.

### Ce que chaque fiche dit de sa source

- `source.kind` vaut `published` ou `on_request`. La distinction est éditoriale : `published` veut dire que **n'importe qui peut aller vérifier**, et c'est ce que l'interface met en avant ; `on_request` désigne une information communiquée par l'établissement, que personne d'autre ne peut contrôler. Le schéma refuse une source « publiée » sans URL et une source « sur demande » qui en porte une.
- `additionalSources` liste les autres documents publiés par l'enseigne, quand la carte a été transcrite depuis une source et que la fiche PDF existe par ailleurs.
- `allergenCoverageNotice` dit, en rouge et à part de la description, ce que la déclaration **ne couvre pas**. Les plats hors couverture ne sont jamais listés.
- Un établissement qui publie ses allergènes sans reprise plat par plat renvoie à sa source ; il n'est jamais présenté comme n'ayant aucune information.
- Un restaurant qui ne publie **aucun** allergène (`allergenInformationAvailable: false`) n'a une fiche que s'il publie une adresse e-mail sur son site : sa page invite le visiteur à lui écrire pour qu'il mette sa liste en ligne, message prérempli. La case « Informations allergènes disponibles uniquement » est cochée par défaut, et ces restaurants n'apparaissent dans la liste et sur la carte qu'une fois décochée (`?hasAllergenInfo=0`).

## Stack

React · Vite · TypeScript · Tailwind CSS · React Router · Zod · Vitest · Playwright · GitHub Actions · GitHub Pages

## Démarrage

```bash
npm install
cp .env.example .env
npm run dev
```

Ouvre `http://localhost:5173`.

## Scripts

| Commande                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Serveur de développement                     |
| `npm run build`         | Build de production (avec pré-rendu SEO)     |
| `npm run preview`       | Sert le build de production localement       |
| `npm run lint`          | ESLint                                       |
| `npm run typecheck`     | Vérification TypeScript                      |
| `npm run validate:data` | Valide `restaurants.json` et les menus (Zod) |
| `npm run test:unit`     | Tests unitaires et composants (Vitest)       |
| `npm run test:e2e`      | Tests end-to-end (Playwright)                |
| `npm run format`        | Prettier                                     |

## Structure

```
public/data/           # restaurants.json + menus/*.json
src/                   # application React
scripts/               # scripts de build (validation des données, pré-rendu SEO)
tests/                 # tests unitaires, composants, e2e
.github/workflows/     # CI/CD
```

Les données arrivent ici par le dépôt d'import, jamais écrites à la main.

## Pages légales

`/mentions-legales` et `/confidentialite` sont des routes de l'application, pré-rendues et présentes dans le sitemap comme les autres. La page confidentialité décrit le mécanisme de consentement décrit plus bas ; les deux se modifient ensemble.

## Métadonnées de partage

Chaque page porte son jeu complet `og:` / `twitter:` et son URL canonique, écrit à deux endroits : par `<Seo>` lors de la navigation dans l'application, et par `scripts/prerender.ts` dans le HTML servi aux robots qui n'exécutent pas de JavaScript. Les deux marquent leurs balises `data-seo-managed`, ce qui permet au pré-rendu de retirer exactement celles-là avant d'injecter les siennes — sans quoi la page finale en porterait deux exemplaires.

L'image de partage, `public/og-image.png`, est la même pour toutes les pages. Elle se régénère avec `npm run share-image`, après un changement de son texte ou de l'illustration.

## Variable d'environnement

Une clé Google restreinte est nécessaire pour afficher la carte et proposer la recherche d'adresse (voir `.env.example`). Elle doit autoriser deux API : **Maps JavaScript API** (carte) et **Places API (New)** (suggestions d'adresses et récupération de la position sélectionnée). Sans clé, l'application fonctionne normalement, avec la carte simplement désactivée.

Des quotas journaliers stricts sont configurés côté Google Cloud sur chaque métrique facturable, et les métriques inutilisées sont plafonnées à zéro, afin de rester dans le palier gratuit.

### Deux clés, une par environnement

| Clé                             | Référents autorisés                                  |
| ------------------------------- | ---------------------------------------------------- |
| `Sans Allergenes - Maps JS API` | `https://sans-allergenes.fr/*`                       |
| `Sans Allergenes - Dev local`   | `http://localhost:5173/*`, `http://localhost:4173/*` |

Les deux autorisent les deux mêmes API et rien d'autre. Mettez la clé de développement dans votre `.env` local ; celle de production ne fonctionne volontairement pas sur `localhost`.

Une clé de navigateur est publique par nature, puisqu'elle part dans le HTML de la page. La restriction par référent est la seule chose qui empêche un tiers de la réutiliser depuis son domaine, et `localhost` est un référent que n'importe qui peut fabriquer. Autoriser `localhost` sur la clé de production annulerait donc cette protection pour tout le monde, pas seulement pour vous : **ne l'y rajoutez pas**, créez une clé dédiée.

**Les quotas ne sont pas séparables par clé.** L'unité du plafond journalier est `1/d/{project}` : les 300 requêtes par jour sont partagées entre les deux clés. Cela borne la dépense quelle que soit la clé qui fuite, mais un usage local intensif consomme l'allocation de production. Pour isoler vraiment les deux, il faudrait un second projet Google Cloud avec sa propre facturation et ses propres quotas.

## Google Analytics

La mesure d'audience GA4 utilise l'identifiant public `G-XN9KPCDL8P`, configuré dans le workflow de production. Elle reste désactivée si `VITE_GOOGLE_ANALYTICS_ID` est vide, ce qui est le cas en développement local.

**Rien ne part avant acceptation** : tant que le visiteur n'a pas répondu, la balise n'est pas chargée, aucun cookie `_ga` n'est déposé et aucune requête ne quitte la page — refuser ne coûte donc rien, puisque rien n'avait commencé. Le choix est mémorisé six mois, et « Gérer les cookies » en pied de page permet de le rouvrir : un consentement qu'on ne peut pas retirer n'en est pas un.

Réglages à appliquer au flux Web dans Google Analytics :

1. dans **Mesure améliorée**, désactiver toutes les mesures automatiques, en particulier les changements de page fondés sur l'historique du navigateur ; l'application envoie elle-même une vue à chaque changement de route ;
2. dans **Masquage des données**, masquer les paramètres d'URL `avoid`, `cuisine`, `veg`, `vegan` et `hasAllergenInfo` comme protection supplémentaire ;
3. conserver les données au niveau utilisateur et événement pendant **2 mois** ;
4. ne pas relier la propriété à Google Ads et laisser Google Signals désactivé.

Le code retire déjà **toute** la chaîne de paramètres des URL envoyées à Analytics — ces paramètres portent les allergènes que le visiteur évite, donc une donnée de santé, qui n'a rien à faire dans un compte Analytics. Il limite aussi les cookies Analytics à treize mois et ne compte pas les changements de filtres comme des vues supplémentaires. Les réglages ci-dessus sont une seconde barrière, pas la première.

## Licence

Projet privé.
