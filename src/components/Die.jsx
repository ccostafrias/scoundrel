import React from "react";
import '../styles/Die.css'

const ANGLE1 = 37.377368
const ANGLE2 = 52.622632
const ANGLE3 = 10.8122

const angles = {
    20: {
        x: -ANGLE2,
        y: 0,
        z: 0,
        r: 0,
    },
    19: {
        x: 2*ANGLE2+2*ANGLE3,
        y: 72,
        z: 0,
        r: -120,
    },
    18: {
        x: -ANGLE2,
        y: 144,
        z: 0,
        r: 120,
    },
    17: {
        x: ANGLE2,
        y: 36,
        z: 0,
        r: -60,
    },
    16: {
        x: ANGLE3,
        y: -36,
        z: 0,
        r: -120,
    },
    15: {
        x: ANGLE3,
        y: 108,
        z: 0,
        r: 0,
    },
    14: {
        x: -ANGLE2,
        y: -72,
        z: 0,
        r: -120,
    },
    13: {
        x: ANGLE3,
        y: 180,
        z: 0,
        r: 0,
    },
    12: {
        x: -ANGLE3,
        y: 72,
        z: 0,
        r: 180,
    },
    11: {
        x: -ANGLE3,
        y: -144,
        z: 0,
        r: 60,
    },
    10: {
        x: ANGLE3,
        y: 36,
        z: 0,
        r: 120,
    },
    9: {
        x: ANGLE3,
        y: -108,
        z: 0,
        r: 0,
    },
    8: {
        x: -ANGLE3,
        y: 0,
        z: 0,
        r: 180,
    },
    7: {
        x: ANGLE2,
        y: 108,
        z: 0,
        r: -60,
    },
    6: {
        x: -ANGLE3,
        y: -72,
        z: 0,
        r: 180,
    },
    5: {
        x: -ANGLE3,
        y: 144,
        z: 0,
        r: -60,
    },
    4: {
        x: -ANGLE2,
        y: -144,
        z: 0,
        r: 240,
    },
    3: {
        x: ANGLE2,
        y: -36,
        z: 0,
        r: 60,
    },
    2: {
        x: -ANGLE2,
        y: 72,
        z: 0,
        r: 120,
    },
    1: {
        x: 2*ANGLE2+2*ANGLE3,
        y: 0,
        z: 0,
        r: 0,
    }
}

export default function Die(props) {
    const {
        xAngle,
        yAngle,
        zAngle,
        face,
    } = props

    const {x, y, z, r} = angles[face] || {x: xAngle[1], y: yAngle[1], z: zAngle[1], r: 0}

    return (
        <div className='die-container' style={{
            transform: `rotate(${r}deg)`
        }}>
            <div className="die" style={{
                transform: `translateZ(calc(var(--a)*-1)) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) `
            }}>
                <div className="face face-1"></div>
                <div className="face face-2"></div>
                <div className="face face-3"></div>
                <div className="face face-4"></div>
                <div className="face face-5"></div>
                <div className="face face-6"></div>
                <div className="face face-7"></div>
                <div className="face face-8"></div>
                <div className="face face-9"></div>
                <div className="face face-10"></div>
                <div className="face face-11"></div>
                <div className="face face-12"></div>
                <div className="face face-13"></div>
                <div className="face face-14"></div>
                <div className="face face-15"></div>
                <div className="face face-16"></div>
                <div className="face face-17"></div>
                <div className="face face-18"></div>
                <div className="face face-19"></div>
                <div className="face face-20"></div>
            </div>
        </div>
    )
}