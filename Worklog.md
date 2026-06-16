# Datavic

## 14/06/2026

### Objectifs

- Faire la config Electron (main.ts, preload.ts)
- Faire une GH Action qui s'occupe de faire les releases
- Configurer le build Electron via Vite

### Actions

- Création de `vite.config.electron.ts` pour builder main.ts et preload.ts en CJS
- Refactoring de `electron/main.ts` :
    - Fix de l'import `electron-updater` (passage en `import pkg` + destructuring pour compatibilité CJS)
    - Correction des chemins (`preload.cjs`, `../../build/index.html`, `appicon.png` via `resourcesPath`)
    - Ajout d'un try/catch sur `createTray()` pour éviter un crash sur les environnements sans system tray
- Ajout des scripts npm : `dev:electron`, `build:electron`, `build` (SvelteKit + Electron), `release`
- Configuration complète d'`electron-builder` dans `package.json` (appId, targets Linux/Win/Mac, extraResources pour l'icône, publish GitHub)
- Mise à jour du workflow `release.yml` : le step build inclut maintenant SvelteKit + Electron
- Ajout de `NODE_ENV` dans `.env.example`

### Résultats

- Le build Electron compile correctement via Vite (`npm run build:electron`)
- Le workflow GitHub Actions est prêt pour les releases automatiques
- Le lancement en dev (`npm run dev:electron`) bloqué par un SIGSEGV lié au snap VS Code qui pollue `XDG_DATA_DIRS` avec des schémas GTK incomplets — résolu en réinstallant VS Code via le .deb officiel au lieu du snap