export function findCard(matriz, cartaRef) {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      const carta = matriz[i][j];
      if (carta.value === cartaRef.value && carta.suit === cartaRef.suit) {
        return [i, j]; // Linha e Coluna
      }
    }
  }
  return null // Não encontrada
}

export function fillRoomWithDungeonCards(roomCards, dungeonCards) {
  let filledRoom = [];
  let usedIndexes = [];

  let dungeonIndex = 0;

  for (let i = 0; i < roomCards.length; i++) {
    if (roomCards[i]) {
      filledRoom = [...filledRoom, {...roomCards[i]}];
    } else if (dungeonIndex < dungeonCards.length) {
      filledRoom = [...filledRoom, { ...dungeonCards[dungeonIndex] }]
      usedIndexes = [...usedIndexes, dungeonIndex];
      dungeonIndex++;
    } else {
      filledRoom = [...filledRoom, null]
    }
  }

  let updatedDungeon = dungeonCards.filter((_, idx) => !usedIndexes.includes(idx));

  return {
    filledRoom,
    updatedDungeon,
  };
}
