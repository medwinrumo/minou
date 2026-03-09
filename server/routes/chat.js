// Route /api/chat — Envoi de message au LLM sélectionné
const express = require('express');
const router  = express.Router();
// TODO: ajouter firebase auth middleware

router.post('/', async (req, res) => {
  const { messages, provider, model, profileContext, memoryContext } = req.body;

  if (!messages || !provider || !model) {
    return res.status(400).json({ error: 'Paramètres manquants : messages, provider, model requis.' });
  }

  // TODO: récupérer la clé API depuis process.env selon le provider
  // TODO: implémenter le streaming SSE
  // TODO: calculer et retourner les tokens utilisés pour le compteur de coût

  res.status(501).json({ error: 'Chat non encore implémenté.' });
});

module.exports = router;
