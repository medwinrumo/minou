// Header — hamburger, logo, toggle thème, profil actif, TTS global, export
export default function Header({ onToggleSidebar, theme, onToggleTheme }) {
  return (
    <header
      className="flex items-center justify-between px-4 h-12 flex-shrink-0"
      style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Gauche */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-lg hover:opacity-70 transition"
          title="Menu"
        >
          ☰
        </button>
        <span className="font-medium text-sm">Minou</span>
      </div>

      {/* Droite */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTheme}
          className="text-sm hover:opacity-70 transition"
          title="Basculer clair/sombre"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* TODO: indicateur profil actif */}
        {/* TODO: bouton TTS global */}
        {/* TODO: bouton export */}
      </div>
    </header>
  );
}
