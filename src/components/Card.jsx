import React, { useState, useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'
import { getCardStyle } from '../utils/getCardStyle'

const animations = {
    start: {
        initial: {
            y: window.innerHeight,
            x: -window.innerWidth,
            rotateZ: -45,
        },
        transition: {
            duration: 0.7,
            ease: 'easeOut',
        },
        delay: {card: {a: 0.05}}
    },
    shuffle: {
        animateY: (i) => -i * .5,
        animate: { 
            rotateZ: 360*Math.sign(Math.random() - 0.5),
            rotateY: 0,
        },
        transition: {
            duration: .4,
            ease: 'easeOut',
        },
        delay: {card: {a: 0.005}}
    },
    dungeon: {
        animateY: (i) => -i * .5,
        animate: { 
            rotateZ: 0,
            rotateY: 0,
        },
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
        flip: { rotateY: 0 },
        flipTransition: {
            duration: 0.5,
            ease: 'backInOut',
        },
        delay: {card: {a: 0.2}, flip: {a: 0.1}}
    },
    equipped: {
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
        animateX: (i) => i !== 0 ? 15 + i * 25 : 0,
        animateY: (i) => i !== 0 ? 5 + i * 15 : 0,
        animate: { rotateX: 0 },
        flip: { rotateY: -180 },
    },
    discard: {
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
        animateY: (i) => -i * .5,
        animate: { rotateX: 0 },
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
        flip: { rotateY: 180 },
        flipTransition: {
            duration: 0.4,
            ease: 'backInOut',
        },
        delay: {card: {a: 0.1, b: 0.7}, flip: {a: 0.1}}
    },
    roomReturning: {
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
        flip: { rotateY: 180 },
        flipTransition: {
            duration: 0.4,
            ease: 'backInOut',
        },
        delay: {card: {a: 0.1, b: 0.7}, flip: {a: 0.1}}
    },
    equippedReturning: {
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
        flip: { rotateY: 180 },
        flipTransition: {
            duration: 0.4,
            ease: 'backInOut',
        },
        delay: {card: {a: 0.1, b: 0.7}, flip: {a: 0.1}}
    },
    discardReturning: {
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
        flip: { rotateY: 0 },
        flipTransition: {
            duration: 0.4,
            ease: 'backInOut',
        },
        delay: {card: {a: 0.1, b: 0.7}, flip: {a: 0.1}}
    },
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

    const calcDelay = (x, a=0, b=0) => a*x + b

    console.log(animations.shuffle.animate.rotateZ)

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
                delay: animations[cameFrom]?.delay?.card ? calcDelay(index-(card.returningCount||0), animations[cameFrom].delay.card.a, animations[cameFrom].delay.card.b) : 0,
            }}
            onAnimationComplete={(e) => onAnimationComplete(e, card)}
            style={style}
        >
            <motion.div className='flip'
                initial={animations[cameFrom]?.flip}
                animate={animations[goingTo]?.flip}
                transition={{
                    ...animations[cameFrom]?.flipTransition,
                    delay: animations[cameFrom]?.delay?.flip ? calcDelay(index-(card.returningCount||0), animations[cameFrom].delay.flip.a, animations[cameFrom].delay.flip.b) : 0,
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
