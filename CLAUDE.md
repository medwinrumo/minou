# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Guide Claude Code

### Workflow Git — règle absolue

Chaque nouvelle fonctionnalité se développe sur une branche dédiée. On ne touche jamais directement à `main`.

```
main          ← code validé et stable uniquement
dev           ← branche d'intégration
feature/xxx   ← une feature = une branche, créée depuis dev
```

**Cycle de travail :**
```bash
# 1. Partir de dev à jour
git checkout dev && git pull

# 2. Créer la branche feature
git checkout -b feature/nom-de-la-feature

# 3. Développer, committer au fil de l'eau
git add <fichiers> && git commit -m "description"

# 4. Une fois validée, merger dans dev
git checkout dev && git merge feature/nom-de-la-feature

# 5. Quand dev est stable, merger dans main
git checkout main && git merge dev && git push
```

Les branches `feature/xxx` sont supprimées après merge. `main` ne reçoit que du code testé et validé.

### Commandes de développement

```bash
# Frontend — depuis /client
npm run dev       # Vite sur http://localhost:5173
npm run build     # Build de production
npm run lint      # ESLint

# Backend — depuis /server
node index.js     # Express sur http://localhost:3001

# Le proxy Vite redirige /api/* → localhost:3001 automatiquement
```

Pas de framework de test configuré. Pas de commande `npm install` globale — installer séparément dans `/client` et `/server`.

### Stack réelle (valeurs constatées dans le code, pas dans la spec)

| Couche | Version réelle |
|---|---|
| React | 19 (pas 18) |
| Vite | 7 |
| Tailwind | 4 |
| Express | 5 |
| Module system | Frontend : ESM / Backend : CommonJS |

### `.env` — emplacement et chargement

Le fichier `.env` est à la **racine du projet** (`/minou/.env`), pas dans `/server/`. Le serveur le charge via `require('dotenv').config({ path: '../.env' })`. Le `.env.example` à la racine sert de référence.

### État d'implémentation actuel

**Fait :**
- Auth Firebase (client) — `AuthContext.jsx`, `LoginPage.jsx`, `firebase.js`
- Layout principal — `App.jsx`, `Header.jsx`, `Sidebar.jsx`, `MessageList.jsx`, `InputArea.jsx`
- `GET /api/models` — retourne la liste des modèles avec les prix depuis `.env`
- Structure des routes Express montées dans `server/index.js`

**Stubbed / à implémenter :**
- `POST /api/chat` → retourne 501 (streaming SSE non implémenté)
- `server/routes/conversations.js` — CRUD Firestore vide
- `server/routes/memory.js` — espace de connaissance vide
- `server/routes/export.js` — export PDF/MD/Word vide
- `server/routes/auth.js` — middleware Firebase JWT vide
- `server/middleware/` — dossier vide
- `client/src/hooks/` — dossier vide
- Firebase Admin SDK **non installé** dans `/server` (seulement `firebase` client dans `/client`)

### Modèle Anthropic dans le code

Le code utilise `claude-sonnet-4-6` (pas `claude-sonnet-3-7` mentionné dans la spec ci-dessous).

### Prochaine priorité d'implémentation

1. Installer Firebase Admin SDK dans `/server` : `npm install firebase-admin`
2. Implémenter le streaming SSE dans `server/routes/chat.js` (OpenAI, Anthropic, Mistral, Gemini)
3. Intégrer `marked` + `highlight.js` dans `MessageList.jsx` pour le rendu Markdown
4. CRUD conversations dans `server/routes/conversations.js` + affichage sidebar
5. ~~Dropdown modèle fonctionnel~~ — déjà fait (`ModelSelector.jsx`)

---

## Brief Produit — Projet Minou

> Ce fichier est le brief technique et fonctionnel complet du projet Minou.
> Il est destiné à Claude Code, qui s'en servira comme référence unique pour construire l'application.

---

## 0. Contexte & Philosophie du Projet

Minou est une application web de chatbot personnel multi-LLM. Elle permet à un ou plusieurs utilisateurs d'interagir avec différents LLMs via API (OpenAI, Anthropic, Mistral, Google) depuis une interface unique, sobre et fonctionnelle.

