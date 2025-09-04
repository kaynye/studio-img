#!/bin/bash

# Script de nettoyage pour la production
echo "🧹 Nettoyage des fichiers de développement..."

# Supprimer les fichiers de développement
rm -f craco.config.js
rm -f jsconfig.json
rm -f components.json

# Supprimer les logs et caches
rm -rf node_modules/.cache
rm -rf .craco-cache
rm -rf build/static/js/*.map
rm -rf build/static/css/*.map

# Supprimer les fichiers de test
find . -name "*.test.js" -delete
find . -name "*.spec.js" -delete

echo "✅ Nettoyage terminé!"
echo "📦 Votre application est prête pour la production"
echo ""
echo "🚀 Pour déployer :"
echo "   - Netlify: Connectez votre repo GitHub"
echo "   - Vercel: Importez depuis GitHub"  
echo "   - GitHub Pages: Uploadez le dossier build/"
echo ""
echo "📁 Taille du build :"
ls -lh build/static/js/main.*.js | awk '{print "   JS: " $5}'
ls -lh build/static/css/main.*.css | awk '{print "   CSS: " $5}'