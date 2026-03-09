// Composant racine — layout principal de Minou
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Header      from './components/Header';
import Sidebar     from './components/Sidebar';
import MessageList from './components/MessageList';
import InputArea   from './components/InputArea';
import LoginPage   from './pages/LoginPage';

// Contenu principal — affiché uniquement si connecté
function AppContent() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme]             = useState('dark');

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ color: 'var(--text-muted)' }}>
        Chargement…
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen">
        <Header
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex flex-col flex-1 overflow-hidden">
            <MessageList />
            <InputArea />
          </main>
        </div>
      </div>
    </ChatProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
