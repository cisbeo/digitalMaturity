# Configuration Supabase

## 🎯 Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub
4. Cliquez sur "New Project"
5. Remplissez :
   - **Name** : `digital-maturity`
   - **Database Password** : Générez un mot de passe fort (sauvegardez-le)
   - **Region** : Choisissez la plus proche (ex: Europe West)
6. Cliquez sur "Create new project" (prend ~2 minutes)

## 📊 Étape 2 : Créer la table dans la base de données

1. Dans votre projet Supabase, allez dans **SQL Editor** (icône à gauche)
2. Cliquez sur "New query"
3. Copiez-collez ce script SQL :

```sql
-- Créer la table pour les évaluations
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

-- Créer un index sur le trigramme pour des recherches rapides
CREATE INDEX idx_assessments_trigram ON assessments(trigram);

-- Créer un index sur last_update pour trier par date
CREATE INDEX idx_assessments_last_update ON assessments(last_update DESC);

-- Activer Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre la lecture à tous (public)
CREATE POLICY "Allow public read access" ON assessments
  FOR SELECT
  USING (true);

-- Créer une politique pour permettre l'insertion à tous
CREATE POLICY "Allow public insert access" ON assessments
  FOR INSERT
  WITH CHECK (true);

-- Créer une politique pour permettre la mise à jour à tous
CREATE POLICY "Allow public update access" ON assessments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Créer une politique pour permettre la suppression à tous
CREATE POLICY "Allow public delete access" ON assessments
  FOR DELETE
  USING (true);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour appeler la fonction
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Afficher un message de succès
SELECT 'Table assessments créée avec succès !' as message;
```

4. Cliquez sur "Run" (ou Cmd/Ctrl + Enter)
5. Vous devriez voir le message : "Table assessments créée avec succès !"

## 🔑 Étape 3 : Récupérer les clés API

1. Dans Supabase, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (longue chaîne de caractères)

## ⚙️ Étape 4 : Configurer l'application

1. Créez un fichier `.env.local` à la racine du projet :

```bash
# Dans le terminal, depuis le dossier du projet
cat > .env.local << 'EOF'
REACT_APP_SUPABASE_URL=https://votre-projet.supabase.co
REACT_APP_SUPABASE_ANON_KEY=votre-anon-key-ici
EOF
```

2. Remplacez les valeurs avec vos vraies clés Supabase

3. **Important** : Ne commitez JAMAIS le fichier `.env.local` sur Git (il est déjà dans `.gitignore`)

## 🚀 Étape 5 : Tester localement

1. Redémarrez le serveur de développement :

```bash
# Arrêter le serveur (Ctrl + C)
# Relancer
npm start
```

2. Testez l'application :
   - Créez une évaluation avec un trigramme (ex: ABC)
   - Répondez à quelques questions
   - Ouvrez un autre navigateur (ou mode incognito)
   - Connectez-vous avec un autre trigramme (ex: XYZ)
   - Vérifiez que vous voyez les résultats de ABC dans l'admin

## 🌐 Étape 6 : Configurer Vercel (pour la production)

1. Sur Vercel, allez dans votre projet
2. Cliquez sur **Settings** → **Environment Variables**
3. Ajoutez ces deux variables :
   - **Name** : `REACT_APP_SUPABASE_URL`
   - **Value** : Votre Project URL Supabase
   - Cliquez sur "Add"

   - **Name** : `REACT_APP_SUPABASE_ANON_KEY`
   - **Value** : Votre anon key Supabase
   - Cliquez sur "Add"

4. Redéployez l'application :
   - Allez dans l'onglet **Deployments**
   - Cliquez sur les trois points du dernier déploiement
   - Cliquez sur "Redeploy"

## ✅ Vérification

Pour vérifier que tout fonctionne :

1. **Base de données** : Allez dans Supabase → Table Editor → `assessments`
   - Vous devriez voir vos évaluations apparaître en temps réel

2. **Application locale** : Ouvrez la console du navigateur (F12)
   - Vous devriez voir les logs de connexion Supabase

3. **Multi-utilisateurs** : Testez avec plusieurs trigrammes
   - Les résultats devraient être visibles par tous

## 🔒 Sécurité (Optionnel)

Pour l'instant, tout le monde peut lire et écrire dans la base de données.
Pour ajouter de l'authentification plus tard :

1. Modifiez les politiques RLS dans Supabase
2. Ajoutez l'authentification Supabase dans l'app
3. Protégez les routes sensibles

## 🆘 Dépannage

### "Supabase not configured"
- Vérifiez que `.env.local` existe et contient les bonnes clés
- Redémarrez le serveur (`npm start`)

### Erreur CORS
- Les clés API sont correctes ?
- Vérifiez l'URL du projet (pas d'espace, pas de slash à la fin)

### Les données ne se sauvegardent pas
- Vérifiez la console du navigateur pour les erreurs
- Allez dans Supabase → Logs pour voir les erreurs backend

### Fallback vers localStorage
- Normal si Supabase n'est pas configuré
- L'app utilise automatiquement localStorage en secours

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
