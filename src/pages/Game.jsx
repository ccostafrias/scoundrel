import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { pageTransition, pageVariants } from "../utils/motion"
import { deckConfig } from '../utils/deckConfig'
import { fillRoomWithDungeonCards } from '../utils/cardsFunctions'
import useDeck from '../hooks/useDeck'

import Card from "../components/Card"
import Die from '../components/Die';

import "../styles/Game.css"

function Game() {
    const [baralho, embaralhar] = useDeck()

    const [xAngle, setXAngle] = useState([-180, 0])
    const [yAngle, setYAngle] = useState([-180, 0])
    const [zAngle, setZAngle] = useState([-180, 0])
    const [life, setLife] = useState(20)
    
    const [dungeonCards, setDungeonCards] = useState([])
    const [roomCards, setRoomCards] = useState([null, null, null, null])
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [discardCards, setDiscardCards] = useState([])

    const [animacoesFinalizadas, setAnimacoesFinalizadas] = useState(0)
    const [animacaoConcluida, setAnimacaoConcluida] = useState(false)

    const actualDeckName = 'set_3'
    const actualDeck = deckConfig[actualDeckName] || null

    useEffect(() => {
        if (actualDeck) {
            document.body.style.setProperty('--aspect', `${actualDeck.width}/${actualDeck.height}`);
        }
    }, [actualDeck])

    useEffect(() => {
        if (baralho.length > 0) {
            setDungeonCards([...baralho])
        }

    }, [baralho])

    useEffect(() => {
        if (animacaoConcluida && dungeonCards.length >= 4) {
            fillRoom()
            setAnimacaoConcluida(false)
        }
    }, [animacaoConcluida, dungeonCards]);

    useEffect(() => {
        if (animacoesFinalizadas === dungeonCards.length && animacoesFinalizadas != 0) {
            setAnimacaoConcluida(true);
        }
    }, [animacoesFinalizadas, dungeonCards.length]);

    const handleRoomClick = (card) => {
        const { value, suit, power } = card
        const removeRoomCard = () => {
            setRoomCards(prev =>
                prev.map(c => {
                    if (c && c.value === card.value && c.suit === card.suit) return null
                    else return c
                })
            );
        }

        // Ouros = arma
        if (suit == 'Ouros') {
            removeRoomCard()
            setEquippedWeapons(prev => [...prev, card])
        }
        // Espadas/Paus = monstros
        if (suit == 'Paus' || suit == 'Espadas') {
            const last = equippedWeapons.at(-1)
            const weapon = equippedWeapons.at(0)

            if (!weapon) return
            if (last.suit != 'Ouros' && power >= last.power) return
            
            const sub = Math.min(0, (weapon.power - power))

            setLife(prev => Math.max(1, prev - sub))
            removeRoomCard()
            setEquippedWeapons(prev => [...prev, card])
        }

        if (suit == 'Copas') {
            setLife(prev => Math.min(20, prev + power))
            removeRoomCard()
            setDiscardCards(prev => [...prev, card])
        }
    }

    const handleDungeonClick = (card) => {
        if (animacoesFinalizadas != baralho.length) return
        fillRoom(3)
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
        }
    }

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
                <div className="board">
                    <div className="dungeon card-place">
                        {dungeonCards.map((card, i) => (
                            <Card
                                key={card.id}
                                card={card}
                                initial={{
                                    y: window.innerHeight,
                                    x: -window.innerWidth,
                                    rotate: -10,
                                }}
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
                                actualDeck={actualDeck}
                                onAnimationComplete={() => {
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
                                    initial={{
                                        y: -i * .5,
                                        x: 0,
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
                            xAngle={xAngle}
                            yAngle={yAngle}
                            zAngle={zAngle}
                            face={life}
                        />
                        {/* <div>
                            <input type="number" value={life} onChange={(e) => setLife(e.target.value)}/>
                            <RangeSlider
                                min={-180}
                                max={180}
                                step={36}
                                thumbsDisabled={[true, false]}
                                rangeSlideDisabled={true}
                                value={xAngle}
                                onInput={setXAngle}
                            />
                            <RangeSlider
                                min={-180}
                                max={180}
                                step={18}
                                thumbsDisabled={[true, false]}
                                rangeSlideDisabled={true}
                                value={yAngle}
                                onInput={setYAngle}
                            />
                            <RangeSlider
                                min={-180}
                                max={180}
                                step={5}
                                thumbsDisabled={[true, false]}
                                rangeSlideDisabled={true}
                                value={zAngle}
                                onInput={setZAngle}
                            />
                        </div> */}
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Game