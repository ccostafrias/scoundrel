import { useState } from 'react';

export default function useGameState(initialLife = 20) {
  const [life, setLife] = useState(initialLife)
  const [hasPotted, setHasPotted] = useState(false)
  const [round, setRound] = useState(0)
  const [roundSkipped, setRoundSkipped] = useState(0)
  const [gameState, setGameState] = useState('playing')

  const nextRound = () => {
    const nextRound = round + 1
    setRound(nextRound)
    setHasPotted(false)
  }

  const skipRound = () => {
    if (round != 1 && round == roundSkipped + 1) return
    setRoundSkipped(round)
  }

  const takePotion = (amount) => {
    if (!hasPotted) {
      setHasPotted(true)
      setLife((prev) => Math.min(20, prev + amount))
    }
  }

  const takeDamage = (amount) => {
    const lifeAfterDamage = life - amount
    console.log(life, amount)
    if (lifeAfterDamage <= 0) setGameState('gameOver')
    setLife(lifeAfterDamage)
  }

  const resetGame = () => {
    setLife(initialLife)
    setHasPotted(false)
    setRound(0)
    setRoundSkipped(0)
    setGameState('playing')
  }

  return {
    life,
    hasPotted,
    round,
    roundSkipped,
    gameState,
    setLife,
    setHasPotted,
    setRound,
    setRoundSkipped,
    nextRound,
    skipRound,
    takePotion,
    takeDamage,
    setGameState,
    resetGame,
    setLife,
  }
}