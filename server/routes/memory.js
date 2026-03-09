// Route /api/memory — Espace de connaissance utilisateur (Firebase Firestore)
const express = require('express');
const router  = express.Router();

// GET /api/memory — récupère la base de connaissance de l'utilisateur
router.get('/', async (req, res) => {
  // TODO: récupérer depuis Firestore doc `memory/{userId}`
  res.status(501).json({ error: 'Non implémenté.' });
});

// PUT /api/memory — remplace la base de connaissance complète
router.put('/', async (req, res) => {
  // TODO: écrire dans Firestore
  res.status(501).json({ error: 'Non implémenté.' });
});

// POST /api/memory/append — ajoute une entrée (mémoire active déclenchée par le LLM)
router.post('/append', async (req, res) => {
  const { content } = req.body;
  // TODO: ajouter à la base existante dans Firestore
  res.status(501).json({ error: 'Non implémenté.' });
});

module.exports = router;
