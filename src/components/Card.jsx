import React, { useState, useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'
import { getCardStyle } from '../utils/getCardStyle'

const animations = {
    start: {
        initial: {
            y: window.innerHeight,
            x: -window.innerWidth,
            rotate: -10,
        },
        transition: {
            duration: 0.7,
            ease: 'easeOut',
        },
        delay: (i) => i * 0.05
    },
    dungeon: {
        animateY: (i) => -i * .5,
        animate: { rotate: 0  },
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
        delay: (i) => i * 0.2,
        flip: { rotateY: 0 },
        flipTransition: {
            duration: 0.5,
            ease: 'backInOut',
        },
        flipDelay: (i) => i * 0.1,
    },
    equipped: {
        animateX: (i) => i !== 0 ? 15 + i * 25 : 0,
        animateY: (i) => i !== 0 ? 5 + i * 15 : 0,
        animate: { rotate: 0 },
        flip: { rotateY: -180 },
    },
    discard: {
        animateY: (i) => -i * .5,
        animate: { rotate: 0 },
        flip: { rotateY: 0 },
    },
    room: {
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
        flip: { rotateY: -180 },
    },
    roomAvoid: {
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
        delay: (i) => i * 0.1 + 0.7,
        flip: { rotateY: -180 },
        flipTransition: {
            duration: 0.4,
            ease: 'backInOut',
        },
        flipDelay: (i) => i * 0.1,
    }

}

function Card(props) {
    const {
        card,
        index,
        actualDeck,
        onAnimationComplete = () => {},
    } = props

    const {id, cameFrom, goingTo} = card
    const {style, bgImg} = getCardStyle(card, actualDeck)

    return (
        <motion.div
            layoutId={`card-${id}`}
            className='card'
            initial={animations[cameFrom]?.initial}
            animate={{
                ...animations[goingTo]?.animate, 
                y: animations[goingTo]?.animateY ? animations[goingTo].animateY(index) : 0,
                x: animations[goingTo]?.animateX ? animations[goingTo].animateX(index) : 0,
            }}
            transition={{
                ...animations[cameFrom]?.transition,
                delay: animations[cameFrom]?.delay ? animations[cameFrom].delay(index) : 0,
            }}
            onAnimationComplete={() => onAnimationComplete(card)}
            style={style}
        >
            <motion.div className='flip'
                initial={animations[cameFrom]?.flip}
                animate={animations[goingTo]?.flip}
                transition={{
                    ...animations[cameFrom]?.flipTransition,
                    delay: animations[cameFrom]?.flipDelay ? animations[cameFrom].flipDelay(index) : 0,
                }}
                style={{ pointerEvents: 'none' }}
            >
                <div className='card-front' style={bgImg}/>
                <div className='card-back' style={bgImg}/>
            </motion.div>
        </motion.div>
    )
}

const isCardEqual = (card1, card2) => {
    return card1.card.id === card2.card.id && card1.index === card2.index
}

export default memo(Card, isCardEqual)
// export default Card
