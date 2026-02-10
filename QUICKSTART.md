# 🚀 Guide de démarrage rapide

## ✨ Ce qui a changé

L'application utilise maintenant **Supabase** comme base de données centralisée :
- ✅ **Tous les utilisateurs** peuvent voir les résultats de **tous les autres**
- ✅ Les données sont **synchronisées** entre tous les appareils
- ✅ **Fallback automatique** vers localStorage si Supabase n'est pas configuré
- ✅ Badge visuel indiquant le mode actif (Supabase ou Local)

## 🎯 Étape 1 : Configuration Supabase (5 minutes)

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte (gratuit)
2. Créez un nouveau projet :
   - **Name** : `digital-maturity`
   - **Database Password** : Générez et sauvegardez
   - **Region** : Europe West (ou la plus proche)
3. Attendez ~2 minutes que le projet soit créé

### 2. Créer la table

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez ce code :

```sql
-- Créer la table
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trigram VARCHAR(3) NOT NULL UNIQUE,
  answers JSONB NOT NULL DEFAULT '{}',
  current_dim INTEGER DEFAULT 0,
  current_sub INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_assessments_trigram ON assessments(trigram);
CREATE INDEX idx_assessments_last_update ON assessments(last_update DESC);

-- Activer Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut lire
CREATE POLICY "Allow public read" ON assessments FOR SELECT USING (true);

-- Politique : tout le monde peut insérer
CREATE POLICY "Allow public insert" ON assessments FOR INSERT WITH CHECK (true);

-- Politique : tout le monde peut modifier
CREATE POLICY "Allow public update" ON assessments FOR UPDATE USING (true) WITH CHECK (true);

-- Politique : tout le monde peut supprimer
CREATE POLICY "Allow public delete" ON assessments FOR DELETE USING (true);

-- Fonction pour auto-update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

SELECT 'Table créée avec succès !' as message;
```

4. Cliquez sur **Run** (ou Cmd/Ctrl + Enter)

### 3. Récupérer les clés API

1. Dans Supabase : **Settings** → **API**
2. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la longue clé)

### 4. Configurer l'application locale

Créez un fichier `.env.local` à la racine du projet :

```bash
REACT_APP_SUPABASE_URL=https://votre-projet-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre-anon-key-ici
```

**Remplacez** les valeurs par vos vraies clés Supabase !

### 5. Redémarrer l'application

```bash
# Arrêter le serveur (Ctrl + C)
npm start
```

Vous devriez voir le badge **"● Supabase actif"** en vert en haut à droite ! 🎉

## 🌐 Étape 2 : Déployer sur Vercel

### 1. Configurer les variables d'environnement sur Vercel

1. Allez sur votre projet Vercel
2. **Settings** → **Environment Variables**
3. Ajoutez :
   - `REACT_APP_SUPABASE_URL` = votre Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = votre anon key

### 2. Pousser les modifications

```bash
git add .
git commit -m "Add Supabase integration for multi-user support"
git push origin main
```

Vercel va automatiquement redéployer avec Supabase ! 🚀

## ✅ Vérification

### Tester en local

1. Ouvrez l'application (`http://localhost:3000`)
2. Créez une évaluation avec le trigramme **ABC**
3. Répondez à quelques questions
4. Allez dans Supabase → **Table Editor** → `assessments`
   - Vous devriez voir votre ligne avec ABC !
5. Ouvrez un **autre navigateur** (ou mode incognito)
6. Connectez-vous avec un autre trigramme (**XYZ**)
7. Cliquez sur **"Voir tous les résultats"**
   - Vous devriez voir **ABC** dans la liste ! ✨

### Tester le multi-utilisateur

1. Ouvrez l'app sur **2 appareils différents** (ou 2 navigateurs)
2. Créez des évaluations avec des trigrammes différents
3. Tous les utilisateurs peuvent maintenant voir les résultats de tous les autres !

## 🔧 Dépannage

### Badge "○ Mode local" au lieu de "● Supabase actif"

- Vérifiez que `.env.local` existe à la **racine** du projet
- Vérifiez que les variables commencent par `REACT_APP_`
- Redémarrez le serveur (`npm start`)

### Erreur "PGRST116" dans la console

- Normal pour un nouvel utilisateur (pas de données trouvées)

### Les données ne se sauvegardent pas

1. Ouvrez la console du navigateur (F12)
2. Cherchez les erreurs rouges
3. Vérifiez que les clés Supabase sont correctes

### Mode local fonctionne, mais pas Supabase

- Vérifiez les politiques RLS dans Supabase (**Table Editor** → `assessments` → **RLS**)
- Vérifiez que toutes les politiques sont activées

## 📚 Fonctionnalités

### Mode Supabase actif ✅
- Données centralisées dans PostgreSQL
- Synchronisation en temps réel
- Accessible depuis n'importe quel appareil
- Tous les utilisateurs voient tous les résultats

### Mode local (fallback) 💾
- Données dans localStorage du navigateur
- Pas de synchronisation entre appareils
- Utilisé automatiquement si Supabase n'est pas configuré

## 🎨 Prochaines étapes possibles

- [ ] Ajouter l'authentification Supabase
- [ ] Créer un dashboard admin avec graphiques comparatifs
- [ ] Exporter les résultats en PDF/Excel
- [ ] Ajouter des notifications en temps réel
- [ ] Mettre en place des rôles (admin, user)

## 📞 Support

- [Documentation Supabase](https://supabase.com/docs)
- [Guide complet](./SUPABASE_SETUP.md)
- [Documentation de déploiement](./DEPLOIEMENT.md)
