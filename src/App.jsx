import React, { useEffect, useState } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from 'framer-motion' // 'framer-motion/dist/framer-motion'

import Home from "./pages/Home"
import Game from "./pages/Game.jsx"

import { FaGithub } from "react-icons/fa"

import "./styles/global.css"

function App() {

  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="*" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/jogo" element={<Game />} />
        </Routes>
      </AnimatePresence>
      <footer className="home-footer">
        <a href="https://github.com/ccostafrias" target="_blank">  
          <FaGithub className="svg-footer"/>
        </a>
        {/* <button className="button-footer" onClick={() => setModalOpen(true)}>
          <FaInfoCircle  className="svg-footer"/>
        </button> */}
      </footer>
    </>
  )
}

export default App
