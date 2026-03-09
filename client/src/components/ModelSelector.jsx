// Sélecteur de modèle LLM — chargé depuis /api/models
import { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';

const PROVIDERS_ORDER = ['openai', 'anthropic', 'mistral', 'google'];
const PROVIDER_LABELS = { openai: 'OpenAI', anthropic: 'Anthropic', mistral: 'Mistral', google: 'Google' };

export default function ModelSelector() {
  const { provider, setProvider, model, setModel } = useChat();
  const [models, setModels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Charge la liste depuis le serveur
  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(setModels)
      .catch(() => {}); // silencieux si serveur pas encore dispo
  }, []);

  const currentLabel = models.find(m => m.id === model)?.label || model;

  // Grouper par provider
  const grouped = PROVIDERS_ORDER.reduce((acc, p) => {
    const items = models.filter(m => m.provider === p);
    if (items.length) acc[p] = items;
    return acc;
  }, {});

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="text-xs px-3 py-1 rounded-lg hover:bg-white/10 transition"
        style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      >
        {currentLabel} ▾
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full mb-2 left-0 rounded-xl py-2 w-48 z-50 text-sm"
          style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border)' }}
        >
          {Object.entries(grouped).map(([p, items]) => (
            <div key={p}>
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {PROVIDER_LABELS[p]}
              </div>
              {items.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setProvider(m.provider); setModel(m.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-1.5 hover:bg-white/10 transition ${m.id === model ? 'font-medium' : ''}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
