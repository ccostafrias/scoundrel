import React from 'react'
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion' // 'framer-motion/dist/framer-motion'
import { pageTransition, pageVariants } from "../utils/motion"
import "../styles/Home.css"

export default function Home() {
    const navigate = useNavigate()

    function startGame() {
        navigate(`/jogo`)
    }

  return (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={pageTransition}
    >
        <main className="home">
            <h1>Scoundrel</h1>
            <div className='bttns-wrapper'>
                <button className='bttn' onClick={() => window.open('http://stfj.net/art/2011/Scoundrel.pdf')}>RULES</button>
                <button className='bttn' onClick={startGame}>Play</button>
            </div>
        </main>
    </motion.div>
  );
}