import React, { useState, Children } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { buttonVariants } from '../utils/motion'

import "../styles/Carousel.css"

export default function Carousel({active, setActive, children}) {
    // const [active, setActive] = useState(0)
    const count = Children.count(children)

    return (
        <div className='carousel'>
            <AnimatePresence>
                {active > 0 && (
                    <motion.button
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className='carousel-bttn left'
                        onClick={() => setActive(prev => prev - 1)}
                    >
                        L
                    </motion.button>
                )}
            </AnimatePresence>
            {Children.map(children, (child, index) => {
                const isActive = active === index
                const distance = Math.abs(active - index)
                const signal = (active > index ? -1 : 1)
                const MAX_VISIBLE = 2

                return (
                    <motion.div
                        className={`carousel-item ${active === index ? 'active' : ''}`}
                        key={index}
                        animate={{
                            opacity: distance > MAX_VISIBLE ? 0 : 1,
                            rotateY: distance*-signal*15,
                            filter: `blur(${distance * 2}px) brightness(${Math.pow(2, -distance)})`,
                            x: isActive ? 0 : (distance * 120) * signal,
                            z: distance*-150,
                            pointerEvents: isActive ? 'auto' : 'none',
                        }}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                        }}
                        // transition={{ duration: 0.3 }}
                        transformTemplate={({ x, z, rotateY }) =>
                            `translateX(calc(-50% + ${x})) translateY(-50%) translateZ(${z}) rotateY(${rotateY})`
                        }
                    >
                        {child}
                    </motion.div>
                )
            })}
            <AnimatePresence>
                {active < count - 1 && (
                    <motion.button
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className='carousel-bttn right'
                        onClick={() => setActive(prev => prev + 1)}
                    >
                        R
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}