// Route /api/models — Liste des modèles LLM disponibles
const express = require('express');
const router  = express.Router();

// Les modèles sont définis dans .env (prix) et ici (structure)
// Permet d'ajouter un modèle sans toucher au code frontend
function getModels() {
  return [
    {
      id:       'gpt-4o',
      label:    'GPT-4o',
      provider: 'openai',
      priceInput:  parseFloat(process.env.GPT4O_PRICE_INPUT  || '0.0025'),
      priceOutput: parseFloat(process.env.GPT4O_PRICE_OUTPUT || '0.010'),
      vision:   true,
    },
    {
      id:       'claude-sonnet-4-6',
      label:    'Claude Sonnet',
      provider: 'anthropic',
      priceInput:  parseFloat(process.env.CLAUDE_SONNET_PRICE_INPUT  || '0.003'),
      priceOutput: parseFloat(process.env.CLAUDE_SONNET_PRICE_OUTPUT || '0.015'),
      vision:   true,
    },
    {
      id:       'mistral-large-latest',
      label:    'Mistral Large',
      provider: 'mistral',
      priceInput:  parseFloat(process.env.MISTRAL_LARGE_PRICE_INPUT  || '0.002'),
      priceOutput: parseFloat(process.env.MISTRAL_LARGE_PRICE_OUTPUT || '0.006'),
      vision:   false,
    },
    {
      id:       'gemini-1.5-pro',
      label:    'Gemini 1.5 Pro',
      provider: 'google',
      priceInput:  parseFloat(process.env.GEMINI_PRO_PRICE_INPUT  || '0.00125'),
      priceOutput: parseFloat(process.env.GEMINI_PRO_PRICE_OUTPUT || '0.005'),
      vision:   true,
    },
    {
      id:       'imagen-3.0',
      label:    'Générateur d\'images',
      provider: 'google',
      type:     'image',
    },
  ];
}

// GET /api/models — retourne la liste complète
router.get('/', (req, res) => {
  res.json(getModels());
});

module.exports = router;
