# AutoLoc - Plateforme de Location de Voitures en Algérie

Une application SaaS moderne de location de voitures multivendeur pour l'Algérie, construite avec Next.js et Tailwind CSS.

## 🚀 Fonctionnalités

### 👥 Rôles Utilisateurs
- **Admin** : Gestion des vendeurs, voitures, réservations via Django Admin
- **Vendeur** : Tableau de bord séparé pour gérer ses voitures et demandes
- **Visiteur** : Recherche et réservation sans inscription

### 🎨 Design & UX
- **Design moderne** avec Tailwind CSS
- **Interface responsive** (mobile/tablette/desktop)
- **Composants réutilisables** (VoitureCard, Navbar, SearchBar)
- **Animations fluides** et transitions
- **Style professionnel** inspiré d'Airbnb/Turo

## 📄 Pages Disponibles

### 1. **Accueil** (`/`)
- Barre de recherche avancée
- Affichage des voitures disponibles
- Section avantages de la plateforme
- Design hero avec gradient

### 2. **Demande Vendeur** (`/demande-vendeur`)
- Formulaire d'inscription complet
- Upload de documents (Registre Commerce, NIF, NIS, Permis)
- Validation des champs obligatoires
- Interface drag & drop pour les fichiers

### 3. **Dashboard Vendeur** (`/dashboard-vendeur`)
- **Onglet "Mes Voitures"** :
  - Liste des voitures avec actions (modifier, supprimer, disponibilité)
  - Ajout de nouvelles voitures
  - Gestion des statuts
- **Onglet "Demandes Reçues"** :
  - Tableau des demandes avec filtres
  - Actions d'approbation/refus
  - Détails des clients

### 4. **Page Voiture** (`/voiture/[id]`)
- Détails complets de la voiture
- Caractéristiques techniques
- Informations du vendeur
- Formulaire de réservation
- Galerie d'images

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Responsive Design** mobile-first

### Backend (à implémenter)
- **Django** + Django REST Framework
- **Base de données** PostgreSQL
- **Authentification** JWT
- **Upload de fichiers** avec gestion des documents

## 🎯 Design System

### Couleurs
```css
Primary: #3b82f6 (blue-500)
Secondary: #6b7280 (gray-500)
Success: #10b981 (green-500)
Warning: #f59e0b (yellow-500)
Error: #ef4444 (red-500)
```

### Composants
- **Cards** : `shadow-md rounded-xl`
- **Boutons** : `btn-primary`, `btn-secondary`
- **Inputs** : `input-field`
- **Responsive** : Grid et Flexbox

## 🚀 Installation & Démarrage

```bash
# Cloner le projet
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx (Accueil)
│   ├── demande-vendeur/
│   │   └── page.tsx
│   ├── dashboard-vendeur/
│   │   └── page.tsx
│   └── voiture/[id]/
│       └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── VoitureCard.tsx
│   └── SearchBar.tsx
```

## 🔧 Configuration

### Tailwind CSS
- Configuration personnalisée dans `tailwind.config.js`
- Classes utilitaires dans `globals.css`
- Composants réutilisables avec `@apply`

### TypeScript
- Configuration stricte dans `tsconfig.json`
- Types pour tous les composants
- Alias de chemins `@/*`

## 📱 Responsive Design

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🎨 Composants Principaux

### VoitureCard
```tsx
interface VoitureCardProps {
  id: string
  marque: string
  modele: string
  annee: number
  prix: number
  ville: string
  image: string
  disponible: boolean
  note?: number
}
```

### SearchBar
- Recherche par localisation
- Sélection de dates
- Validation des champs

## 🔄 État de l'Application

### Données de Test
- Voitures avec images placeholder
- Demandes de réservation simulées
- Vendeurs avec informations complètes

### Fonctionnalités Implémentées
- ✅ Interface utilisateur complète
- ✅ Navigation responsive
- ✅ Formulaires avec validation
- ✅ Upload de fichiers
- ✅ Gestion d'état locale
- ✅ Design moderne et professionnel

### Prochaines Étapes
- 🔄 Intégration avec Django Backend
- 🔄 Authentification des utilisateurs
- 🔄 Base de données réelle
- 🔄 Upload de fichiers vers serveur
- 🔄 Notifications en temps réel

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : support@autoloc.dz
- Téléphone : +213 XXX XXX XXX

---

**AutoLoc** - La location de voitures simplifiée en Algérie 🚗✨ 