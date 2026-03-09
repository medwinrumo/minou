# minou.run.md — État exécutif du projet Minou

> Mis à jour à chaque clôture de session. Lire en priorité pour se remettre dans le contexte.

---

## Dernière session — 2026-03-09

### Ce qui a été fait
- Lecture de l'état du projet — pas d'avancement technique

---

## Tâches

### À faire
- 1 — Installer Firebase Admin SDK dans `/server` (`npm install firebase-admin`)
- 2 — Implémenter le streaming SSE dans `server/routes/chat.js` (OpenAI, Anthropic, Mistral, Gemini)
- 3 — Intégrer `marked` + `highlight.js` dans `MessageList.jsx` pour le rendu Markdown
- 4 — CRUD conversations Firestore + affichage sidebar
- 5 — Dropdown modèle fonctionnel dans `InputArea.jsx`

### Réalisées
_(aucune pour l'instant)_

---

## État général du projet

| Élément | État |
|---|---|
| Auth Firebase (client) | ✅ Fonctionnel |
| Layout principal | ✅ Scaffoldé |
| GET /api/models | ✅ Fonctionnel |
| ModelSelector.jsx | ✅ Fonctionnel |
| POST /api/chat (streaming SSE) | ❌ Non implémenté (501) |
| CRUD conversations Firestore | ❌ Non implémenté |
| Firebase Admin SDK | ❌ Non installé |
| Rendu Markdown | ❌ Non implémenté |
