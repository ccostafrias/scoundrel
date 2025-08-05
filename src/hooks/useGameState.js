import { useState } from 'react';

export default function useGameState(initialLife = 20) {
  const [life, setLife] = useState(initialLife)
  const [hasPotted, setHasPotted] = useState(false)
  const [round, setRound] = useState(0)
  const [roundSkipped, setRoundSkipped] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const nextRound = () => {
    const nextRound = round + 1
    setRound(nextRound)
    setHasPotted(false)
  };

  const skipRound = () => {
    if (round != 1 && round == roundSkipped + 1) return
    setRoundSkipped(round)
  }

  const takePotion = (amount) => {
    if (!hasPotted) {
      setHasPotted(true)
      setLife((prev) => Math.min(20, prev + amount))
    }
  };

  const takeDamage = (amount) => {
    const lifeAfterDamage = life - amount
    if (lifeAfterDamage <= 0) setGameOver(true)
    setLife(lifeAfterDamage)
  }

  return {
    life,
    hasPotted,
    round,
    roundSkipped,
    gameOver,
    setLife,
    setHasPotted,
    setRound,
    setRoundSkipped,
    nextRound,
    skipRound,
    takePotion,
    takeDamage,
    setGameOver,
  }
}