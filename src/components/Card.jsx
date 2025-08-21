import React, { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCardStyle } from '../utils/getCardStyle'

function Card(props) {
    const {
        card, 
        initial,
        animate, 
        transition,
        flipInitial,
        flipAnimate,
        flipTransition,
        actualDeck,
        onAnimationComplete = () => {},
    } = props

    const {style, bgImg} = getCardStyle(card, actualDeck)

    return (
        <motion.div
            layoutId={`card-${card.id}`}
            className='card'
            initial={initial}
            animate={animate}
            transition={transition}
            onAnimationComplete={() => {
                onAnimationComplete()
            }}
            style={{
                ...style,
            }}
            // onClick={onClick}
        >
            <motion.div className='flip'
                initial={flipInitial}
                animate={flipAnimate}
                transition={flipTransition}
                style={{ pointerEvents: 'none' }}
            >
                <div className='card-front' style={bgImg}/>
                <div className='card-back' style={bgImg}/>
            </motion.div>
        </motion.div>
    )
}

const isCardEqual = (card1, card2) => {
    return card1.id === card2.id && card1.isRoom === card2.isRoom// && card1.onClick === card2.onClick
}

export default memo(Card, isCardEqual)
// export default Card
