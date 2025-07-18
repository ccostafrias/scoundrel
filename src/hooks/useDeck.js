import { useState, useEffect, useCallback } from 'react';

export default function useBaralho() {
  const [baralho, setBaralho] = useState([]);

  // Gera o baralho sem as cartas restritas
  const gerarBaralho = useCallback(() => {
    const naipes = ['Copas', 'Ouros', 'Paus', 'Espadas'];
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    const novoBaralho = [];

    for (const naipe of naipes) {
      for (const valor of valores) {
        const isFigura = ['A', 'J', 'Q', 'K'].includes(valor);
        const isCopasOuOuros = naipe === 'Copas' || naipe === 'Ouros';
        
        if (isFigura && isCopasOuOuros) continue;

        novoBaralho.push({ valor, naipe });
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
