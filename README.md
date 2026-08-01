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

Une clé Google Maps JavaScript API restreinte est nécessaire pour afficher la carte (voir `.env.example`). Sans clé, l'application fonctionne normalement, avec la carte simplement désactivée.

## Licence

Projet privé.
