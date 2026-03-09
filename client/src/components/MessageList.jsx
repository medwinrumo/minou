// Fil de conversation — liste des messages
import { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function MessageList() {
  const { messages, isStreaming } = useChat();
  const bottomRef = useRef(null);

  // Scroll automatique au dernier message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
        <div className="text-4xl">🐱</div>
        <div className="text-xl font-medium">Minou</div>
        <div className="text-sm">Choisissez un modèle et commencez à écrire.</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
            style={{ background: 'var(--border)' }}
          >
            {msg.role === 'user' ? '👤' : '🐱'}
          </div>

          {/* Bulle */}
          <div
            className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
            style={{
              background: msg.role === 'user' ? 'var(--bg-bubble-user)' : 'var(--bg-bubble-ai)',
              color: 'var(--text-primary)',
            }}
          >
            {/* TODO: rendu markdown avec marked.js */}
            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
          </div>
        </div>
      ))}

      {/* Indicateur "Minou réfléchit…" */}
      {isStreaming && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--border)' }}>
            🐱
          </div>
          <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: 'var(--bg-bubble-ai)', color: 'var(--text-muted)' }}>
            Minou réfléchit…
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
