# Déploiement sur Vercel

## 🚀 Méthode 1 : Déploiement via le site Vercel (Recommandé)

### Étape 1 : Créer un compte Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" et connectez-vous avec GitHub/GitLab/Bitbucket

### Étape 2 : Pousser le code sur GitHub
```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Digital Maturity Assessment Multi-user"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/votre-username/digital-maturity.git
git branch -M main
git push -u origin main
```

### Étape 3 : Importer le projet sur Vercel
1. Sur Vercel, cliquez sur "New Project"
2. Sélectionnez votre dépôt GitHub
3. Vercel détectera automatiquement qu'il s'agit d'une app Create React App
4. Cliquez sur "Deploy" (aucune configuration nécessaire !)

### Étape 4 : Accéder à votre application
- Votre app sera disponible sur : `https://votre-projet.vercel.app`
- À chaque push sur `main`, Vercel déploiera automatiquement

---

## 🛠️ Méthode 2 : Déploiement via CLI Vercel

### Installation de Vercel CLI
```bash
npm install -g vercel
```

### Déploiement
```bash
# Se connecter à Vercel
vercel login

# Déployer (première fois)
vercel

# Suivre les instructions :
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? digital-maturity
# - Directory? ./
# - Override settings? No

# Déployer en production
vercel --prod
```

---

## ⚙️ Configuration automatique

Le fichier `vercel.json` est déjà configuré avec :
- ✅ Build command : `npm run build`
- ✅ Output directory : `build`
- ✅ Framework : Create React App
- ✅ Rewrites pour le routing côté client

---

## 📊 Données utilisateur

⚠️ **Important** : L'application utilise `localStorage` pour stocker les données :
- Les données sont stockées **dans le navigateur** de l'utilisateur
- Elles ne sont **pas synchronisées** entre appareils
- Elles persistent tant que l'utilisateur n'efface pas son cache

### Pour une version avec base de données backend :
Si vous souhaitez que les données soient accessibles depuis n'importe quel appareil, il faudrait :
1. Créer un backend (Node.js, Python, etc.)
2. Utiliser une base de données (PostgreSQL, MongoDB, Supabase, Firebase)
3. Modifier l'app pour faire des appels API au lieu d'utiliser localStorage

---

## 🔧 Variables d'environnement (optionnel)

Si vous ajoutez des variables d'environnement :
1. Créez un fichier `.env.local` localement
2. Sur Vercel : Settings → Environment Variables
3. Ajoutez vos variables avec le préfixe `REACT_APP_`

Exemple :
```env
REACT_APP_API_URL=https://api.example.com
```

---

## 📱 Domaine personnalisé (optionnel)

1. Sur Vercel : Project Settings → Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Vercel

---

## 🔄 Déploiements automatiques

Une fois le projet lié à GitHub :
- ✅ Chaque `push` sur `main` = déploiement en production
- ✅ Chaque `pull request` = preview deployment
- ✅ Rollback instantané vers une version précédente

---

## 🐛 Dépannage

### Erreur de build
```bash
# Tester le build localement
npm run build

# Si ça fonctionne localement mais pas sur Vercel,
# vérifier les logs de build sur Vercel
```

### localStorage vide après déploiement
C'est normal ! Les données localStorage sont spécifiques au domaine.
Les données de `localhost:3000` ne seront pas sur `votre-app.vercel.app`

---

## 📞 Support

- [Documentation Vercel](https://vercel.com/docs)
- [Support Vercel](https://vercel.com/support)