L'application est conçue pour :
- Un usage personnel (2 utilisateurs principaux : Medwin + sa compagne)
- Une distribution gratuite à des tiers, chaque destinataire installant sa propre instance indépendante avec ses propres clés API

**Il n'y a aucune mutualisation de facturation entre instances.** Chaque instance est totalement autonome.

L'objectif de la V1 est un assistant augmenté (mémoire, vision, OCR, recherche web, vocal, multi-LLM). Les capacités agentiques (MCP, intégrations externes) sont réservées à la V2, mais **l'architecture MCP doit être anticipée dès la V1** pour éviter toute refactorisation.

---

## 1. Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, Tailwind CSS, Vite |
| Backend | Node.js (Express) |
| Base de données | Firebase Firestore |
| Auth | Firebase Auth (JWT, session persistante) |
| Stockage fichiers | ~~Firebase Storage~~ — supprimé. Images transmises en base64 directement à l'API LLM, aucun stockage. |
| Config | Fichier `.env` côté serveur, chargé via `dotenv` |
| Déploiement | VPS Hostinger, géré via PM2 |

### APIs intégrées

| Fournisseur | Usage |
|---|---|
| OpenAI | LLM (GPT-4o), Realtime API (vocal), TTS (tts-1) |
| Anthropic | LLM (Claude Sonnet) |
| Mistral | LLM (Mistral Large), OCR (Pixtral) |
| Google | LLM (Gemini 1.5 Pro), Génération d'images (Imagen) |
| Perplexity | Recherche web temps réel (API Sonar) |
| Gmail API | Export conversations par email (OAuth) |

---

## 2. Infrastructure & Sécurité

### Fichier `.env` côté serveur

Toutes les clés API et variables sensibles sont stockées dans un fichier `.env` côté serveur, **jamais exposées côté client**. Le fichier `.env` est la source de vérité pour :
- Les clés API par fournisseur
- Les prix par modèle (input/output en $/1K tokens)
- Le taux de conversion USD/EUR (`USD_EUR_RATE`)
- Le Client ID et Client Secret Google Cloud (pour OAuth)

