# IlhamStay - plateforme de location de logements

IlhamStay est une plateforme de location de logements de courte durée (studios, appartements, villas, chalets), avec recherche, réservation, avis et espace hôte.

C'est ma version personnelle du projet **ETNAir**, une plateforme réalisée en équipe à l'ETNA en 2026. Je l'ai reprise seule pour en faire IlhamStay : nouvelle identité, nouvelle page d'accueil et nouveaux composants interactifs.

![Page d'accueil d'IlhamStay](docs/screenshots/accueil.jpg)

## Ce que j'ai ajouté dans IlhamStay

- **Nouvelle identité** : nom, logo animé (une version pour le mode clair et une pour le mode sombre), navbar et footer refaits
- **Nouvelle page d'accueil** avec un titre animé et une section vidéo
- **Composants interactifs** : globe 3D (`Globe3D`), carte du monde (`WorldMap`), section de présentation (`VentureSection`)
- **Mode clair / sombre** et traductions mises à jour (FR / EN)
- Nettoyage de la configuration : secrets sortis du code, fichiers `.env.example`

## Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express 5, Prisma, PostgreSQL 15 |
| **Auth** | JWT, bcrypt, express-validator |
| **Tests** | Jest + Supertest (backend), Vitest + Cypress (frontend), K6 (charge) |
| **Infra** | Docker Compose, Kubernetes, nginx, MinIO (stockage S3) |
| **Monitoring** | Prometheus, Grafana |
| **CI/CD** | GitLab CI |

## Configuration

Copier les fichiers d'exemple avant de lancer en local :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

En production (Kubernetes), remplacer les valeurs `REMPLACER_PAR_...` dans `k8s/` par de vrais secrets.

---

## Démarrage rapide

### Prérequis
- Docker Desktop avec WSL2
- Node.js >= 18 (pour dev local)

### Lancer tout le projet

```bash
git clone https://github.com/codeWithIlham/ilhamstay.git
cd ilhamstay

docker compose up --build -d
```

Le seed se lance automatiquement au démarrage.

### Services disponibles

| Service | URL | Accès |
|---------|-----|-------|
| Frontend | http://localhost | Application web |
| API | http://localhost:3000 | REST API |
| Swagger | http://localhost:3000/api-docs | Documentation |
| pgAdmin | http://localhost:5050 | Interface DB |
| MinIO | http://localhost:9001 | Stockage images |
| Prometheus | http://localhost:9090 | Métriques |
| Grafana | http://localhost:3001 | Dashboards |

### Comptes de démonstration

Données fictives, créées par le seed. À ne jamais utiliser en production.

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@etnair.com | password |
| Hôte | james.carter@email.com | password |
| Hôte | sarah.wilson@email.com | password |
| Voyageur | oliver.davis@email.com | password |
| Voyageur | emma.martin@email.com | password |

---

## Structure du projet

```
etnair/
├── backend/                        # API Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma           # Modèles base de données
│   │   ├── seed.js                 # Données de démarrage
│   │   ├── faker-seed.js           # Seed volumineuse (Faker.js)
│   │   └── migrations/             # Migrations SQL
│   ├── src/
│   │   ├── config/                 # Swagger, Prisma, MinIO
│   │   ├── controllers/            # Logique des routes
│   │   ├── middlewares/            # Auth JWT, validation
│   │   ├── routes/                 # Définition des endpoints
│   │   ├── services/               # Logique métier
│   │   └── app.js                  # Application Express
│   ├── tests/                      # Tests Jest (39/39)
│   ├── utils/                      # Helpers JWT, bcrypt
│   ├── server.js                   # Point d'entrée
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                       # React + Vite
│   ├── src/
│   │   ├── components/             # Navbar, PropertyCard, Footer
│   │   ├── context/                # AuthContext, ThemeContext
│   │   ├── pages/                  # Home, Search, Detail, Admin...
│   │   └── services/               # API Axios
│   ├── cypress/                    # Tests E2E
│   │   └── e2e/                    # auth, search, booking
│   ├── src/__tests__/              # Tests unitaires Vitest
│   ├── nginx.conf                  # Reverse proxy
│   └── Dockerfile
│
├── k8s/                            # Kubernetes manifests
│   ├── namespace.yml
│   ├── postgres.yml
│   ├── api.yml                     # Deployment + HPA
│   ├── frontend.yml                # Deployment + HPA
│   ├── ingress.yml                 # TLS + routing
│   ├── minio.yaml
│   ├── configmap.yaml
│   ├── portainer.yml
│   ├── gitlab-runner.yml
│   ├── backup-cronjob.yml          # Backup PostgreSQL quotidien
│   └── deploy.sh                   # Script de déploiement
│
├── monitoring/
│   ├── prometheus.yml              # Config scrape
│   ├── prometheus-rules.yml        # Règles d'alertes
│   └── grafana/provisioning/       # Datasources auto
│
├── k6/
│   ├── smoke-test.js               # Validation rapide
│   └── load-test.js                # Test de charge (5→50 VUs)
│
├── docs/
│   ├── USER_GUIDE.md               # Guide utilisateur
│   ├── DB_SCHEMA.md                # Schéma DBML (→ dbdiagram.io)
│   └── ETNAir_DB_Schema.pdf        # Diagramme PDF
│
├── .gitlab-ci.yml                  # Pipeline CI/CD
├── docker-compose.yml              # 7 services complets
├── schema.sql                      # DDL PostgreSQL
├── seed.sql                        # Données initiales SQL
├── dump.sql                        # pg_dump de la base
└── ETNAir.postman_collection.json  # Collection Postman
```

