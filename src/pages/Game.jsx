import React, { useState, useEffect, useRef } from 'react'
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
    } = useGameState(20)
    
    const { deckName, setDeckName } = useDeckTheme()

    const [dungeonCards, setDungeonCards] = useState([])
    const [roomCards, setRoomCards] = useState([null, null, null, null])
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [discardCards, setDiscardCards] = useState([])
    
    const [target, setTarget] = useState(null)
    const [sub, setSub] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [trigger, setTrigger] = useState({type: 'start', count: 0})
    const finishedCount = useRef(0)
    const finishedCards = useRef([])

    const actualDeck = deckConfig[deckName] || deckConfig[set_1]
    const isAvoidable = !(roomCards.some(c => !c) || (roundSkipped == round - 1 && round != 1) || dungeonCards.length < 4)

    useEffect(() => {
        if (baralho.length == 0 || trigger.type == '') return

        if (trigger.type == 'start') {
            setDungeonCards([...baralho.map((card, i) => ({...card, cameFrom: 'start', goingTo: 'dungeon', isReturning: false, posIni: i}))])
            setTrigger({type: '', count: 0})
        } else if (trigger.type == 'started') {
            setDungeonCards(prev => [...prev.map(card => ({...card, cameFrom: 'stop', isReturning: false}))])
            setTrigger({type: 'fill', count: 0})
        } else if (trigger.type == 'avoided') {
            setTrigger({type: 'fill', count: 0})
        } else if (trigger.type == 'fill') {
            fillRoom()
            setTrigger({type: '', count: 0})
        }

    }, [baralho.length, dungeonCards, trigger])

    useEffect(() => {
        handleWin({ life, trigger })
    }, [dungeonCards, roomCards])

    useEffect(() => {
        if ((gameState == 'gameOver' || gameState == 'win') && !modalOpen) {
            setModalOpen(true)
        }
    }, [gameState])

    const handleComplete = (card) => {
        if (card.isReturning) {
            finishedCount.current += 1
            console.log('opaaaa')

            if (finishedCount.current === baralho.length && baralho.length > 0) {
                setTrigger({type: 'started', count: 0})
                finishedCount.current = 0
            }
        } else if (card.cameFrom == 'start') {
            finishedCount.current += 1
            
            if (finishedCount.current === baralho.length && baralho.length > 0) {
                setTrigger({type: 'started', count: 0})
                finishedCount.current = 0
            }
        } else if (card.cameFrom == 'roomAvoid') {
            finishedCount.current += 1

            if (finishedCount.current === 4 && roomCards.every(c => c == null)) {
                setTrigger({type: 'avoided', count: 0})
                finishedCount.current = 0
            }
        }
    }

    const handleWin = ({ life, trigger }) => {
        if (trigger > 0 && life > 0 && dungeonCards.length == 0 && countEmpties(roomCards) == 4) {
            setGameState('win')

        }
    }

    const handleRoomClick = (card) => {
        const { suit, power } = card

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
            const actualWeaponsCards = equippedWeapons.map(card => ({...card, cameFrom: 'equipped', goingTo: 'discard'}))

            setEquippedWeapons([{...card, cameFrom: 'room', goingTo: 'equipped'}])
            setDiscardCards(prev => [...prev, ...actualWeaponsCards])
        }
        // Espadas/Paus = monstros
        if (suit == 'Paus' || suit == 'Espadas') {
            const {sub, toWhere} = calcSub(card)

            if (toWhere == 'equipped') {
                setEquippedWeapons(prev => [...prev, {...card, cameFrom: 'room', goingTo: 'equipped'}])
            } else if (toWhere == 'discard') {
                setDiscardCards(prev => [...prev, {...card, cameFrom: 'room', goingTo: 'discard'}])
            }

            takeDamage(sub)
        }

        if (suit == 'Copas') {
            if (!hasPotted) {
                takePotion(power)
            }
            setDiscardCards(prev => [...prev, {...card, cameFrom: 'room', goingTo: 'discard'}])
        }

        removeRoomCard()
    }

    const handleDungeonClick = () => {
        if (dungeonCards.some(c => c.cameFrom == 'start')) return


        if (countEmpties(roomCards) >= 3) {
            fillRoom()
        }
    }

    const handleMouseEnter = (e, i) => {
        if (roomCards[i] == null) return

        setTarget({
            card: roomCards[i],
            x: e.pageX,
            y: e.pageY
        })
        setSub(calcSub(roomCards[i]).sub)
    }

    const handleMouseLeave = (_, i) => {
        if (roomCards[i] == null) return

        setTarget(null)
    }

    function countEmpties(arr) {
        return arr.filter(el => !el).length
    }

    function fillRoom () {
        const empties = countEmpties(roomCards)

        if (empties == 0) return

        setRoomCards(prev => {
            return prev.reduceRight(({ result, source }, c) => {
                if (c == null && source.length > 0) {
                    const last = source[source.length - 1]

                    return {
                        result: [{ ...last, cameFrom: 'dungeon', goingTo: 'room' }, ...result],
                        source: source.slice(0, -1) // remove o último imutavelmente
                    }
                }
                return { result: [{ ...c }, ...result], source }

                },
                { result: [], source: dungeonCards }
            ).result
        })
        setDungeonCards(prev => prev.slice(0, -empties))
        nextRound()
    }

    function calcSub(card) {
        const last = equippedWeapons.at(-1)
        const weapon = equippedWeapons[0]?.suit == 'Ouros' ? equippedWeapons[0] : {power: 0}
        
        if ((last && (last.suit == 'Espadas' || last.suit == 'Paus') && card.power >= last.power) || weapon.power == 0) {
            return {sub: card.power, toWhere: 'discard'}
        } else {
            return {sub: Math.max(0, (card.power - weapon.power)), toWhere: 'equipped'}
        }
    }

    const handleSkipRound = () => {
        if (!isAvoidable) return
        const actualRoomCards = roomCards.map(c => ({ ...c, cameFrom: 'roomAvoid', goingTo: 'dungeon' }))
        
        setRoomCards([null, null, null, null])
        setDungeonCards(prevDungeon => {
            const newDungeon = [...actualRoomCards, ...prevDungeon]
            return newDungeon
        })   
        skipRound()
    }

    const handleReset = (shuffle = true) => {
        resetGame()

        const allCards = [
            ...roomCards.filter(Boolean)?.map(c => ({ ...c, cameFrom: 'room', goingTo: 'dungeon' })),
            ...discardCards.map(c => ({ ...c, cameFrom: 'discard', goingTo: 'dungeon' })),
            ...equippedWeapons.map(c => ({ ...c, cameFrom: 'equipped', goingTo: 'dungeon' })),
        ]

        const returningCards = (cards) => cards.map(card => ({
            ...card,
            isReturning: true,
        }))

        setRoomCards([null, null, null, null])
        setDiscardCards([])
        setEquippedWeapons([])
        setDungeonCards(prev => {
            const newDungeonCards = shuffle ?
                [...embaralharCartas(returningCards([...prev, ...allCards]))] :
                [...returningCards([...prev, ...allCards])]
            return newDungeonCards
        })
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
            />
            <div className="main-game">
                <div className="board" style={{
                    '--aspect': `${actualDeck.width}/${actualDeck.height}`,
                }}>
                    <div className="dungeon card-place" onClick={(e) => {
                        e.stopPropagation()
                        if (dungeonCards.length > 0) handleDungeonClick()
                    }}>
                        {dungeonCards?.map((card, i) => (
                            <Card
                                key={`card-${card.id}`}
                                card={card}
                                index={i}
                                actualDeck={actualDeck}
                                onAnimationComplete={(c) => handleComplete(c)}
                            />
                        ))}
                    </div>
                    <div className="room">
                        {[3, 2, 1, 0]
                            .map((i) => (
                                <div
                                    className="card-place"
                                    key={`room-${i}`}
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
                                            key={`card-${roomCards[i].id}`}
                                            index={i}
                                            card={roomCards[i]}
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
                                    key={`card-${card.id}`}
                                    index={i}
                                    card={card}
                                    flipTransition={{
                                        duration: .5,
                                        ease: 'backInOut'
                                    }}
                                    actualDeck={actualDeck}
                                />
                            ))
                        )}
                    </div>
                    <div className="equipped-weapon card-place">
                        {equippedWeapons.length > 0 && (
                            equippedWeapons.map((card, i) => (
                                <Card
                                    key={`card-${card.id}`}
                                    index={i}
                                    card={card}
                                    actualDeck={actualDeck}
                                />
                            ))
                        )}
                    </div>
                    <div className='life-container'>
                        <Die
                            face={life > 0 ? life : 1}
                        />
                    </div>
                    <div className='bttns-container'>
                        <button
                            className='bttn md'
                            onClick={handleSkipRound}
                            disabled={!isAvoidable}
                        >
                            Avoid
                        </button>
                        <button
                            className='bttn md'
                            onClick={() => setGameState('gameOver')}
                        >
                            Give Up
                        </button>
                        <button
                            className='bttn md'
                            onClick={() => setDungeonCards(prev => [...embaralharCartas(prev)])}
                        >
                            Shuffle
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Game