Exemple de structure `.env` :
```
# LLM Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
MISTRAL_API_KEY=...
GOOGLE_API_KEY=...
PERPLEXITY_API_KEY=...

# Model Pricing ($/1K tokens)
GPT4O_PRICE_INPUT=0.0025
GPT4O_PRICE_OUTPUT=0.010
CLAUDE_SONNET_PRICE_INPUT=0.003
CLAUDE_SONNET_PRICE_OUTPUT=0.015
MISTRAL_LARGE_PRICE_INPUT=0.002
MISTRAL_LARGE_PRICE_OUTPUT=0.006
GEMINI_PRO_PRICE_INPUT=0.00125
GEMINI_PRO_PRICE_OUTPUT=0.005

# Currency
USD_EUR_RATE=0.92

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Firebase
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

### Pas de Firebase Storage

Les fichiers (photos, OCR) sont transmis en base64 directement à l'API LLM — aucun stockage serveur. Firebase Storage supprimé définitivement (nécessite plan payant Blaze).

### Installation non-technique

Pour les tiers non-techniques, un assistant d'installation interactif (script CLI ou interface web de setup) guide l'utilisateur question par question et génère le fichier `.env` automatiquement, sans jamais exposer le fichier brut à l'utilisateur final.

---

## 3. Authentification & Rôles

Firebase Auth gère l'authentification. La session est persistante via token JWT — pas de re-login à chaque ouverture.

**Deux rôles :**

- **Admin** : accès complet — configuration des clés API, gestion des modèles LLM, gestion des comptes utilisateurs, gestion des profils, frameworks, skills globaux, connexions OAuth.
- **Utilisateur** : accès chat, historique personnel, export, mode vocal, paramètres personnels (avatar, instructions, espace de connaissance).

Chaque instance dispose d'une interface admin permettant à l'admin de créer et gérer les comptes.

---

## 4. Interface & Design

### Principes

- Sobre et fonctionnel, inspiré du style Anthropic/Claude
- Palette principale : noir / gris / blanc
- Typographie lisible, sans éléments décoratifs superflus
- Responsive : fonctionne sur desktop (navigateur) et mobile
- Toggle clair/sombre disponible dans le header

### Layout général

```
┌─────────────────────────────────────────────────────────────┐
│ [≡] [Logo Minou]           [🌙] [Profil actif] [🔊] [↗️]  │  ← Header
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  SIDEBAR     │          FIL DE CONVERSATION                 │
│  (repliable) │                                              │
│              │   [Avatar Minou] Réponse de Minou...         │
│  + Nouvelle  │                                              │
│    conv.     │              Ta question... [Avatar User]    │
│              │                                              │
│  Historique  │   [Avatar Minou] Réponse de Minou...         │
│  (30 max)    │                                              │
│              ├──────────────────────────────────────────────┤
│  Archives    │  [+] [Optimiseur ▾] [Modèle ▾]              │  ← Toolbar
│              │  ┌────────────────────────────────────┐      │
│  ──────────  │  │ Zone de saisie...          [🎤][▶] │      │  ← Saisie
│  [👤] ⚙️    │  └────────────────────────────────────┘      │
│              │  Conversation : 0,003 €                      │  ← Compteurs
│              │  GPT-4o cumulatif : 1,24 €                   │
└──────────────┴──────────────────────────────────────────────┘
```

### Sidebar gauche

Repliable via le bouton hamburger dans le header. Contient :
- Logo Minou en haut
- Bouton "Nouvelle conversation"
- Historique des conversations récentes (30 max), avec croix légère au survol pour suppression rapide, et recherche full-texte
- Section "Archives"
- Bloc utilisateur en bas avec accès aux ⚙️ Paramètres

### Header

De gauche à droite : bouton hamburger (toggle sidebar), logo/nom de l'app, toggle clair/sombre, indicateur du profil actif (lecture seule), bouton TTS global, bouton Exporter.

### Avatars

Chaque utilisateur peut définir son propre avatar depuis Paramètres → Mon profil : upload d'une image ou choix dans une liste d'emojis/icônes. L'avatar s'affiche à côté des bulles utilisateur dans le fil de conversation, en miroir de l'avatar de Minou (🐱 par défaut) côté assistant.

---

## 5. Zone de Saisie & Toolbar

### Toolbar (au-dessus de la zone de texte, de gauche à droite)

**1. Bouton +** — Menu déroulant avec deux sections :
- "Profil" : affiche uniquement le mot "Profil" dans le menu. Un clic ouvre la liste des profils disponibles. La liste est masquée par défaut — jamais visible sans action explicite de l'utilisateur.
- "Fichiers" : trois sous-options — Joindre un fichier, Joindre une photo, OCR — Scanner un texte.
- Le menu se ferme par un clic n'importe où hors du menu.

**2. Optimiseur de prompt** — Dropdown listant les frameworks de prompt disponibles (fichiers `.md` dans `/frameworks/`). Sélectionner un framework transforme silencieusement le message avant envoi — le prompt restructuré n'est pas affiché à l'utilisateur. Option future : afficher le prompt transformé avant envoi. Frameworks initiaux : CARTEL, RISEN, COSTAR, RTF.

**3. Sélecteur de modèle LLM** — Dropdown dynamique, construit à partir des modèles configurés. Inclut "Générateur d'images" comme entrée dédiée pour Gemini Imagen. La liste est rechargée depuis `/api/models` sans redémarrage.

### Zone de texte

Textarea multiligne extensible. À droite de la zone :
- Bouton onde vocale (SVG animé) : ondes au repos, ondes animées en mode vocal actif
- Bouton envoi : rond ▶ pour envoyer, carré ■ pour stopper une inférence en cours

### Commande `/`

Taper `/` dans la zone de saisie ouvre un menu contextuel listant les fonctions disponibles (profils, frameworks, OCR, etc.), à la manière de Notion ou Slack.

### Compteurs de coût (sous la zone de saisie)

Deux compteurs empilés, en petite police grise discrète, alignés à droite :

**Ligne 1 — Conversation en cours :**
`Conversation : 0,003 €`
Coût cumulé de l'échange actif, mis à jour après chaque inférence. Remis à zéro automatiquement à chaque nouvelle conversation.

**Ligne 2 — Cumulatif par modèle :**
`GPT-4o cumulatif : 1,24 €`
Coût total accumulé pour le modèle actif depuis la dernière remise à zéro manuelle. Chaque modèle a son propre compteur indépendant, stocké dans Firestore par compte utilisateur. L'utilisateur remet à zéro manuellement depuis Paramètres → Consommation API, typiquement au moment de recharger son crédit API.

**Calcul du coût :**
```
coût = (tokens_input / 1000 × prix_input) + (tokens_output / 1000 × prix_output)
coût_eur = coût × USD_EUR_RATE
```
Les prix sont lus depuis le `.env`. Le taux de conversion est `USD_EUR_RATE`.

---

## 6. Gestion des Conversations

### Historique

30 conversations actives max par utilisateur. Recherche full-texte dans la sidebar (recherche dans le contenu des messages). Croix légère au survol de chaque conversation pour suppression rapide.

### Titres — Nommage en deux temps

**Au premier message :** le LLM génère immédiatement un titre provisoire (3-6 mots) basé sur ce premier échange. Il apparaît dans la sidebar sans que l'utilisateur ait à faire quoi que ce soit.

**En fin de conversation** (déclencheur : inactivité prolongée ou fermeture explicite) : le LLM génère un titre définitif qui reflète le sujet dominant de l'ensemble de l'échange. Ce titre remplace le titre provisoire.

L'utilisateur peut renommer manuellement le titre à tout moment par un clic dessus dans la sidebar.

### Archivage

Une conversation archivée échappe au comptage des 30. Elle est conservée indéfiniment jusqu'à suppression manuelle. Elle s'ouvre directement comme n'importe quelle conversation active, sans manipulation préalable. La section Archives est accessible depuis la sidebar.

---

## 7. Actions sur les Messages

### Desktop (survol)

Sur chaque **message utilisateur** au survol :
- Icône crayon → modifier la requête
- Icône copie → copier le texte

Sur chaque **réponse assistant** au survol :
- Icône copie → copier la réponse pour collage externe
- Bouton TTS → lire la réponse (API TTS OpenAI)

### Mobile / Tablette (appui long)

Sur écran tactile, le survol n'existe pas. Un **appui long** (long press, ~700ms) sur n'importe quel message fait apparaître un menu d'actions contextuel (crayon, copie, fork, TTS), à la manière de WhatsApp ou iMessage.

### Indicateurs d'état

- Indicateur animé **"Minou réfléchit…"** (trois points pulsants) affiché pendant une inférence en cours
- Bouton ■ stop pour interrompre une inférence en cours (streaming interrompu côté serveur)

### Branches de conversation (fork)

Icône léger au survol d'un message pour forker la conversation à partir de ce point. Crée une branche alternative navigable.

---

## 8. Modèles LLM

### Gestion via l'interface

Dans Paramètres → Modèles, un bouton "Ajouter un modèle" ouvre un formulaire :
- Nom affiché dans l'interface
- Fournisseur (OpenAI / Anthropic / Mistral / Google / autre)
- Clé API : visible uniquement au moment de la saisie, masquée définitivement ensuite. Modifiable uniquement en saisissant une nouvelle valeur.
- Prix input / output (en $/1K tokens)

Le système écrit les valeurs dans le `.env` côté serveur et recharge la liste des modèles sans redémarrage. **Aucune modification du code source n'est nécessaire pour ajouter un modèle.**

### Modèles initiaux

| Nom affiché | Fournisseur | Modèle API |
|---|---|---|
| GPT-4o | OpenAI | gpt-4o |
| Claude Sonnet | Anthropic | claude-sonnet-3-7 |
| Mistral Large | Mistral | mistral-large-latest |
| Gemini 1.5 Pro | Google | gemini-1.5-pro |
| Générateur d'images | Google | imagen-3.0 |

### Génération d'images

Le modèle "Générateur d'images" est une entrée dédiée dans le sélecteur LLM. La génération s'effectue en langage naturel dans le fil de conversation. L'image générée s'affiche directement dans le fil.

---

## 9. Vision & Analyse d'Image

L'utilisateur peut joindre une photo depuis le bouton + → Joindre une photo, ou prendre une photo directement depuis l'interface (sur mobile). La photo est jointe dans le fil de conversation et interrogeable avec le LLM actif (qui doit supporter la vision). Les photos sont converties en base64 côté client et transmises directement à l'API LLM — aucun stockage. Sur mobile, `<input type="file" accept="image/*" capture>` propose automatiquement prise de vue instantanée ou sélection galerie.

---

## 10. OCR

Accessible depuis le bouton + → OCR — Scanner un texte. Déclenche l'appareil photo (mobile) ou l'import d'une image (desktop). L'image est envoyée à l'API Mistral OCR (modèle Pixtral). Le texte extrait est injecté dans le fil de conversation et immédiatement interrogeable avec le LLM actif.

---

## 11. Profils & Skills

### Profils

Les profils sont des expertises métier définies dans des fichiers `.md` stockés dans `/profiles/`. Chaque fichier de profil contient :
- Instructions système de l'expertise
- Description du rôle
- Documents de référence joints
- URLs sources consultables

L'interface in-app permet de créer et modifier des profils (Paramètres → Profils). Un profil est activable à la volée via le bouton + → Profil ou la commande `/`.

### Deux niveaux de skills

**Skills attachés à un profil :** actifs uniquement quand ce profil est sélectionné. Définis dans la config du profil.

**Skills et bases de connaissances globaux :** actifs en permanence, quel que soit le LLM ou le profil actif. Gérés depuis Paramètres → Mes skills & connaissances. Upload `.md` ou `.txt`, activation/désactivation par item.

### Frameworks de prompt

Fichiers `.md` dans `/frameworks/`. Sélectionnables depuis la toolbar ou la commande `/`. Transforment silencieusement le message avant envoi au LLM.

---

## 12. Recherche Web

L'API Sonar de Perplexity est intégrée pour la recherche web temps réel. **Cette fonction est centrale et non optionnelle en V1.** Le LLM décide lui-même de déclencher une recherche selon le contexte.

Dans Paramètres → Sources de recherche, des toggles permettent de limiter les sources :
- Web (Sonar) — toggle
- Notion (V2) — toggle, inactif en V1
- Drive (V2) — toggle, inactif en V1

En V2, l'utilisateur pourra désactiver le web et n'autoriser que Notion.

---

## 13. Vocal

### Mode vocal temps réel

API Realtime OpenAI. Activé par le bouton onde vocale dans la barre de saisie. L'interface ne change pas — le mode cohabite avec le chat texte dans la même vue. Animation d'ondes pendant l'écoute. Le transcript de l'échange vocal est conservé dans le fil de conversation.

### TTS (lecture des réponses)

Bouton TTS sur chaque réponse assistant (desktop : au survol / mobile : dans le menu appui long). API TTS OpenAI (tts-1). Voix neutre, français par défaut. Bouton TTS global dans le header pour activer/désactiver la lecture automatique.

---

## 14. Export

### Formats disponibles
- PDF
- Markdown (`.md`)
- Texte enrichi compatible Word / Google Docs (`.docx`)

### Destinations
- Téléchargement direct (bouton dans le header → Exporter)
- Envoi par email via Gmail API : depuis le compte Gmail de l'utilisateur connecté, vers n'importe quelle adresse

### Résumé LLM

Avant export, le LLM génère un résumé structuré de la conversation. Le résumé est inclus en tête du document exporté.

### Connexion Gmail (OAuth)

Chaque utilisateur connecte son propre compte Gmail depuis Paramètres → Connexions Google. Voir la section OAuth ci-dessous.

---

## 15. Mémoire & Espace de Connaissance Utilisateur

### Contexte glissant

Les LLMs sont stateless — ils ne conservent aucun état entre deux appels API. À chaque message envoyé, le backend inclut automatiquement les **N derniers échanges de la conversation en cours** dans la requête envoyée au LLM. Ce mécanisme est invisible pour l'utilisateur. Il ne s'agit pas d'inclure des conversations passées différentes, mais de maintenir la cohérence au sein d'une même conversation.

La valeur de N est configurable (ex : 20 derniers échanges par défaut), avec un plafond en tokens pour ne pas dépasser la fenêtre de contexte du modèle.

### Mémoire active

Déclenchée par détection sémantique : lorsque le LLM détecte une intention de mémorisation dans le message de l'utilisateur ("souviens-toi que…", "rappelle-toi…", "retiens que…", "note que…", et toute formulation équivalente), il extrait automatiquement l'information et l'écrit dans l'espace de connaissance utilisateur (Firebase, par compte). Confirmation discrète dans l'interface : **"Mémorisé ✓"**.

Ce mécanisme est basé sur la compréhension sémantique du LLM, **pas sur une liste de mots-clés.**

### Espace de connaissance utilisateur

Stocké dans Firebase Firestore, par compte utilisateur. Initialisé par upload d'un fichier `.md` ou `.txt` depuis Paramètres → Mon espace de connaissance. S'enrichit automatiquement via la mémoire active. Accessible et éditable dans les Paramètres (éditeur de texte simple).

À chaque requête, le contenu de cet espace est injecté dans le contexte système envoyé au LLM, permettant à Minou d'en "tenir compte" en permanence.

### Instructions personnalisées

Persistantes par utilisateur. Configurables dans Paramètres → Instructions personnalisées. Injectées en système à chaque requête.

---

## 16. Connexion Google OAuth

### Côté admin (une fois à l'installation)

L'admin crée un projet dans Google Cloud Console et récupère un **Client ID** et un **Client Secret**, qu'il colle dans le `.env`. Scopes à activer : Gmail, Google Drive, Google Calendar, Google Contacts. Le CLAUDE.md doit inclure un guide étape par étape pour cette configuration.

**Étapes :**
1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet (ex : "Minou App")
3. Activer les APIs : Gmail API, Google Drive API, Google Calendar API, People API
4. Aller dans "Identifiants" → "Créer des identifiants" → "ID client OAuth 2.0"
5. Type d'application : Application Web
6. Ajouter les URI de redirection autorisées :
   - `http://localhost:3000/auth/google/callback` (développement)
   - `https://[votre-domaine]/auth/google/callback` (production)
