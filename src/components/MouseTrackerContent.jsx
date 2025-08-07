import React, { useEffect } from 'react'
import '../styles/MouseTracker.css'

export default function MouseTrackerContent(props) {
    const { 
        target,
        hasPotted,
        weapon,
        sub,
     } = props;
    if (!target || !target.card) return null;

    const icon = 
        (target.card.suit == 'Espadas' || target.card.suit == 'Paus') ? 'sword'
        : target.card.suit === 'Copas' ? 'potion'
        : target.card.suit === 'Ouros' ? 'weapon'
        : ''

    const signal = 
        (target.card.suit == 'Espadas' || target.card.suit == 'Paus') ? '-' 
        : target.card.suit === 'Copas' ? '+'
        : ''

    const secondaryText = 
        (target.card.suit == 'Copas' && hasPotted) ? 0
        : (target.card.suit == 'Espadas' || target.card.suit == 'Paus') && weapon && sub !== target.card.power ? -sub
        : '';

    return (
        <div className='mouse-tracker-content'>
            <div className={`tracker-icon ${icon}`}>
            </div>
            <span className={`tracker-signal ${icon}`}>
                {signal}
            </span>
            <span className={`tracker-value ${secondaryText !== '' ? 'dashed' : ''} ${icon}`}>
                {target.card.power}
            </span>
            {secondaryText !== '' && (
                <span className={`tracker-secondary-value ${secondaryText !== 0 ? icon : ''}`}>
                    {secondaryText}
                </span>
            )}
        </div>
    );
}