import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion' // 'framer-motion/dist/framer-motion'

import { pageTransition, pageVariants, pageStyle } from "../utils/motion"
import { deckConfig } from '../utils/deckConfig'
import objectToArrayWithName from '../utils/objectToArrayWithName'

import { useDeckTheme } from '../contexts/DeckContext'

import Carousel from '../components/Carousel'
import CardCarousel from '../components/CardCarousel'

import "../styles/Home.css"
import "../styles/Card.css"

export default function Home() {
    const navigate = useNavigate()

    const { deckName, setDeckName } = useDeckTheme()

    function startGame() {
        navigate(`/jogo`)
    }
    
    const decks = objectToArrayWithName(deckConfig)

    const [active, setActive] = useState(decks.findIndex(deck => deck.name == deckName) || 0)
    const [torchPositions, setTorchPositions] = useState([])
    const torchLeftRef = useRef(null);
    const torchRightRef = useRef(null);

    useEffect(() => {
        const updatePositions = () => {
            const leftRect = torchLeftRef.current?.getBoundingClientRect()
            const rightRect = torchRightRef.current?.getBoundingClientRect()

            setTorchPositions([
                {
                    x: leftRect?.left + leftRect?.width / 2,
                    y: leftRect?.top + leftRect?.height / 2,
                },
                {
                    x: rightRect?.left + rightRect?.width / 2,
                    y: rightRect?.top + rightRect?.height / 2,
                },
            ])
        }

        setTimeout(updatePositions, 100) // Initial position update
        window.addEventListener('resize', updatePositions)

        return () => {
            window.removeEventListener('resize', updatePositions)
        }
    }, [])

    return (
        <>
            <motion.div
                style={pageStyle}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                // transition={pageTransition}
            />
            <main className="home">
                <div className='title-wrapper'>
                    <div className='torch' ref={torchLeftRef}></div>
                    <h1 className='title'>Scoundrel</h1>
                    <div className='torch' ref={torchRightRef}></div>
                </div>
                <div className='home-content'>
                    <div className='bttns-wrapper'>
                        <button className='bttn' onClick={startGame}>Play Game</button>
                        <button className='bttn' disabled onClick={() => {}}>Leaderboards</button>
                        <button className='bttn' onClick={() => window.open('http://stfj.net/art/2011/Scoundrel.pdf')}>Rules</button>
                    </div>
                    <div className='carousel-container'>
                        <Carousel
                            active={active}
                            setActive={setActive}
                        >
                            {decks.map((actualDeck, index) => {
                                return (
                                    <div className="carousel-card--wrapper" key={index}>
                                        <motion.span 
                                            className='carousel-name'
                                            initial={{ opacity: 0, y: 0 }}
                                            animate={index == active ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
                                            style={{ 
                                                pointerEvents: 'none', 
                                                display: 'inline-block', 
                                                userSelect: 'none',
                                            }}
                                        >
                                            {actualDeck.name}
                                        </motion.span>
                                        <CardCarousel isActive={index == active} isSelected={decks[index].name == deckName} actualDeck={actualDeck} />
                                    </div>
                            )})}
                        </Carousel>
                        <button 
                            className='bttn' 
                            onClick={() => setDeckName(decks[active].name)}
                            disabled={decks[active].name == deckName}
                        >
                            {decks[active].name == deckName ? 'Selected' : 'Select'}
                        </button>
                    </div>
                </div>
            </main>
            <div className='darkness'>
                {torchPositions.map((pos, index) => (
                    <div
                        key={index}
                        className="light"
                        style={{
                            position: 'absolute',
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            transform: 'translate(-50%, -50%)', // centraliza
                            pointerEvents: 'none',
                        }}
                    />
                ))}
            </div>
        </>
    );
}