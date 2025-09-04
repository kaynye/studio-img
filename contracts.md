# Contrats de l'Application ImageCraft Pro - Traitement Côté Client

## 1. Architecture Générale
- **Frontend Only** : Traitement complet côté navigateur avec Canvas API
- **Pas de Backend** : Aucun upload de fichiers, traitement local instantané
- **Technologies** : Canvas API, Web Workers pour les traitements lourds, File API

## 2. Remplacement des Mocks

### A. mockProcessImage → realProcessImage
**Actuel** : Simulation avec setTimeout
**Nouveau** : 
- Utilisation de Canvas API pour traitement réel
- Web Workers pour éviter le blocage de l'UI
- Retour d'un vrai Blob traité

### B. Filtres mockés → Filtres Canvas réels
**Actuels** : Style CSS pour preview uniquement
**Nouveaux** : 
- `brightness`: Manipulation des pixels via ImageData
- `contrast`: Algorithme de contraste sur Canvas
- `saturation`: Conversion HSL et ajustement
- `blur`: Filter Canvas ou convolution manuelle
- `sharpen`: Matrice de convolution
- `gamma`: Correction gamma pixel par pixel

### C. Formats mockés → Conversion réelle
**Actuels** : Liste statique
**Nouveaux** :
- `PNG`: canvas.toBlob('image/png')
- `PNG Transparent`: Détection et suppression du fond
- `JPEG`: canvas.toBlob('image/jpeg', quality)
- `WebP`: canvas.toBlob('image/webp') si supporté
- `ICO`: Redimensionnement + génération ICO
- `SVG`: Conversion bitmap vers SVG si applicable

## 3. Nouvelles Fonctionnalités Réelles

### A. Redimensionnement Intelligent
- Canvas drawImage avec nouvelles dimensions
- Préservation du ratio d'aspect
- Algorithmes de rééchantillonnage

### B. Compression avec Préservation Qualité
- Paramètre qualité pour JPEG
- Optimisation de la taille sans perte visible
- Comparaison avant/après

### C. Rognage (Crop)
- Interface de sélection rectangulaire
- Canvas getImageData sur zone sélectionnée
- Nouvelle image créée avec zone rognée

### D. Génération de Favicons
- Redimensionnement automatique (16x16, 32x32, 48x48)
- Export en format ICO multi-résolutions
- Preview de toutes les tailles

## 4. Optimisations Performance

### A. Web Workers
- Traitement des filtres lourds en arrière-plan
- Éviter le blocage de l'interface utilisateur
- Communication via postMessage

### B. Canvas Offscreen
- Traitement invisible à l'utilisateur
- Transfert vers canvas visible une fois terminé
- Gestion mémoire optimisée

### C. Streaming et Chunking
- Traitement par blocs pour grosses images
- Barre de progression réelle
- Éviter les dépassements mémoire

## 5. Gestion des Erreurs
- Vérification du support des formats
- Limites de taille d'image
- Fallbacks pour navigateurs anciens

## 6. Interface Utilisateur Améliorée
- Preview temps réel avec Canvas
- Historique des actions (undo/redo)
- Comparaison avant/après
- Zoom et pan sur l'image

## 7. API Contracts Internes

```javascript
// Service de traitement d'image
class ImageProcessor {
  async processImage(file, operations) { ... }
  async applyFilter(imageData, filter, value) { ... }
  async convertFormat(canvas, format, options) { ... }
  async resizeImage(canvas, width, height) { ... }
  async cropImage(canvas, x, y, width, height) { ... }
}

// Gestionnaire de formats
class FormatManager {
  getSupportedFormats() { ... }
  async exportAs(canvas, format, options) { ... }
  async generateFavicons(canvas) { ... }
}
```

## 8. Avantages du Traitement Client
- ✅ Pas d'upload de fichiers (confidentialité)
- ✅ Traitement instantané
- ✅ Pas de coûts serveur
- ✅ Fonctionne hors ligne
- ✅ Hébergement statique simple