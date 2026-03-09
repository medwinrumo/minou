// Point d'entrée du serveur Express — Minou
const express = require('express');
const cors    = require('cors');
require('dotenv').config({ path: '../.env' });

const app  = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/chat',          require('./routes/chat'));
app.use('/api/models',        require('./routes/models'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/memory',        require('./routes/memory'));
app.use('/api/export',        require('./routes/export'));

// Healthcheck
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Serveur Minou démarré sur http://localhost:${PORT}`);
});
