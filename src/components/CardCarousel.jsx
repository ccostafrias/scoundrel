import React, { useState } from 'react';
import { findCard } from '../utils/cardsFunctions';

export default function CardCarousel(props) {
    const {
        actualDeck,
    } = props

    const card = {value: 'A', suit: 'Paus'}
    const [r, c] = findCard(actualDeck.order, card)
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
    }

    const bgImg = { backgroundImage: `url(${import.meta.env.BASE_URL}${actualDeck.src})` }

    return (
        <div className='card-place' style={style}>
            <div className='card' style={style}>
                <div className="flip">
                    <div className='card-front' style={bgImg}></div>
                    <div className='card-back' style={bgImg}/>
                </div>
            </div>
        </div>
    )

}