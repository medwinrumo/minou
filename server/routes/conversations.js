// Route /api/conversations — CRUD des conversations (Firebase Firestore)
const express = require('express');
const router  = express.Router();
// TODO: initialiser firebase-admin

// GET /api/conversations — liste des 30 conversations de l'utilisateur
router.get('/', async (req, res) => {
  // TODO: récupérer depuis Firestore collection `conversations` où userId == req.user.uid
  res.status(501).json({ error: 'Non implémenté.' });
});

// POST /api/conversations — créer une nouvelle conversation
router.post('/', async (req, res) => {
  // TODO: créer un document dans Firestore
  res.status(501).json({ error: 'Non implémenté.' });
});

// PATCH /api/conversations/:id — mettre à jour (titre, archivage...)
router.patch('/:id', async (req, res) => {
  res.status(501).json({ error: 'Non implémenté.' });
});

// DELETE /api/conversations/:id
router.delete('/:id', async (req, res) => {
  res.status(501).json({ error: 'Non implémenté.' });
});

module.exports = router;
