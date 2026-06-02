# Todo — MonCV

## Fonctionnalités implémentées
- [x] Backend Express + TypeScript + base de données JSON
- [x] Authentification JWT (register, login, me)
- [x] CRUD complet des CV
- [x] Routes templates + suggestions
- [x] 30 templates de CV (classique, moderne, créatif, minimaliste)
- [x] 582 suggestions FR/EN (8 sections : profile, experience, skills, education, languages, interests, softskills, achievements)
- [x] Galerie templates avec clic direct → éditeur
- [x] Éditeur de CV complet (toutes sections)
- [x] Suggestions auto-affichées sans clic bouton
- [x] Upload photo (fichier → base64)
- [x] Aperçu temps réel avec polices template
- [x] Personnalisation des couleurs (color picker)
- [x] Export PDF (html2canvas + jsPDF)
- [x] Export Word (.doc)
- [x] Dashboard (liste des CV, édition, suppression, duplication)
- [x] Responsive design (mobile + desktop)
- [x] FR/EN toggle dans l'éditeur

## Tests
- [x] Backend — 33 tests (suggestions, auth, CVs CRUD, templates) avec Vitest + Supertest
- [x] Frontend — 21 tests (HomePage, LoginPage, CVPreview) avec Vitest + React Testing Library
- [x] Modification LoginPage : ajout htmlFor/id pour accessibilité et testabilité
- [x] Refactor server.ts : condition NODE_ENV pour éviter listen() en test
- [x] Fix controller CVs : try/catch ZodError pour retour 400 au lieu de crash

## Déploiement
- [x] Root package.json avec build/start orchestrés
- [x] render.yaml pour Render (web service Node)
- [x] Backend sert le frontend buildé en production (express.static + catch-all SPA)
- [x] .gitignore root
- [x] Exclusions test des tsconfig (build sans tests)
- [x] Vérifié : API opérationnelle, frontend servi, assets statiques OK

## Previews
- [x] Script `backend/src/db/generate-previews.ts` : génère 30 SVG stylisés
- [x] SVG avec layout single/two-column, couleurs du template, nom du template
- [x] Seed mis à jour pour référencer les `.svg` au lieu des `.png`
- [x] TemplatesPage : affiche la preview en watermark (opacity 7%) sur la carte
- [x] Re-seed DB après mise à jour

## Page d'accueil améliorée
- [x] Badge "Créateur de CV en ligne" + hero plus percutant
- [x] Grille 2×2 de previews SVG des templates (Classique, Moderne, Créatif, Minimaliste)
- [x] Section CTA finale "Prêt à créer votre CV ?"
- [x] Footer avec navigation et copyright
- [x] Tests mis à jour (getAllByText pour éléments header/footer en double)
