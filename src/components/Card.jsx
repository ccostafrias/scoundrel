import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { findCard } from '../utils/cardsFunctions'

export default function Game(props) {
    const {
        card, 
        initial,
        animate, 
        transition,
        flipInitial,
        flipAnimate,
        flipTransition,
        actualDeck,
        onAnimationComplete,
        onClick,
    } = props

    const [r, c] = card ? findCard(actualDeck.order, card) : []
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
    }

    return (
        <motion.div
            layoutId={`card-${card.id}`}
            className='card'
            initial={initial}
            animate={animate}
            transition={transition}
            onAnimationComplete={onAnimationComplete}
            style={style}
            onClick={onClick}
        >
            <motion.div className='flip'
                initial={flipInitial}
                animate={flipAnimate}
                transition={flipTransition}
            >
                <div className='card-front'/>
                <div className='card-back'/>
            </motion.div>
        </motion.div>
    )
}