7. Copier le Client ID et le Client Secret dans le `.env`

### Côté utilisateur (dans l'app)

Dans Paramètres → Connexions Google, bouton "Connecter Google". Lance le flux OAuth standard Google. L'utilisateur se connecte avec son compte Google, lit et accepte les permissions. Google renvoie un token stocké côté serveur (Firebase). L'utilisateur ne voit aucun code, aucun fichier, aucune clé.

**Avertissement "application non vérifiée" :** Google affiche cet avertissement pour les apps non passées par le processus de validation. C'est systématique pour une installation personnelle. L'utilisateur peut passer outre via "Avancé" → "Accéder à [nom de l'app]". Le guide intégré (Paramètres → Aide) explique ce point pas à pas.

---

## 17. Paramètres — Structure complète

La section Paramètres est accessible depuis le bas de la sidebar. Elle est organisée en sous-sections :

| Sous-section | Contenu |
|---|---|
| Modèles LLM | Ajout, édition, suppression de modèles via formulaire in-app |
| Profils | Création et gestion des profils d'expertise |
| Frameworks | Gestion des frameworks de prompt (`.md`) |
| Mes skills & connaissances | Skills globaux actifs en permanence |
| Mon espace de connaissance | Upload et édition de la base de connaissance personnelle |
| Instructions personnalisées | Instructions système persistantes par utilisateur |
| Connexions Google | Connexion OAuth Gmail, Drive, Calendar, Contacts |
| Sources de recherche | Toggles par source (Web, Notion V2, Drive V2...) |
| Consommation API | Compteurs cumulatifs par modèle, reset individuel |
| Mon profil | Avatar (upload image ou emoji), préférences d'affichage |
| Comptes utilisateurs | Admin uniquement — création et gestion des comptes |
| Aide & Guide | Guide utilisateur intégré (voir section 18) |

