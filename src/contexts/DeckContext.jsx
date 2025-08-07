import { createContext, useContext, useState, useEffect } from 'react';

const DeckContext = createContext();

const DECKS = ['Fogo', 'Gelo', 'Raio', 'Sombras']; // Pode trocar pelos seus baralhos reais
const LOCAL_KEY = 'currentDeckIndex';

export function DeckProvider({ children }) {
  const [deckIndex, setDeckIndex] = useState(0);

  // Carrega o valor do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved !== null) {
      setDeckIndex(Number(saved));
    }
  }, []);

  // Atualiza localStorage sempre que o deck mudar
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, deckIndex);
  }, [deckIndex]);

  const nextDeck = () => {
    setDeckIndex((prev) => (prev + 1) % DECKS.length);
  };

  const prevDeck = () => {
    setDeckIndex((prev) => (prev - 1 + DECKS.length) % DECKS.length);
  };

  const currentDeck = DECKS[deckIndex];

  return (
    <DeckContext.Provider value={{ currentDeck, deckIndex, nextDeck, prevDeck }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  return useContext(DeckContext);
}
