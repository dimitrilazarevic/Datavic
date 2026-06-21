# Datavic

## 21/06/2026

### Objectifs

- Permettre à l'user de configurer son chemin DB pour aller dans un dossier partagé par exemple
- MAJ le schema de données pour adapter le schéma de l'ancienne app à SQLITE
- Recréer le panel admin pour créer et administrer les types simples
- Permettre les opérations essentielles sur la DB : remettre emplacement par défaut, exporter un backup, importer un backup

### Actions

#### Schéma de données SQLite
- Portage complet du schéma PostgreSQL vers SQLite (Drizzle) dans `electron/lib/db/schema.ts`
- 10 tables : bottleType, brand, overbrand, zone, materialFamily, supplier, bottle, material, bottleAnalysis, materialAnalysis
- Adaptations : serial → integer autoIncrement, varchar → text, bytea → imagePath (fichier sur disque), timestamp → text ISO, enums PG → text avec validation TS, real[].array() → text JSON
- Types Drizzle inférés exportés dans `electron/lib/types/index.ts`
- Activation de `PRAGMA foreign_keys = ON`

#### Gestion d'erreurs DB
- `electron/ipc/queries/utils/handleDbError.ts` — gestion des erreurs SQLite (UNIQUE, FOREIGNKEY, NOTNULL, CHECK) avec messages lisibles en français

#### Factory CRUD pour objets simples
- `electron/ipc/queries/simple/simpleQueries.ts` — factory `createSimpleQueries(table, idColumn, name)` générant getAll, create, update, delete
- `electron/ipc/queries/simple/index.ts` — instanciation pour les 6 tables simples + enregistrement des handlers IPC (`db:{table}:getAll|create|update|delete`)
- Exposition dans le preload et typage dans `app.d.ts` via interface `SimpleCrud<T, TInsert>`

#### Composants UI
- `Card.svelte` — composant carte avec titre optionnel
- `Button.svelte` — composant bouton avec variantes primary, secondary, ghost
- `IconButton.svelte` — bouton icône avec variantes primary, secondary, danger
- `SimpleCrud.svelte` — composant CRUD générique avec Card "Ajouter" (champs avec labels, un par ligne) et Card "Liste" (édition inline, icônes Pencil/Trash2/Check/X via lucide-svelte)

#### Pages settings
- 6 pages CRUD dans `/settings/` : brands, overbrands, zones, suppliers, material-families, bottle-types — chacune ~10 lignes utilisant SimpleCrud
- Liens ajoutés dans la sidebar du layout settings

#### Configuration DB
- electron/lib/config.ts — lit/écrit un config.json dans userData avec le champ dbFolder
- electron/ipc/configHandlers.ts — handlers IPC :
    - config:get-db-folder / config:get-db-path / config:select-db-folder / config:reset-db-folder
    - config:backup-db — dialogue "Enregistrer sous" + backup atomique via `better-sqlite3.backup()`
    - config:restore-db — dialogue "Ouvrir", backup auto de la base actuelle, remplacement, redémarrage app
- Changement de dossier et reset déclenchent un redémarrage automatique de l'app
- openPath exposé pour ouvrir des dossiers dans l'explorateur natif
- Page DB : chemin complet cliquable, bouton "Revenir à l'emplacement par défaut", boutons Exporter/Importer

### Résultats

- Schéma de données complet porté de PostgreSQL vers SQLite, migration générée et fonctionnelle
- Panel admin opérationnel pour les 6 types simples (CRUD complet avec gestion d'erreurs)
- Composants UI réutilisables en place (Card, Button, IconButton, SimpleCrud) — prêts pour les futures pages
- Backup/restore de la DB fonctionnel avec redémarrage automatique de l'app
- Reste à faire : handlers IPC pour bottle, material et les analyses (objets complexes)


## 20/06/2026

### Objectifs

- Avoir une release qui marche
- Faire joujou avec une DB sur le backend

### Actions

- Galéré à obtenir quelque chose qui s'exécute et se met à jour vraiment, mais on y est globalement arrivés !
- Base de données fonctionnelle avec les migrations qui vont bien

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