// Sidebar gauche — historique des conversations, navigation
import { useChat } from '../contexts/ChatContext';

export default function Sidebar({ isOpen }) {
  const { newConversation } = useChat();

  // TODO: charger l'historique depuis /api/conversations

  return (
    <aside
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
      className={`flex flex-col h-full w-64 flex-shrink-0 transition-all duration-200 ${isOpen ? '' : 'hidden'}`}
    >
      {/* Logo */}
      <div className="p-4 text-xl font-semibold" style={{ borderBottom: '1px solid var(--border)' }}>
        🐱 Minou
      </div>

      {/* Bouton nouvelle conversation */}
      <div className="p-3">
        <button
          onClick={newConversation}
          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition"
        >
          + Nouvelle conversation
        </button>
      </div>

      {/* Liste des conversations (TODO) */}
      <div className="flex-1 overflow-y-auto px-2">
        <p className="text-xs px-2 py-1" style={{ color: 'var(--text-muted)' }}>
          Historique (à venir)
        </p>
      </div>

      {/* Bas de sidebar — Paramètres */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition">
          ⚙ Paramètres
        </button>
      </div>
    </aside>
  );
}
