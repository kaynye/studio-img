# 🎨 ImageCrafter Pro

Application de retouche d'image professionnelle avec traitement 100% côté client.

![ImageCrafter Pro](https://img.shields.io/badge/Version-1.0.0-orange) ![React](https://img.shields.io/badge/React-19.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 🖼️ **Édition d'Images**
- **Filtres temps réel** : Luminosité, Contraste, Saturation, Flou, Gamma
- **Comparaison avant/après** : Visualisation instantanée des modifications
- **Prévisualisation en direct** : Aperçu en temps réel des filtres appliqués

### 📐 **Redimensionnement & Presets**
- **Presets réseaux sociaux** :
  - Facebook Cover (820×312)
  - Instagram Post (1080×1080)
  - Twitter Header (1500×500)
- **Presets web** :
  - Thumbnail Web (300×200)
  - Banner Web (1200×400)
- **Génération de favicons** automatique (16×16, 32×32, 48×48)
- **Dimensions personnalisées** avec maintien du ratio

### 💾 **Formats & Export**
- **PNG** : Qualité parfaite avec transparence
- **PNG Transparent** : Suppression automatique du fond
- **JPEG** : Compression optimisée avec contrôle qualité
- **WebP** : Format web moderne
- **ICO** : Icônes Windows/Web

### 🔧 **Interface Utilisateur**
- **Drag & Drop** : Glissez-déposez vos images
- **Design responsive** : Fonctionne sur mobile et desktop
- **Interface moderne** : Palette de couleurs professionnelle
- **Notifications toast** : Feedback utilisateur intuitif

## 🚀 **Avantages Techniques**

### 🔒 **Confidentialité Totale**
- **Traitement 100% local** : Aucune image uploadée sur serveur
- **Sécurité maximale** : Vos données restent sur votre appareil
- **Fonctionne hors ligne** : Une fois chargé, pas besoin d'internet

### ⚡ **Performance Optimale**
- **Canvas API native** : Utilise les capacités du navigateur
- **Traitement instantané** : Pas d'attente réseau
- **Mémoire optimisée** : Gestion intelligente des ressources

### 🌐 **Déploiement Simple**
- **Site statique** : Compatible GitHub Pages, Netlify, Vercel
- **Coûts zéro** : Pas de serveur backend nécessaire
- **CDN friendly** : Optimisé pour la distribution mondiale

## 🛠️ Installation & Développement

### Prérequis
- Node.js 16+
- Yarn ou npm

### Installation
```bash
# Cloner le repository
git clone [votre-repo]
cd imagecrafter-pro

# Installer les dépendances
yarn install

# Lancer en développement
yarn start
```

### Build de production
```bash
# Créer le build optimisé
yarn build

# Les fichiers sont dans le dossier `build/`
```

## 📁 Structure du Projet

```
imagecrafter-pro/
├── public/              # Fichiers statiques
├── src/
│   ├── components/
│   │   ├── ui/         # Composants UI (Shadcn)
│   │   └── ImageEditor.jsx  # Composant principal
│   ├── services/
│   │   └── ImageProcessor.js  # Logique de traitement
│   ├── hooks/
│   │   └── use-toast.js     # Hook pour notifications
│   ├── App.js          # Composant racine
│   ├── App.css         # Styles globaux
│   └── index.js        # Point d'entrée
├── package.json        # Dépendances
└── README.md          # Documentation
```

## 🎯 Technologies Utilisées

- **React 19** : Framework frontend moderne
- **Tailwind CSS** : Framework CSS utilitaire
- **Shadcn/ui** : Composants UI accessibles
- **Lucide React** : Icônes modernes
- **Canvas API** : Traitement d'image natif
- **Radix UI** : Primitives UI accessibles

## 🔧 Configuration

### Variables d'environnement
Aucune variable d'environnement nécessaire - l'application fonctionne entièrement côté client.

### Personnalisation
Modifiez les presets dans `src/components/ImageEditor.jsx` :
```javascript
const presetSizes = [
  { 
    id: 'custom-preset', 
    name: 'Mon Preset', 
    sizes: [{ w: 800, h: 600 }],
    action: 'resize'
  }
];
```

## 🚀 Déploiement

### GitHub Pages
```bash
yarn build
# Déployez le contenu du dossier `build/`
```

### Netlify
```bash
# Build command: yarn build
# Publish directory: build
```

### Vercel
```bash
# Framework preset: Create React App
# Build command: yarn build
# Output directory: build
```

## 📝 Licence

MIT License - Vous êtes libre d'utiliser ce projet à des fins personnelles et commerciales.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir des issues pour signaler des bugs
- Proposer de nouvelles fonctionnalités
- Soumettre des pull requests

## 📞 Support

Pour toute question ou assistance :
- Créez une issue sur GitHub
- Consultez la documentation en ligne

---

**ImageCrafter Pro** - Retouche d'image professionnelle, simple et sécurisée. 🎨✨

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