---

## 18. Guide Utilisateur Intégré (Paramètres → Aide & Guide)

Accessible uniquement depuis les Paramètres, en dernière entrée du menu (icône ? ou intitulé "Aide & Guide"). Ce guide est destiné aux utilisateurs non-techniques qui reçoivent l'application sans accompagnement.

Structuré en **fiches thématiques** avec étapes numérotées. Ton : tutoriel grand public, phrases courtes, zéro acronyme non expliqué. Chaque fiche se termine par un encadré "Que faire si ça ne marche pas ?".

### Fiches à implémenter

**Ajouter un skill global** — Structure attendue d'un fichier `.md`, comment le déposer depuis Paramètres → Mes skills & connaissances, comment vérifier qu'il est actif.

**Créer ou modifier un profil** — Comment créer un profil depuis Paramètres → Profils, quels champs renseigner, comment activer/désactiver un profil dans la conversation.

**Ajouter un framework de prompt** — Comment déposer un fichier `.md`, le nommer, l'activer depuis la toolbar.

**Ajouter ou modifier un modèle LLM** — Comment accéder au formulaire dans Paramètres → Modèles, comment obtenir une clé API (avec liens directs vers OpenAI, Anthropic, Mistral, Google), pourquoi la clé est masquée, comment modifier les prix.

