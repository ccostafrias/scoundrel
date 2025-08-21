import { findCard } from './cardsFunctions';

export function getCardStyle(card, actualDeck) {
  const [r, c] = findCard(actualDeck.order, card);

  const style = {
    '--c': c,
    '--r': r,
    '--sprite-w': actualDeck.width,
    '--sprite-h': actualDeck.height,
    '--tot-c': actualDeck.cols,
    '--tot-r': actualDeck.rows,
    '--back-c': actualDeck.backC,
    '--back-r': actualDeck.backR,
    '--pad-x': actualDeck.padX,
    '--pad-y': actualDeck.padY,
    '--aspect': `${actualDeck.width}/${actualDeck.height}`,
  };

  const bgImg = { backgroundImage: `url(${import.meta.env.BASE_URL}${actualDeck.src})` }

  return {style, bgImg};
}
