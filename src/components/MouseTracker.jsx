import React, { useEffect } from 'react';
import { useMotionValue, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

import '../styles/MouseTracker.css';

export default function MouseTracker({ children, offset = { x: 0, y: 0}, initial = { x: 0, y: 0 } }) {
    const x = useMotionValue(initial.x);
    const y = useMotionValue(initial.y);

    useEffect(() => {
        console.log(x, y)

        function handler(ev) {
            const e = ev.touches ? ev.touches[0] : ev;
            x.set(e.clientX + offset.x);
            y.set(e.clientY + offset.y);
        }
        document.addEventListener('mousemove', handler);
        document.addEventListener('touchmove', handler);
        return () => {
            document.removeEventListener('mousemove', handler);
            document.removeEventListener('touchmove', handler);
        }
    }, [x, y, offset.x, offset.y]);

    return createPortal(
        <motion.div 
            className='mouse-tracker' 
            style={{ x, y, position: "fixed", pointerEvents: "none", zIndex: 9999 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
        >
            {children}
        </motion.div>
    , document.body);
};