**Connecter son compte Google (OAuth)** — Étapes pas à pas, explication de chaque permission demandée, et explication de l'avertissement "application non vérifiée" (normal, pas un problème, passage outre via "Avancé").

**Ajouter un connecteur MCP (V2)** — Qu'est-ce qu'un connecteur MCP, comment déposer un dossier dans `/integrations/`, comment l'activer depuis Paramètres → Intégrations, précision que l'activation ne déclenche rien automatiquement.

**Gérer l'espace de connaissance** — Qu'est-ce que c'est, comment l'alimenter (upload ou saisie directe), comment le modifier ou le vider.

**Réinitialiser un compteur de consommation API** — Où accéder, quand le remettre à zéro, comment resetter un modèle individuel.

**Exporter une conversation** — Formats disponibles, comment déclencher l'export, comment envoyer par email.

**Gérer son avatar** — Upload image ou choix emoji depuis Paramètres → Mon profil.

**Activer / désactiver les sources de recherche** — Explication de chaque toggle, ce que chaque source implique concrètement.

---

## 19. Architecture MCP — Anticipée dès V1, Déployée en V2

### Principe

Chaque intégration est un **connecteur MCP autonome** dans un dossier `/integrations/<nom-du-service>/`, contenant son propre fichier de configuration et ses propres instructions. L'ajout d'une nouvelle intégration en V3 ou au-delà ne nécessite pas de modifier le cœur de l'application — il suffit de déposer un nouveau dossier et de l'activer dans les Paramètres.

