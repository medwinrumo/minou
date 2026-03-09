// Zone de saisie — textarea + bouton envoi, toolbar modèle
import { useState, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function InputArea() {
  const { addMessage, isStreaming, setIsStreaming, provider, model } = useChat();
  const [text, setText] = useState('');
  const textareaRef     = useRef(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }

  async function handleSend() {
    const content = text.trim();
    if (!content || isStreaming) return;

    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    addMessage('user', content);
    setIsStreaming(true);

    try {
      // TODO: appeler /api/chat avec streaming SSE
      // Provisoire : simule une réponse
      await new Promise(r => setTimeout(r, 800));
      addMessage('assistant', `(Réponse de ${model} — à implémenter)`);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Compteurs de coût */}
      <div className="flex justify-end gap-4 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>Conversation : 0,000 €</span>
        <span>{model} cumulatif : 0,000 €</span>
      </div>

      {/* Zone de saisie */}
      <div
        className="flex items-end gap-2 rounded-xl px-3 py-2"
        style={{ background: 'var(--bg-bubble-ai)', border: '1px solid var(--border)' }}
      >
        {/* TODO: bouton + (joindre fichier, profil, OCR) */}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => { setText(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          placeholder="Envoie un message…"
          rows={1}
          disabled={isStreaming}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed"
          style={{ color: 'var(--text-primary)', maxHeight: '200px' }}
        />

        {/* Bouton envoi / stop */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition disabled:opacity-30"
          style={{ background: 'var(--accent)' }}
        >
          {isStreaming ? '■' : '▶'}
        </button>
      </div>
    </div>
  );
}
