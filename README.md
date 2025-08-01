# Front Service - Application Vue.js avec Babylon.js

Ce service fournit l'interface utilisateur frontend pour le jeu Transcendance.

## Technologies utilisées

- **Vue.js 3.4** - Framework frontend reactif
- **Babylon.js 7.0** - Moteur 3D pour le rendu du jeu
- **Tailwind CSS 3.4** - Framework CSS utilitaire
- **Vite 5.0** - Build tool et serveur de développement
- **TypeScript 5.0** - Typage statique

## Structure du projet

```
front-service/
├── src/
│   ├── assets/
│   │   └── main.css          # Styles Tailwind CSS
│   ├── App.vue               # Composant principal
│   ├── main.ts               # Point d'entrée
│   └── vite-env.d.ts         # Types TypeScript
├── index.html                # Template HTML
├── package.json              # Dépendances
├── tsconfig.json             # Configuration TypeScript
├── vite.config.ts            # Configuration Vite
├── postcss.config.js         # Configuration PostCSS
├── tailwind.config.js        # Configuration Tailwind
├── Dockerfile                # Image Docker
├── nginx.conf                # Configuration Nginx
└── docker-entrypoint.sh      # Script de démarrage
```

## Fonctionnalités

### Interface utilisateur
- Menu principal avec navigation
- Zone de jeu 3D intégrée
- Système de boutons stylisés avec Tailwind
- Design responsive et moderne

### Intégration 3D
- Moteur Babylon.js configuré
- Caméra ArcRotate pour la vue 3D
- Éclairage et matériaux basiques
- Préparation pour les objets de jeu (balle, raquettes)

### Configuration Docker
- Mode développement avec hot-reload
- Mode production avec Nginx
- Attente des services backend
- Optimisation des assets statiques

## Commandes

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Linting
npm run lint
```

## Accès

- **Développement**: http://localhost:3004
- **Production**: Via le WAF sur http://localhost ou https://localhost

## Variables d'environnement

- `NODE_ENV`: Mode d'exécution (development/production)
- `VITE_API_URL`: URL de l'API backend

## Intégration avec les services

Le front-service communique avec les autres services via le gateway-service:
- Authentification via auth-service
- Gestion des utilisateurs via user-service
- Logique de jeu via game-service

## Prochaines étapes

1. Implémenter les composants de jeu spécifiques
2. Ajouter la logique de communication WebSocket
3. Créer les scènes 3D pour le Pong
4. Intégrer l'authentification avec les services backend
