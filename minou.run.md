# minou.run.md — État exécutif du projet Minou

> Mis à jour à chaque clôture de session. Lire en priorité pour se remettre dans le contexte.

---

## Dernière session — 2026-03-09

### Ce qui a été fait
- Mise en place de l'architecture des instructions Claude Code :
  - `~/dev/CLAUDE.md` — instructions globales (préférences, Notion, process de clôture)
  - `~/dev/minou/CLAUDE.md` — instructions spécifiques Minou (inchangé)
  - `~/dev/minou/minou.run.md` — ce fichier (créé)
- Documentation de l'écosystème Notion (3 bases : Notes & Docs, Projets, Tâches)
- Documentation du process de clôture de session
- Documentation du projet makeRag et de la série de RAGs prévue (section 23 de CLAUDE.md)

### Prochaines étapes
Reprendre les priorités d'implémentation Minou (cf. CLAUDE.md section 22) :
1. Installer Firebase Admin SDK dans `/server`
2. Implémenter le streaming SSE dans `server/routes/chat.js`
3. Intégrer `marked` + `highlight.js` dans `MessageList.jsx`
4. CRUD conversations Firestore + affichage sidebar
5. Dropdown modèle fonctionnel dans `InputArea.jsx`

---

## État général du projet

| Élément | État |
|---|---|
| Auth Firebase | ✅ Fonctionnel |
| Layout principal | ✅ Scaffoldé |
| GET /api/models | ✅ Fonctionnel |
| POST /api/chat (streaming SSE) | ❌ Non implémenté (501) |
| CRUD conversations Firestore | ❌ Non implémenté |
| Firebase Admin SDK | ❌ Non installé |
| Rendu Markdown | ❌ Non implémenté |
| Sélecteur de modèle | ❌ Non fonctionnel |