---

## Endpoints API principaux

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/auth/register` | Créer un compte | Non |
| POST | `/auth/login` | Connexion → JWT + user | Non |
| GET | `/annonces` | Lister (pagination, filtres) | Non |
| GET | `/annonces/:id` | Détail logement | Non |
| POST | `/annonces` | Créer logement | Host/Admin |
| PUT | `/annonces/:id` | Modifier | Host/Admin |
| DELETE | `/annonces/:id` | Supprimer | Host/Admin |
| GET | `/bookings` | Mes réservations | Oui |
| POST | `/bookings` | Réserver | Oui |
| DELETE | `/bookings/:id` | Annuler | Oui |
| GET | `/reviews/property/:id` | Avis | Non |
| POST | `/reviews` | Poster un avis | Oui |
| POST | `/upload` | Upload image → MinIO | Oui |

Filtres disponibles : `?city=Paris&min_price=50&max_price=200&property_type=apartment&min_guests=2&page=1&limit=9`

---

## Tests

### Backend - Jest (39/39)
```bash
cd backend
npm install
npm test
```

### Frontend - Vitest
```bash
cd frontend
npm install
npm test                  # Tests unitaires
npm run test:coverage     # Avec couverture
```

### E2E - Cypress
```bash
cd frontend
npm run dev               # Vite doit tourner
npm run test:e2e:open     # Interface graphique
npm run test:e2e          # Mode headless
```

### Tests de charge - K6
```bash
k6 run k6/smoke-test.js
k6 run k6/load-test.js
```

---

## Seed et données fictives

```bash
# Seed de démarrage (lancé automatiquement par Docker)
cd backend && npm run seed

# Seed volumineuse avec Faker.js (20 users)
npm run seed:faker

# Seed volumineuse étendue (50 users)
npm run seed:faker:big
```

---

## Base de données

### Connexion pgAdmin
- URL : http://localhost:5050
- Email : admin@etnair.com - Mot de passe : admin
- Serveur : `localhost:5433` | User : `etnair_user` | Pass : `etnair_pass`

### Dump / Restauration
```bash
# Générer un dump
docker exec etnair_db pg_dump -U etnair_user -d etnair_db > dump.sql

# Restaurer
docker exec -i etnair_db psql -U etnair_user -d etnair_db < dump.sql
```

---

## Kubernetes

```bash
# Déploiement complet
bash k8s/deploy.sh

# Vérifier
kubectl get pods -n etnair
kubectl get hpa -n etnair
```

Voir `k8s/README.md` pour le détail.

---

## CI/CD - GitLab

Pipeline GitLab CI (fichier `.gitlab-ci.yml`), à brancher sur une instance GitLab :
1. `test` - Jest backend + Vitest frontend + audit sécurité
2. `build` - Images Docker → GitLab Registry
3. `deploy` - Staging (auto sur `develop`) · Production (manuel sur `main`)
4. `performance` - K6 smoke test (auto) · Load test (manuel)

---

## Origine du projet

La base du projet (API, base de données, authentification, infrastructure) vient d'**ETNAir**, un projet d'équipe de l'ETNA. IlhamStay en est ma reprise personnelle.
