# COVAM — Plateforme de Transport de Marchandises

Application web de mise en relation entre **clients** (expéditeurs) et **transporteurs**, avec un espace d'administration complet.

---

## Stack technique

| Couche           | Technologie                             |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 16 (App Router + Pages API)     |
| Langage          | TypeScript 5                            |
| Base de données  | PostgreSQL                              |
| ORM              | Prisma 7 (adapter `@prisma/adapter-pg`) |
| Authentification | NextAuth.js v4 (JWT)                    |
| UI               | Tailwind CSS v4 + shadcn/ui             |
| Formulaires      | React Hook Form + Zod                   |
| Data fetching    | TanStack Query v5                       |

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [pnpm](https://pnpm.io/) v8 ou supérieur (`npm i -g pnpm`)
- Une instance **PostgreSQL** accessible (locale ou distante)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-repo> covam-project
cd covam-project
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer les variables d'environnement

Copiez le fichier d'exemple et renseignez vos valeurs :

```bash
cp .example.env .env
```

Contenu du fichier `.env` :

```env
# Connexion PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/covam?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="une-chaine-aleatoire-longue-et-secrete"
```

> Pour générer un `NEXTAUTH_SECRET` sécurisé :
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Générer le client Prisma

```bash
pnpm prisma generate
```

### 5. Appliquer les migrations

```bash
pnpm prisma migrate deploy
```

> En développement, vous pouvez utiliser `pnpm prisma migrate dev` pour créer de nouvelles migrations.

### 6. Alimenter la base de données (seed)

```bash
pnpm seed
```

Cela crée des utilisateurs de démonstration pour chaque rôle :

| Rôle         | Email                   | Mot de passe   |
| ------------ | ----------------------- | -------------- |
| Admin        | `admin@covam.mg`        | `admin123`     |
| Transporteur | `transporteur@covam.mg` | `transport123` |
| Client       | `client@covam.mg`       | `client123`    |

### 7. Lancer le serveur de développement

```bash
pnpm dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

---

## Structure du projet

```
app/                  # Pages Next.js (App Router)
  admin/              # Espace administrateur
  client/             # Espace client
  transporteur/       # Espace transporteur
  auth/               # Pages connexion / inscription
components/
  shared/             # Composants réutilisables (sidebar, modals, table…)
  ui/                 # Composants shadcn/ui
hooks/                # Hooks TanStack Query (data fetching)
lib/                  # Prisma, NextAuth, middlewares, utilitaires
pages/api/            # Routes API REST (Next.js Pages Router)
prisma/
  schema.prisma       # Schéma de base de données
  seed.ts             # Script de données initiales
  migrations/         # Historique des migrations
types/                # Types TypeScript globaux
public/uploads/       # Fichiers uploadés (images de transport, avatars)
```

---

## Scripts disponibles

| Commande                  | Description                      |
| ------------------------- | -------------------------------- |
| `pnpm dev`                | Serveur de développement         |
| `pnpm build`              | Build de production              |
| `pnpm start`              | Serveur de production            |
| `pnpm lint`               | Vérification ESLint              |
| `pnpm seed`               | Alimenter la base de données     |
| `pnpm prisma studio`      | Interface visuelle Prisma        |
| `pnpm prisma migrate dev` | Créer et appliquer une migration |

---

## Rôles utilisateurs

- **Admin** — gestion globale des utilisateurs, transports, annonces, réservations et paiements
- **Transporteur** — gestion de ses véhicules, publication d'annonces, suivi des réservations
- **Client** — consultation des annonces, réservation de transport, suivi des cargaisons et paiements

---

## Déploiement en production

1. Configurez les variables d'environnement sur votre hébergeur
2. Exécutez `pnpm prisma migrate deploy` pour appliquer les migrations
3. Lancez `pnpm build` puis `pnpm start`

> Assurez-vous que le dossier `public/uploads/` est persistant sur votre serveur (volume ou stockage objet) car il contient les images uploadées.
