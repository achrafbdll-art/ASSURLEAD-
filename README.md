# ASSURLEAD - Growth Engine (Vite + 3D Three.js + Gemini AI)

Ce dépôt contient l'application **ASSURLEAD**, une plateforme d'acquisition d'assurance haut de gamme intégrant des visualisations 3D interactives de pointe et un agent conversationnel propulsé par Gemini AI.

## 🚀 Fonctionnalités Clés
- **Visualisation 3D Interactive (Three.js)** : Scènes Three.js hautement fluides pour le Header (Hero), le simulateur ROI interactif (Pilliers Hexagonaux Neon, Tornade de symboles monétaires), et l'arrière-plan Zellij 3D défilant et réactif au défilement utilisateur (scroll).
- **Yacine AI (Gemini Agent)** : Un assistant intelligent intégré propulsé par le SDK officiel `@google/genai` (modèle `gemini-3.5-flash`), fournissant des conseils sur mesure pour les agents d'assurance.
- **Lead Ticker Dynamique** : Flux simulé de leads en temps réel pour accroître les taux de conversion.
- **Formulaire Multi-étapes (Questionnaire)** : Un entonnoir d'avis stratégique fluide avec validation de saisies et transitions visuelles soignées.

## 🛠️ Démarrage Local

Pour exécuter ce projet localement :

1. **Cloner le dépôt** :
   ```bash
   git clone <URL_DU_DEPOT_GITHUB>
   cd assurlead
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine à partir du modèle fourni :
   ```bash
   cp .env.example .env
   ```
   Remplissez votre clé API Gemini :
   ```env
   VITE_GEMINI_API_KEY=votre_cle_api_ici
   ```

4. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Production & Déploiement

Pour générer les fichiers statiques optimisés pour la production (par exemple, pour héberger sur GitHub Pages, Vercel, Netlify, ou Cloud Run) :

```bash
npm run build
```

Les fichiers de sortie hautement optimisés seront générés dans le dossier `/dist`. Vous pouvez déployer directement ce répertoire sur n'importe quel service d'hébergement statique de votre choix.

### Déploiement GitHub Pages
Pour déployer le dossier `/dist` construit sur GitHub Pages :
- Vous pouvez utiliser des outils comme la commande `gh-pages` ou configurer un workflow GitHub Actions pour construire et déployer automatiquement à chaque commit sur la branche principale.

### 🔑 Configuration de la Clé API Gemini sur GitHub Pages
Puisque GitHub Pages est un hébergement purement statique, l'assistant **Yacine AI** offre 3 méthodes flexibles de paramétrage de clé sans nécessiter de serveur backend :

1. **Via Paramètre d'URL (Idéal pour des démo rapides)** :
   Ajoutez simplement `?api_key=VOTRE_CLE` à la fin de l'URL de votre site :
   `https://votre-pseudo.github.io/assurlead/?api_key=AIzaSyD...`

2. **Via LocalStorage (Persistant et sécurisé localement)** :
   Ouvrez la console de votre navigateur (F12) sur votre site et exécutez de façon unique :
   ```javascript
   localStorage.setItem('VITE_GEMINI_API_KEY', 'votre_cle_api_ici');
   ```
   Rafraîchissez la page. L'assistant fonctionnera de manière permanente pour vous sans exposer publiquement votre clé dans le code source de votre dépôt.

3. **Intégration Directe (Build-time)** :
   Définissez la variable `VITE_GEMINI_API_KEY` dans vos variables d'environnement au moment du lancement de la commande `npm run build`. Notez que cela inclura la clé dans le bundle JavaScript compilé, ce qui est déconseillé si votre dépôt GitHub est public.

## 📁 Structure du Projet
- `index.html` : Point d'entrée de l'application.
- `script.js` : Logique applicative, gestion interactive de l'assistant IA et scènes 3D Three.js.
- `style.css` : Styles CSS hautement peaufinés basés sur la charte graphique premium.
- `vite.config.js` : Configuration de compilation pour résoudre correctement les dépendances et exporter l'application.
- `package.json` : Définition des scripts et dépendances tiers (`three`, `@google/genai`, etc.).

