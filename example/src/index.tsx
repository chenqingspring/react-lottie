import React from 'react';
import ReactDOM from 'react-dom';
import { LottieBasic } from './LottieBasic';
import { LottieQueue } from './LottieQueue';
import { LottieHoverable } from './LottieHoverable';
import { LottieRemote } from './LottieRemote';
import './index.css';

const App = () => (
    <>
        <LottieBasic />
        <LottieHoverable />
        <LottieQueue />
        <LottieRemote />
    </>
)

ReactDOM.render(<App />, document.getElementById('root'));
