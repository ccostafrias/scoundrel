import React from 'react'

export default function Vitrine(props) {
    return (
        <>
            <button className='left'>L</button>
            <div className='vitrine'>
                <div className='vitrine-card card back'></div>
                <div className='vitrine-card card Espadas_5'></div>
                <div className='vitrine-card card Copas_3'></div>
                <div className='vitrine-card card Paus_7'></div>
                <div className='vitrine-card card Ouros_4'></div>
            </div>
            <button className='right'>R</button>
        </>
    )
}