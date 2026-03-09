// Route /api/auth — Vérification du token Firebase JWT
const express = require('express');
const router  = express.Router();
// TODO: initialiser firebase-admin avec les credentials .env
// const admin = require('firebase-admin');

// Middleware d'auth réutilisable dans les autres routes
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant.' });

  try {
    // TODO: décommenter quand firebase-admin est configuré
    // req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide.' });
  }
}

// GET /api/auth/me — vérifie que le token est valide
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
module.exports.requireAuth = requireAuth;