**La liste des intégrations est ouverte et non prédéterminée dans le code.**

### Intégrations V2 initiales

- Notion
- Google Calendar
- Gmail
- Google Drive
- Google Contacts

### Capacités V2

L'agent pourra : lire un document Drive, vérifier un agenda, proposer un RDV, envoyer un mail, créer une page Notion, consulter les contacts.

### Mode d'activation

À la demande selon le contexte détecté — pas actif en permanence en arrière-plan. L'utilisateur peut aussi activer/désactiver des connecteurs depuis Paramètres → Intégrations.

### Architecture multi-agents (V2+)

Un agent orchestrateur délègue à des sous-agents spécialisés (agent Notion, agent Calendar, etc.).

---

## 20. Distribution & Installation

L'application est distribuée gratuitement. Chaque destinataire installe sa propre instance. Pour les utilisateurs non-techniques : un installateur interactif guide l'ensemble du processus et génère le `.env` sans manipulation manuelle.

Le code est conçu pour être **autonome et auto-suffisant par instance.**

---

## 21. Limites de la V1

- Minou V1 est un assistant augmenté, pas un agent autonome
- Il ne découvre pas et ne se connecte pas seul à de nouvelles APIs
- Il agit uniquement dans les systèmes explicitement intégrés
- La mémoire cross-sessions est limitée à la fenêtre de contexte glissant + la base de connaissance Firebase
- Les intégrations MCP agentiques sont réservées à la V2

---

## 22. Structure du Code — État actuel

