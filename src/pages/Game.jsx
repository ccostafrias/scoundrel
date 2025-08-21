import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'

import { pageTransition, pageVariants, pageStyle } from "../utils/motion"
import { deckConfig } from '../utils/deckConfig'

import useDeck from '../hooks/useDeck'
import useGameState from '../hooks/useGameState'

import { useDeckTheme } from '../contexts/DeckContext'

import CustomModal from '../components/CustomModal'
import ModalContent from '../components/ModalContent'
import MouseTracker from '../components/MouseTracker'
import MouseTrackerContent from '../components/MouseTrackerContent'
import Card from "../components/Card"
import Die from '../components/Die'

import "../styles/Game.css"
import "../styles/Card.css"

function Game() {
    const navigate = useNavigate()
    const [baralho, embaralharCartas] = useDeck()

    const {
        life,
        hasPotted,
        round,
        roundSkipped,
        gameState,
        takePotion,
        takeDamage,
        nextRound,
        skipRound,
        setGameState,
        resetGame,
        setLife
    } = useGameState(20)
    
    const { deckName, setDeckName } = useDeckTheme()

    const [dungeonCards, setDungeonCards] = useState([])
    const [roomCards, setRoomCards] = useState([null, null, null, null])
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [discardCards, setDiscardCards] = useState([])
    
    const [target, setTarget] = useState(null)
    const [sub, setSub] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [animacoesFinalizadas, setAnimacoesFinalizadas] = useState(0)

    const actualDeck = deckConfig[deckName] || deckConfig[set_1]

    useEffect(() => {
        if (baralho.length > 0 && dungeonCards.length == 0) setDungeonCards([...baralho.map(card => ({...card, isInitial: true}))])
    }, [baralho, dungeonCards])

    useEffect(() => {
    if (animacoesFinalizadas === baralho.length && baralho.length > 0) {
        setDungeonCards(prev => [...prev.map(card => ({...card, isInitial: false}))])
    }
    }, [animacoesFinalizadas])

    useEffect(() => {
        if (dungeonCards.some(card => card.isInitial)) return

        const allRoomEmpty = roomCards.every(card => !card)

        if (allRoomEmpty) {
            if (dungeonCards.length > 0) {
                fillRoom()
                nextRound()
            } else if (dungeonCards.length == 0) {
                handleWin()
            }
        }
    }, [dungeonCards, roomCards])

    useEffect(() => {
        if (roundSkipped == 0) return

        const actualRoomCards = roomCards

        setRoomCards([null, null, null, null])
        setDungeonCards(prevDungeon => {
            const newDungeon = [...actualRoomCards, ...prevDungeon]
            return newDungeon;
        })        
    }, [roundSkipped])

    useEffect(() => {
        if (gameState == 'gameOver' || gameState == 'win') {
            setModalOpen(true)
        }
    }, [gameState])

    const handleWin = () => {
        if (animacoesFinalizadas == 0) return
        if (life <= 0) return

        setGameState('win')
    }

    const handleRoomClick = (card) => {
        const { value, suit, power } = card
        const removeRoomCard = () => {
            setRoomCards(prev =>
                prev.map(c => {
                    if (c && c.value === card.value && c.suit === card.suit) return null
                    else return c
                })
            )
        }

        // Ouros = arma
        if (suit == 'Ouros') {
            removeRoomCard()
            const actualWeaponsCards = equippedWeapons
            setEquippedWeapons([card])
            setDiscardCards(prev => [...prev, ...actualWeaponsCards])
        }
        // Espadas/Paus = monstros
        if (suit == 'Paus' || suit == 'Espadas') {
            const sub = calcSub(card)
            
            removeRoomCard()
            takeDamage(sub)
        }

        if (suit == 'Copas') {
            if (!hasPotted) {
                takePotion(power)
            }
            removeRoomCard()
            setDiscardCards(prev => [...prev, card])
        }
    }

    const handleDungeonClick = () => {
        if (animacoesFinalizadas != baralho.length) return

        if (fillRoom(3)) {
            nextRound()
        }
    }

    const handleMouseEnter = (e, i) => {
        if (roomCards[i] == null) return
        setTarget({
            card: roomCards[i],
            x: e.pageX,
            y: e.pageY
        })

        calcSub(roomCards[i], true)
    }

    const handleMouseLeave = (e, i) => {
        if (roomCards[i] == null) return

        setTarget(null)
    }

    function fillRoom (n = 1) {
        const empties = roomCards.filter(inner => inner === null).length;

        if (empties >= n) {
            setRoomCards(prev => {
                const length = dungeonCards.length
                let i = 0

                return prev.map(c => {
                    if (c == null) return { ...dungeonCards[length - 1 - i++] }
                    else return {...c}
                })
            })

            setDungeonCards(prev => prev.slice(0, -empties));

            return true
        } else return null
    }

    function calcSub(card, justCalculate = false) {
        const last = equippedWeapons.at(-1)
        const weapon = equippedWeapons[0]?.suit == 'Ouros' ? equippedWeapons[0] : {power: 0}
        let sub
        
        if ((last && (last.suit == 'Espadas' || last.suit == 'Paus') && card.power >= last.power) || weapon.power == 0) {
            sub = card.power
             if (!justCalculate) setDiscardCards(prev => [...prev, card])
        } else {
            sub = Math.max(0, (card.power - weapon.power))
            if (!justCalculate) setEquippedWeapons(prev => [...prev, card])
        }

        setSub(sub)
        return sub
    }

    const handleReset = () => {
        resetGame()

        const allCards = [
            ...roomCards.filter(Boolean),   // evita null
            ...discardCards,
            ...equippedWeapons,
            ...dungeonCards,
        ]

        const preparedCards = allCards.map((card, index) => ({
            ...card,
            initialPos: 0,
            isInitial: true,
        }))

        const shuffled = embaralharCartas(preparedCards)

        setRoomCards([null, null, null, null])
        setDiscardCards([])
        setEquippedWeapons([])
        setDungeonCards([...shuffled])
        setAnimacoesFinalizadas(0)
    }

    return (
        <>
            <AnimatePresence>
                {target && (
                    <MouseTracker
                        initial={{ x: target.x, y: target.y }}
                        offset={{ x: 10, y: 10 }}
                    >
                        <MouseTrackerContent 
                            target={target}
                            hasPotted={hasPotted}
                            weapon={equippedWeapons[0] || null}
                            sub={sub}
                        />
                    </MouseTracker>
                )}
            </AnimatePresence>
            <CustomModal
                isOpen={modalOpen}
                onRequestClose={null}
                onAfterClose={handleReset}
                title={gameState == 'gameOver' ? 'Game Over!' : 'Victory!'}
                footer={
                    <>
                        <button className='bttn md auto' onClick={() => {setModalOpen(false)}}>Restart</button>
                        <button className='bttn md auto' onClick={() => {navigate('/')}}>Menu</button>
                    </>
                }
                shouldClose={false}
            >
                <>
                    <span>Score: </span>
                    <ModalContent 
                        dungeonCards={dungeonCards}
                        discardCards={discardCards}
                        life={life}
                        gameState={gameState}
                    />
                </>
            </CustomModal>
            <motion.div 
                style={pageStyle}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                // transition={pageTransition}
            />
            <div className="main-game">
                <div className="board" style={{
                    '--aspect': `${actualDeck.width}/${actualDeck.height}`,
                }}>
                    <div className="dungeon card-place" onClick={(e) => {
                        e.stopPropagation()
                        if (dungeonCards.length > 0) handleDungeonClick()
                    }}>
                        {dungeonCards.map((card, i) => (
                            <Card
                                key={card.id}
                                card={card}
                                initial={card.isInitial ? {
                                    y: card.initialPos || window.innerHeight,
                                    x: card.initialPos || -window.innerWidth,
                                    rotate: -10,
                                } : false}
                                animate={{
                                    y: -i * .5,
                                    x: 0,
                                    rotate: 0,
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: 'easeOut',
                                    delay: i * 0.05    // Efeito de cascata
                                }}
                                flipInitial={!card.isInitial ? {
                                    rotateY: -180,
                                } : null}
                                flipAnimate={!card.isInitial ? {
                                    rotateY: 0,
                                } : null}
                                flipTransition={{
                                    duration: 0.5,
                                    ease: 'backInOut',
                                    delay: i * 0.1    // Efeito de cascata
                                }}
                                actualDeck={actualDeck}
                                onAnimationComplete={() => {
                                    if (!card.isInitial) return
                                    setAnimacoesFinalizadas(prev => prev + 1)
                                }}
                            />
                        ))}
                    </div>
                    <div className="room">
                        {[3, 2, 1, 0]
                            .map((i) => (
                                <div 
                                    className="card-place" 
                                    key={i}
                                    onMouseEnter={(e) => handleMouseEnter(e, i)}
                                    onMouseLeave={(e) => handleMouseLeave(e, i)}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (roomCards[i] == null) return

                                        handleRoomClick(roomCards[i])
                                        setTarget(null)
                                    }}
                                >
                                    {roomCards[i]?.value && (
                                        <Card
                                            key={roomCards[i].id}
                                            card={roomCards[i]}
                                            initial={false}
                                            animate={false}
                                            transition={{
                                                duration: 0.5,
                                                ease: 'easeOut',
                                                delay: i * 0.2    // Efeito de cascata
                                            }}
                                            flipInitial={{
                                                rotateY: 0,
                                            }}
                                            flipAnimate={{
                                                rotateY: -180,
                                            }}
                                            flipTransition={{
                                                duration: 0.5,
                                                ease: 'backInOut',
                                                delay: i * 0.1    // Efeito de cascata
                                            }}
                                            actualDeck={actualDeck}
                                        />
                                    )}
                                </div>
                            ))
                        }
                    </div>
                    <div className="discard card-place">
                        {discardCards.length > 0 && (
                            discardCards.map((card, i) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    initial={false}
                                    animate={{
                                        y: -i * .5,
                                        x: 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                        // delay: i * 0.2    // Efeito de cascata
                                    }}
                                    flipInitial={{
                                        rotateY: -180,
                                    }}
                                    flipAnimate={{
                                        rotateY: 0,
                                    }}
                                    flipTransition={false}
                                    actualDeck={actualDeck}
                                />
                            ))
                        )}
                    </div>
                    <div className="equipped-weapon card-place">
                        {equippedWeapons.length > 0 && (
                            equippedWeapons.map((card, i) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    initial={{
                                        x: i !== 0 ? 15 + i * 25 : 0,
                                        y: i !== 0 ? 5 + i * 15 : 0
                                    }}
                                    animate={false}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                        // delay: i * 0.2    // Efeito de cascata
                                    }}
                                    flipInitial={{
                                        rotateY: -180,
                                    }}
                                    flipAnimate={false}
                                    flipTransition={false}
                                    actualDeck={actualDeck}
                                />
                            ))
                        )}
                    </div>
                    <div className='life-container'>
                        <Die
                            face={life > 0 ? life : 1}
                        />
                        {/* <input type="number" value={life} onChange={(e) => setLife(e.target.value)}/> */}
                    </div>
                    <div className='bttns-container'>
                        <button
                            className='bttn md'
                            onClick={skipRound}
                            disabled={roomCards.some(c => !c) || (roundSkipped == round - 1 && round != 1) || dungeonCards.length < 4}
                        >
                            Avoid
                        </button>
                        <button
                            className='bttn md'
                            onClick={() => setGameState('gameOver')}
                            // disabled={roomCards.some(c => !c) || (roundSkipped == round - 1 && round != 1) || dungeonCards.length < 4}
                        >
                            Give Up
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game