// Route /api/export — Export de conversation (PDF, Markdown, Word)
const express = require('express');
const router  = express.Router();

// POST /api/export — génère le fichier d'export
router.post('/', async (req, res) => {
  const { conversationId, format } = req.body;
  // format : 'pdf' | 'markdown' | 'docx'

  // TODO: récupérer la conversation depuis Firestore
  // TODO: demander un résumé au LLM
  // TODO: générer le fichier selon le format
  // TODO: retourner le fichier en téléchargement ou l'envoyer par Gmail API

  res.status(501).json({ error: 'Non implémenté.' });
});

module.exports = router;
