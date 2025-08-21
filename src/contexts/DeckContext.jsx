import { createContext, use, useState, useEffect } from 'react';

import { deckConfig } from '../utils/deckConfig'

const DeckContext = createContext();
const LOCAL_KEY = 'currentDeckName';

export function DeckProvider({ children }) {
  const [deckName, setDeckName] = useState(localStorage.getItem(LOCAL_KEY) || 'set_2');

  // Atualiza localStorage sempre que o deck mudar
  useEffect(() => {
    let save = !deckConfig[deckName] ? 'set_2' : deckName
    localStorage.setItem(LOCAL_KEY, save);
  }, [deckName]);

  return (
    <DeckContext.Provider value={{ deckName, setDeckName }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeckTheme() {
  return use(DeckContext)
}
