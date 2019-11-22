import React from 'react';
import ReactDOM from 'react-dom';
import {LottieQueue} from './LottieQueue';
import {LottieHoverable} from './LottieHoverable';
import './index.css';

const App = ()=>(
    <>
        <LottieQueue />
        <LottieHoverable />
    </>
)

ReactDOM.render(<App />, document.getElementById('root'));
