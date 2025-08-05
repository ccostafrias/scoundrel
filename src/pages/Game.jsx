import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { pageTransition, pageVariants } from "../utils/motion"
import { deckConfig } from '../utils/deckConfig'

import useDeck from '../hooks/useDeck'
import useGameState from '../hooks/useGameState';

import CustomModal from '../components/CustomModal'
import Card from "../components/Card"
import Die from '../components/Die';

import "../styles/Game.css"

function Game() {
    const navigate = useNavigate()
    const [baralho, embaralhar] = useDeck()

    const {
        life,
        hasPotted,
        round,
        roundSkipped,
        gameOver,
        takePotion,
        takeDamage,
        nextRound,
        skipRound,
        setGameOver,
    } = useGameState(20);
    
    const [modalOpen, setModalOpen] = useState(false)
    const [dungeonCards, setDungeonCards] = useState([])
    const [roomCards, setRoomCards] = useState([null, null, null, null])
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [discardCards, setDiscardCards] = useState([])

    const [animacoesFinalizadas, setAnimacoesFinalizadas] = useState(0)

    const actualDeckName = 'set_3'
    const actualDeck = deckConfig[actualDeckName] || null

    useEffect(() => {
        if (actualDeck) document.body.style.setProperty('--aspect', `${actualDeck.width}/${actualDeck.height}`);
    }, [actualDeck])

    useEffect(() => {
        if (baralho.length > 0) setDungeonCards([...baralho.map(card => ({...card, isInitial: true}))])
    }, [baralho])

    useEffect(() => {
        if (roomCards.every(card => !card) && dungeonCards.length >= 4 && dungeonCards.every(card => !card.isInitial)) {
            fillRoom()
            nextRound()
        }
    }, [dungeonCards, roomCards])

    useEffect(() => {
        if (animacoesFinalizadas === 44) {
            setDungeonCards(prev => [...prev.map(card => ({...card, isInitial: false}))])
        }
    }, [animacoesFinalizadas])

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
        if (gameOver) {
            console.log('Game Over')
            setModalOpen(true)
        }
    }, [gameOver])

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
            const last = equippedWeapons.at(-1)
            const weapon = equippedWeapons[0]?.suit == 'Ouros' ? equippedWeapons[0] : {power: 0}
            let sub
            
            if ((last && (last.suit == 'Espadas' || last.suit == 'Paus') && power >= last.power) || weapon.power == 0) {
                sub = card.power
                setDiscardCards(prev => [...prev, card])
            } else {
                sub = Math.max(0, (power - weapon.power))
                setEquippedWeapons(prev => [...prev, card])
            }
            
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

    return (
        <>
            <CustomModal
                isOpen={modalOpen}
                onRequestClose={null}
                onAfterClose={() => setGameOver(false)}
                title={gameOver ? 'Game Over!' : 'Victory!'}
                footer={
                    <>
                        <button className='modal-bttn' onClick={() => {setModalOpen(false); embaralhar()}}>Restart</button>
                        <button className='modal-bttn' onClick={() => {setModalOpen(false); navigate('/')}}>Menu</button>
                    </>
                }
                shouldClose={false}
            >
                <>
                    <span>Score: </span>
                    <ul className='game-over-stats--container'>
                        <li className='game-over-stats'>
                            <span>Life:</span>
                            <span className="game-over-stats--value">{life}</span>
                        </li>
                        <li className='game-over-stats'>
                            <span>Monsters left: </span>
                            <span className="game-over-stats--value">- {dungeonCards.reduce((acc, curr) => acc + (curr.suit == 'Paus' || curr.suit == 'Espadas' ? curr.power : 0), 0)}</span>
                        </li>
                        <li className='game-over-stats'>
                            <span>Total</span>
                            <span className='game-over-stats--total game-over-stats--value'>{life - dungeonCards.reduce((acc, curr) => acc + (curr.suit == 'Paus' || curr.suit == 'Espadas' ? curr.power : 0), 0)}</span>
                        </li>
                    </ul>
                </>
            </CustomModal>
             <motion.div 
                className="main-game"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
            >
                <div className="board">
                    <div className="dungeon card-place">
                        {dungeonCards.map((card, i) => (
                            <Card
                                key={card.id}
                                card={card}
                                initial={card.isInitial ? {
                                    y: window.innerHeight,
                                    x: -window.innerWidth,
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
                                flipTransition={false}
                                actualDeck={actualDeck}
                                onAnimationComplete={() => {
                                    if (!card.isInitial) return
                                    setAnimacoesFinalizadas(prev => prev + 1)
                                }}
                                onClick={() => handleDungeonClick(card)}
                            />
                        ))}
                    </div>
                    <div className="room">
                        {[3, 2, 1, 0]
                            .map((i) => {
                                return (
                                    <div className="card-place" key={i}>
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
                                                onAnimationComplete={() => {}}
                                                onClick={() => handleRoomClick(roomCards[i])}
                                            />
                                        )}
                                    </div>
                                )
                            })
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
                                    onAnimationComplete={() => {}}
                                    onClick={() => {}}
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
                                        x: i * 40,
                                        y: i * 20
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
                                    onAnimationComplete={() => {}}
                                    onClick={() => {}}
                                />
                            ))
                        )}
                    </div>
                    <div className='life-container'>
                        <Die 
                            face={life > 0 ? life : 1}
                        />
                    </div>
                    <div className='skip-container'>
                        <button 
                            className='skip-bttn' 
                            onClick={skipRound}
                            disabled={roomCards.some(c => !c) || (roundSkipped == round - 1 && round != 1) || dungeonCards.length < 4}
                        >
                            Avoid
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Game