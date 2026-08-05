# Sans Allergènes

Application web listant des restaurants à Paris et les informations disponibles sur les allergènes de leurs plats.

MVP statique : aucun compte, aucun avis, aucune contribution publique, aucun backend, aucune base de données.

**Toutes les données de restaurants et de menus de ce dépôt sont fictives** (badge « Donnée de démonstration » dans l'interface). Aucune information allergène n'a été inventée pour un vrai restaurant.

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

| Commande               | Description                                  |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Serveur de développement                       |
| `npm run build`         | Build de production (avec pré-rendu SEO)       |
| `npm run preview`       | Sert le build de production localement         |
| `npm run lint`          | ESLint                                         |
| `npm run typecheck`     | Vérification TypeScript                        |
| `npm run validate:data` | Valide `restaurants.json` et les menus (Zod)   |
| `npm run test:unit`     | Tests unitaires et composants (Vitest)         |
| `npm run test:e2e`      | Tests end-to-end (Playwright)                  |

## Structure

```
public/data/          # restaurants.json + menus/*.json
src/                   # application React
scripts/               # scripts de build (validation des données, pré-rendu SEO)
tests/                 # tests unitaires, composants, e2e
.github/workflows/     # CI/CD
```

## Variable d'environnement

Une clé Google restreinte est nécessaire pour afficher la carte et proposer la recherche d'adresse (voir `.env.example`). Elle doit autoriser deux API : **Maps JavaScript API** (carte) et **Places API** (suggestions d'adresses). Sans clé, l'application fonctionne normalement, avec la carte simplement désactivée.

Des quotas journaliers stricts sont configurés côté Google Cloud sur chaque métrique facturable, et les métriques inutilisées sont plafonnées à zéro, afin de rester dans le palier gratuit.

### Deux clés, une par environnement

| Clé | Référents autorisés |
| --- | --- |
| `Sans Allergenes - Maps JS API` | `https://sans-allergenes.fr/*` |
| `Sans Allergenes - Dev local` | `http://localhost:5173/*`, `http://localhost:4173/*` |

Les deux autorisent les deux mêmes API et rien d'autre. Mettez la clé de développement dans votre `.env` local ; celle de production ne fonctionne volontairement pas sur `localhost`.

Une clé de navigateur est publique par nature, puisqu'elle part dans le HTML de la page. La restriction par référent est la seule chose qui empêche un tiers de la réutiliser depuis son domaine, et `localhost` est un référent que n'importe qui peut fabriquer. Autoriser `localhost` sur la clé de production annulerait donc cette protection pour tout le monde, pas seulement pour vous : **ne l'y rajoutez pas**, créez une clé dédiée.

**Les quotas ne sont pas séparables par clé.** L'unité du plafond journalier est `1/d/{project}` : les 300 requêtes par jour sont partagées entre les deux clés. Cela borne la dépense quelle que soit la clé qui fuite, mais un usage local intensif consomme l'allocation de production. Pour isoler vraiment les deux, il faudrait un second projet Google Cloud avec sa propre facturation et ses propres quotas.

## Licence

Projet privé.
