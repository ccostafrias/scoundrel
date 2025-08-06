import React from 'react';

export default function MouseTrackerContent(props) {
    const { 
        target,
        hasPotted,
        weapon,
     } = props;
    if (!target || !target.card) return null;

    const signal = 
        (target.card.suit == 'Espadas' || target.card.suit == 'Paus') ? '-' 
        : target.card.suit === 'Copas' ? '+'
        : ''

    const secondaryText = 
        (target.card.signal == 'Ouros' && hasPotted) ? '0' 
        : (target.card.suit == 'Espadas' || target.card.suit == 'Paus') && weapon ? Math.max(0, target.card.power - weapon.power)
        : '';

    return (
        <div className='mouse-tracker-content'>
            <div className='tracker-icon'></div>
            <span className='tracker-signal'>
                {signal}
            </span>
            <span className={`tracker-value ${secondaryText ? 'dashed' : ''}`}>
                {target.card.power}
            </span>
            {secondaryText && (
                <span className="tracker-secondary-value">
                    {secondaryText}
                </span>
            )}
        </div>
    );
}