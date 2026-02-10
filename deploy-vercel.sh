#!/bin/bash

echo "🚀 Déploiement sur Vercel"
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔐 Connexion à Vercel..."
vercel login

echo ""
echo "🚀 Déploiement en cours..."
vercel --prod

echo ""
echo "✅ Déploiement terminé !"
