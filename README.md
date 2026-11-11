# MyTasks React Native — Version 100% En Ligne (API REST)

Application mobile de gestion de tâches réalisée avec **React Native (Expo)** communiquant en direct avec une **API REST** (Node.js / Express incluse dans `backend/`).

## Fonctionnalités
- Toutes les opérations CRUD (`GET`, `POST`, `PUT`, `DELETE`) passent directement par l'API REST.
- Pull-to-refresh pour actualiser les tâches depuis le serveur.
- Indicateur d'état réseau (`API` / `API Hors-ligne`) et configuration dynamique de l'URL du serveur dans l'onglet **Profil**.

## Installation & Lancement

### 1. Démarrer le serveur Backend API
```bash
cd backend
npm install
npm start
```

### 2. Démarrer l'application React Native
Dans un autre terminal (à la racine du projet) :
```bash
npm install
npx expo start
```
- Appuyez sur `w` pour lancer dans le navigateur web (`http://localhost:3000/api`), ou scannez le QR code avec **Expo Go** (en ajustant l'IP affichée par le backend dans l'onglet **Profil**).
