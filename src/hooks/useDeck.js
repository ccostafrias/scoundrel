import { useState, useEffect, useCallback } from 'react';

export default function useDeck() {
  const [baralho, setBaralho] = useState([]);

  // Gera o baralho sem as cartas restritas
  const gerarBaralho = useCallback(() => {
    const suits = ['Copas', 'Ouros', 'Paus', 'Espadas'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    // const values = ['2', '3', '4']
    // const values = ['A', 'J', 'Q', 'K']
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
    const n = cartas.length;
    let indices = [...Array(n).keys()]

    // Gera uma permutação qualquer dos índices
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Corrige posições fixas (elemento na mesma posição)
    for (let i = 0; i < n; i++) {
      if (indices[i] === i) {
        // se for o último elemento, troca com qualquer anterior
        if (i === n - 1) {
          [indices[i], indices[i - 1]] = [indices[i - 1], indices[i]]
        } else {
          [indices[i], indices[i + 1]] = [indices[i + 1], indices[i]]
        }
      }
    }

    // monta o resultado final
    return indices.map(i => cartas[i]);
  }, []);

  // Gera e embaralha ao iniciar
  useEffect(() => {
    const novo = gerarBaralho();
    const embaralhado = embaralharCartas(novo);
    setBaralho(embaralhado);
  }, [gerarBaralho, embaralharCartas]);

  return [baralho, embaralharCartas];
}
