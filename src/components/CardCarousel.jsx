import React from "react";
import { motion } from "framer-motion";

import { getCardStyle } from "../utils/getCardStyle";

export default function CardCarousel(props) {
  const { actualDeck, isSelected, isActive } = props;

  const card = { value: "A", suit: "Paus" };
  const { style, bgImg } = getCardStyle(card, actualDeck);

  return (
    <motion.div
      className={`card-place ${isActive && isSelected ? "selected" : ""}`}
      style={style}
      animate={isSelected ? { scale: [1.1, 1] } : { scale: 1 }}
    //   transition={{ duration: 0.3, ease: "easeOut" }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="card" style={style}>
        <div className="flip">
          <div className="card-front" style={bgImg}></div>
          <div className="card-back" style={bgImg} />
        </div>
      </div>
    </motion.div>
  );
}