### Arborescence
```
minou/
├── client/                    # Frontend React 19 + Vite + Tailwind
│   └── src/
│       ├── App.jsx            # Composant racine, layout principal
│       ├── index.css          # Variables CSS (thème), import Tailwind
│       ├── contexts/
│       │   ├── AuthContext.jsx  # Firebase Auth, hook useAuth()
│       │   └── ChatContext.jsx  # État conversation, hook useChat()
│       ├── pages/
│       │   └── LoginPage.jsx    # Formulaire email/password Firebase Auth
│       └── components/
│           ├── Header.jsx       # Hamburger, toggle thème, actions globales
│           ├── Sidebar.jsx      # Historique conversations, navigation
│           ├── MessageList.jsx  # Fil de messages, scroll automatique
│           ├── InputArea.jsx    # Textarea, envoi, compteurs de coût (simulés)
│           └── ModelSelector.jsx # Dropdown modèle LLM chargé depuis /api/models
├── server/                    # Backend Express
│   ├── index.js               # Point d'entrée, montage des routes
│   └── routes/
│       ├── auth.js            # Vérification token Firebase JWT + middleware requireAuth
│       ├── chat.js            # Envoi message LLM (streaming SSE — à implémenter)
│       ├── models.js          # Liste modèles LLM (lit les prix depuis .env)
│       ├── conversations.js   # CRUD conversations Firestore
│       ├── memory.js          # Espace de connaissance utilisateur Firestore
│       └── export.js          # Export PDF / Markdown / Word
├── .env.example               # Template des variables d'environnement
└── CLAUDE.md                  # Ce fichier
```

### Commandes de développement
```bash
# Frontend (depuis /client)
npm run dev       # Lance Vite sur http://localhost:5173

# Backend (depuis /server)
node index.js     # Lance Express sur http://localhost:3001

# Le proxy Vite redirige automatiquement /api/* → localhost:3001
```

### Ce qui reste à implémenter (par priorité)
1. **Installer `firebase-admin`** dans `/server` : `npm install firebase-admin` — requis pour toutes les routes Firestore côté backend
2. **Streaming chat** (`server/routes/chat.js`) : appels SSE vers OpenAI / Anthropic / Mistral / Gemini
3. **Markdown** dans `MessageList.jsx` : intégrer `marked` + `highlight.js`
4. **Conversations Firestore** : CRUD complet dans `conversations.js` + affichage sidebar

### Ce qui est fait ✅
- Structure complète client (React/Vite/Tailwind) + server (Express) scaffoldée
- Firebase Auth branché — `firebase.js`, `AuthContext.jsx`, `LoginPage.jsx`
- `ModelSelector.jsx` fonctionnel — charge depuis `GET /api/models`, groupe par provider, met à jour le contexte
- Page de login fonctionnelle — email/mot de passe Firebase
- Utilisateur créé dans Firebase Console (projet `minou-3850`)
- Firestore activé en mode test (région `eur3`)
- Firebase Storage supprimé définitivement → images en base64 directement à l'API LLM
- `.env` créé depuis `.env.example`

---

## 22. Conventions de Code

- Tout le code est commenté en **français**
- Les variables et fonctions sont nommées en **anglais** (convention standard)
- Les fichiers de config (`.env`, `.md`) sont rédigés en **anglais** pour la portabilité
- Le frontend et toute l'interface utilisateur s'expriment en **français**
- Chaque composant React est dans son propre fichier
- Le backend est organisé en routes Express séparées par domaine fonctionnel (`/api/chat`, `/api/models`, `/api/conversations`, `/api/export`, `/api/auth`, `/api/memory`, etc.)

---

---

## 23. Écosystème RAG — Décisions d'architecture (mars 2026)

### Projet Mek Rag

Un projet distinct, **Mek Rag**, sera développé après Minou V2. Il est à connaître dès maintenant car il aura des **incidences mutuelles** avec Minou — les deux projets s'influenceront l'un l'autre.

### Série de RAGs envisagée

Mek Rag sera vraisemblablement le **premier d'une série**. D'autres RAGs dédiés sont anticipés :
- RAG sur **Mm80**
- RAG sur **Notion**
- RAG sur **GitHub**
- Potentiellement d'autres

### Conséquences pour Minou

L'architecture de Minou (V1 et V2) doit **anticiper l'interopérabilité avec ces RAGs** — notamment au niveau de l'architecture MCP (section 19) qui sera le point d'entrée naturel pour les connecter. Ne pas concevoir Minou comme un silo fermé.

---

*Brief rédigé en mars 2026 — Medwin & Claude*
*Version : 1.0 — À mettre à jour au fil des décisions techniques prises avec Claude Code*
