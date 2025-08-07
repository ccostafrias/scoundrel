import { createContext, useContext, useState, useEffect } from 'react';

const DeckContext = createContext();
const LOCAL_KEY = 'currentDeckName';

export function DeckProvider({ children }) {
  const [deckName, setDeckName] = useState('set_2');

  // Carrega o valor do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved !== null) {
      setDeckName(Number(saved));
    }
  }, []);

  // Atualiza localStorage sempre que o deck mudar
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, deckName);
  }, [deckName]);

  return (
    <DeckContext.Provider value={{ deckName, setDeckName }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  return useContext(DeckContext);
}
