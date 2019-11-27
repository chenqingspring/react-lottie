import React from 'react';
import { Lottie } from './reactComponentLib';
import animationData from './lotties/11705-lightning-vfx.json'

export const LottieBasic = () => (
    <>
        <h1>Basic lottie:</h1>
        <Lottie
            width="350px"
            height="350px"
            className="lottie-container basic"
            config={{ animationData: animationData, loop: true, autoplay: true }}
        />
        <p>looped animation with autoplay</p>
    </>
)