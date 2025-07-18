import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition, pageVariants } from "../utils/motion"
import useDeck from '../hooks/useDeck'
import "../styles/Game.css"

function Game() {
    const [ baralho, embaralhar ] = useDeck()
    console.log(baralho)

    return (
        <>
             <motion.div 
                className="main-game"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
            >
                <main className='main-game'>
                    <div className="board">
                        <div className="dungeon card-stack">Dungeon</div>
                        <div className="room">
                            <div className="card-place">Room</div>
                            <div className="card-place">Room</div>
                            <div className="card-place">Room</div>
                            <div className="card-place">Room</div>
                        </div>
                        <div className="discard card-place">Discard</div>
                        <div className="equipped-weapon card-place">Equipped Weapon</div>
                    </div>
                </main>
            </motion.div>
        </>
    )
}

export default Game