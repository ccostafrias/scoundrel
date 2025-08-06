import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion' // 'framer-motion/dist/framer-motion'
import { pageTransition, pageVariants } from "../utils/motion"
import "../styles/Home.css"

export default function Home() {
    const navigate = useNavigate()

    function startGame() {
        navigate(`/jogo`)
    }

    const torchLeftRef = useRef(null);
    const torchRightRef = useRef(null);
    const [torchPositions, setTorchPositions] = useState([])

    useEffect(() => {
        const updatePositions = () => {
            const leftRect = torchLeftRef.current?.getBoundingClientRect()
            const rightRect = torchRightRef.current?.getBoundingClientRect()

            console.log(leftRect, rightRect)

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
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
        >
            <main className="home">
                <div className='title-wrapper'>
                    <div className='torch' ref={torchLeftRef}></div>
                    <h1 className='title'>Scoundrel</h1>
                    <div className='torch' ref={torchRightRef}></div>
                </div>
                <div className='bttns-wrapper'>
                    <button className='bttn' onClick={startGame}>Play Game</button>
                    <button className='bttn' disabled onClick={() => {}}>Leaderboards</button>
                    <button className='bttn' onClick={() => window.open('http://stfj.net/art/2011/Scoundrel.pdf')}>Rules</button>
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
        </motion.div>
    );
}