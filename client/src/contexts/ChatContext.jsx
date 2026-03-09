// Contexte du chat — état global de la conversation en cours
import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages]         = useState([]);        // messages de la conversation active
  const [isStreaming, setIsStreaming]   = useState(false);     // inférence en cours
  const [provider, setProvider]         = useState('anthropic');
  const [model, setModel]               = useState('claude-sonnet-4-6');
  const [conversationId, setConversationId] = useState(null);  // ID Firestore

  // Démarre une nouvelle conversation vide
  const newConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  // Ajoute un message dans le fil
  const addMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { role, content, id: Date.now() }]);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages, setMessages,
      isStreaming, setIsStreaming,
      provider, setProvider,
      model, setModel,
      conversationId, setConversationId,
      newConversation,
      addMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
