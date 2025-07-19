import { useState, useEffect, useCallback } from 'react';

export default function useBaralho() {
  const [baralho, setBaralho] = useState([]);

  // Gera o baralho sem as cartas restritas
  const gerarBaralho = useCallback(() => {
    const suits = ['Copas', 'Ouros', 'Paus', 'Espadas'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const powerMap = {
      A: 14,
      J: 11,
      Q: 12,
      K: 13
    }

    const novoBaralho = [];

    let id = 0

    for (const suit of suits) {
      for (const value of values) {
        const isFigura = ['A', 'J', 'Q', 'K'].includes(value)
        const isCopasOuOuros = suit === 'Copas' || suit === 'Ouros'
        
        if (isFigura && isCopasOuOuros) continue

        const power = powerMap[value] || parseInt(value)

        novoBaralho.push({ value, suit, power, id: id++ });
      }
    }

    return novoBaralho;
  }, []);

  // Embaralha usando Fisher-Yates
  const embaralharCartas = useCallback((cartas) => {
    const array = [...cartas];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);

  // Gera e embaralha ao iniciar
  useEffect(() => {
    const novo = gerarBaralho();
    const embaralhado = embaralharCartas(novo);
    setBaralho(embaralhado);
  }, [gerarBaralho, embaralharCartas]);

  // Função exposta para embaralhar de novo
  const embaralhar = () => {
    setBaralho((prev) => embaralharCartas(prev));
  };

  return [baralho, embaralhar];
}
