import React from "react"

export default function ModalContent(props) {
    const {
        gameState,
        life,
        dungeonCards,
        discardCards,
    } = props

    const monsterPower = dungeonCards.reduce((acc, curr) => acc + (curr.suit == 'Paus' || curr.suit == 'Espadas' ? curr.power : 0), 0)
    const lastPot = discardCards.at(-1).suit == 'Copas' ? discardCards.at(-1) : {power: 0}
    const total = gameState == 'gameOver' ? life - monsterPower : life + lastPot.power

    return (
        <ul className={`game-over-stats--container ${gameState == 'gameOver' ? 'game-over' : 'win'}`}>
            <li className='game-over-stats'>
                <span>Life:</span>
                <span className="game-over-stats--value">{life}</span>
            </li>
            <li className='game-over-stats'>
                {gameState == 'gameOver' && (
                    <>
                        <span>Monsters left: </span>
                        <span className="game-over-stats--value add">-{monsterPower}</span>
                    </>
                )}
                {gameState == 'win' && (
                    <>
                        <span>Last potion: </span>
                        <span className="game-over-stats--value add">+{lastPot.power}</span>
                    </>
                )}
            </li>
            <li className='game-over-stats'>
                <span className="total">Total:</span>
                <span className='game-over-stats--total game-over-stats--value'>{total}</span>
            </li>
        </ul>
    )
}