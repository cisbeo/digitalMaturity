# Évaluation de Maturité Digitale - Multi-utilisateurs

Application React pour évaluer la maturité digitale d'une entreprise. Version multi-utilisateurs avec identification par trigramme.

## ✨ Fonctionnalités

- **Multi-utilisateurs** : Chaque personne s'identifie avec un trigramme (3 lettres)
- **Sauvegarde automatique** : Les réponses sont sauvegardées automatiquement dans le localStorage
- **Reprise possible** : Possibilité de reprendre une évaluation en cours
- **Vue d'administration** : Visualisation de tous les utilisateurs et leurs scores
- **6 dimensions évaluées** : Stratégie, Expérience Client, Technologie, Opérations, Culture, Data & IA
- **36 critères** au total
- **Radar chart** et tableaux de bord visuels
- **Recommandations personnalisées**

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📋 Utilisation

1. **Connexion** : Saisissez votre trigramme (3 lettres) pour vous identifier
2. **Évaluation** : Répondez aux 36 questions (environ 15 minutes)
3. **Résultats** : Consultez votre score et les recommandations
4. **Reprise** : Vos réponses sont sauvegardées, vous pouvez reprendre plus tard

## 🔐 Gestion des données

Les données sont stockées localement dans le `localStorage` du navigateur :
- Clé de stockage : `digitalMaturity_[TRIGRAMME]`
- Données sauvegardées : réponses, progression, date de dernière mise à jour
- Aucune donnée n'est envoyée à un serveur

## 📊 Structure des données

Chaque utilisateur a ses propres données :
```json
{
  "answers": { "strategy.vision": 3, ... },
  "currentDim": 0,
  "currentSub": 0,
  "lastUpdate": "2024-02-10T...",
  "completed": true
}
```

## 🛠️ Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`

## 📝 Méthodologie

L'évaluation est basée sur :
- Deloitte / TM Forum Digital Maturity Model
- MIT / Capgemini Digital Maturity Framework
- BCG Digital Acceleration Index
- Cigref / INR (Green IT)
- EU AI Act (éthique IA)
- RGAA / WCAG (accessibilité)

## 🎨 Dimensions évaluées

1. **Stratégie Digitale** (6 critères)
2. **Expérience Client** (6 critères)
3. **Technologie** (6 critères)
4. **Opérations** (6 critères)
5. **Organisation & Culture** (6 critères)
6. **Data & IA** (6 critères)

## 📄 Licence

Ce projet est à usage interne.
