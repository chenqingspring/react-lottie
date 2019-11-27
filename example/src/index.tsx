import React from 'react';
import ReactDOM from 'react-dom';
import { LottieBasic } from './LottieBasic';
import { LottieQueue } from './LottieQueue';
import { LottieHoverable } from './LottieHoverable';
import './index.css';

const App = () => (
    <>
        <LottieBasic />
        <LottieHoverable />
        <LottieQueue />
    </>
)

ReactDOM.render(<App />, document.getElementById('root'));
