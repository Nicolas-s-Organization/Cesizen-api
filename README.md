# CESIZen API

API REST back-end pour l'application CESIZen — plateforme de gestion du stress et du bien-être mental.

## Stack technique

- **Runtime :** Node.js
- **Framework :** Express.js 5
- **Langage :** TypeScript
- **ORM :** Prisma 7
- **Base de données :** PostgreSQL
- **Authentification :** JWT (access token + refresh token)
- **Validation :** Zod
- **Upload fichiers :** Multer

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [PostgreSQL](https://www.postgresql.org/) v14 ou supérieur
- npm (inclus avec Node.js)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Nicolas-s-Organization/Cesizen-api.git
cd Cesizen-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://<utilisateur>:<mot_de_passe>@localhost:5432/Cesizen?schema=public
NODE_ENV=development
ACCESS_TOKEN_SECRET=<votre_secret_access>
ACCESS_TOKEN_EXPIRES_IN=5m
REFRESH_TOKEN_SECRET=<votre_secret_refresh>
REFRESH_TOKEN_EXPIRES_IN=7d
```

> Remplacez `<utilisateur>`, `<mot_de_passe>` et les secrets par vos propres valeurs.



### 4. Appliquer les migrations Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

## Lancement

### Mode développement (avec hot-reload)

```bash
npm run dev
```

L'API démarre sur `http://localhost:3000`.


## Endpoints principaux

| Ressource | Méthode | Route | Auth |
|---|---|---|---|
| Inscription | POST | `/auth/register` | Non |
| Connexion | POST | `/auth/login` | Non |
| Refresh token | POST | `/auth/refresh` | Non |
| Profil | GET | `/auth/me` | Oui |
| Utilisateurs | GET | `/users` | Admin |
| Articles | GET/POST/PATCH/DELETE | `/articles` | Mixte |
| Catégories | GET/POST/PUT/DELETE | `/categories` | Mixte |
| Émotions | GET/POST/PATCH/DELETE | `/emotions` | Mixte |
| Tracker | GET/POST/PATCH/DELETE | `/trackeritems` | Oui |
| Rapports | GET | `/trackeritems/reports` | Oui |

## Structure du projet

```
Cesizen-api/
├── app.ts                 # Point d'entrée
├── prisma/
│   └── schema.prisma      # Schéma de la base de données
├── controllers/           # Contrôleurs (logique HTTP)
├── services/              # Services (logique métier)
├── routes/                # Définition des routes
├── middlewares/            # Middleware (auth, rôles, validation, upload)
├── schemas/               # Schémas de validation Zod
├── lib/                   # Librairies utilitaires
├── utils/                 # Fonctions utilitaires
└── uploads/               # Fichiers uploadés
```

## Architecture MVC

- **Model :** Prisma ORM (schema.prisma + client généré)
- **View :** Réponses JSON (API REST, pas de template)
- **Controller :** Contrôleurs dans `controllers/` + logique métier dans `services/`
