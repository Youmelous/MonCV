# Décisions fixes — MonCV

## Stack technique

### Frontend
- **Framework** : React 19 avec Vite
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Routing** : React Router v6
- **État** : useState local dans EditorPage
- **PDF** : html2canvas + jsPDF (côté client)
- **Word** : génération HTML → Blob .doc

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Langage** : TypeScript (tsx pour exécution)
- **Base de données** : JSON file (JsonDB custom)
- **Auth** : JWT (jsonwebtoken + bcrypt)

## Architecture

```
MonCV/
├── backend/
│   ├── src/
│   │   ├── server.ts            # Point d'entrée Express
│   │   ├── db/
│   │   │   ├── connection.ts    # JsonDB (fichier JSON)
│   │   │   └── seed.ts          # 30 templates
│   │   ├── routes/
│   │   │   ├── auth.ts          # Register / Login / Me
│   │   │   ├── cvs.ts           # CRUD CV
│   │   │   ├── templates.ts     # Liste templates
│   │   │   └── suggestions.ts   # Suggestions avec filtres (job, section, lang)
│   │   └── data/
│   │       └── suggestions.json # 582 suggestions FR/EN
│   └── data/
│       └── moncv.json           # Base de données persistée
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx              # Routes
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── TemplatesPage.tsx # Clic direct → éditeur
│   │   │   ├── EditorPage.tsx    # Éditeur complet + suggestions auto
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── components/
│   │   │   └── CVPreview.tsx     # Aperçu avec polices template
│   │   ├── data/
│   │   │   └── api.ts           # Appels API axios
│   │   └── types/
│   │       └── index.ts         # Types TS
│   └── index.html               # 25+ Google Fonts préchargées
├── context.md
├── fixed.md
└── todo.md
```

## Modèle de données

### CV
```
{
  id: string,
  userId: string | null,
  templateId: string,
  title: string,
  personalInfo: {
    firstName, lastName, email, phone, address, title, photo (base64)
  },
  profile: string,
  experience: [{ id, company, position, startDate, endDate, current, description, tasks: [] }],
  education: [{ id, school, degree, field, startDate, endDate }],
  skills: [{ id, category, items: [] }],
  languages: [{ id, language, level }],
  interests: string[],
  colors: { primary, secondary, accent },
  createdAt, updatedAt
}
```

### Template
```
{
  id, name, description, preview,
  category: 'classique' | 'moderne' | 'créatif' | 'minimaliste',
  layout: 'single-column' | 'two-column',
  fonts: { heading, body },
  defaultColors: { primary, secondary, accent }
}
```

### Suggestion
```
{
  section: 'profile' | 'experience' | 'skills' | 'education' | 'languages' | 'interests' | 'softskills' | 'achievements',
  jobCategory: string,
  job: string,
  text: string,
  lang: 'fr' | 'en'
}
```

## API Endpoints
- `POST /api/auth/register` — Inscription
- `POST /api/auth/login` — Connexion
- `GET /api/auth/me` — Profil
- `GET /api/cvs` — Liste des CV
- `POST /api/cvs` — Créer un CV
- `GET /api/cvs/:id` — Récupérer un CV
- `PUT /api/cvs/:id` — Mettre à jour un CV
- `DELETE /api/cvs/:id` — Supprimer un CV
- `POST /api/cvs/:id/duplicate` — Dupliquer un CV
- `GET /api/templates` — 30 templates
- `GET /api/suggestions?job=&section=&lang=` — Suggestions filtrées (max 100)

## Comportements clés
- Galerie : clic sur une carte → création CV + navigation directe vers l'éditeur
- Suggestions : chargement automatique par section (aucun clic nécessaire)
- Photo : upload → base64, affichée dans preview et export Word
- Export PDF : capture du preview via html2canvas → jsPDF
- Export Word : génération HTML → Blob .doc
- FR/EN : toggle dans l'éditeur, filtré côté serveur
