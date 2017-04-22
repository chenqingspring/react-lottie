# Lottie Animation View for React

[![npm version](https://badge.fury.io/js/react-lottie.svg)](http://badge.fury.io/js/react-lottie)

## Demo
https://chenqingspring.github.io/react-lottie/

## Why Lottie?

#### Flexible After Effects features
We currently support solids, shape layers, masks, alpha mattes, trim paths, and dash patterns. And we’ll be adding new features on a regular basis.

#### Manipulate your animation any way you like
You can go forward, backward, and — most importantly — you can program your animation to respond to any interaction.

#### Small file sizes
Bundle vector animations within your app without having to worry about multiple dimensions or large file sizes. Alternatively, you can decouple animation files from your app’s code entirely by loading them from a JSON API.

[Learn more](http://airbnb.design/introducing-lottie/) › http://airbnb.design/lottie/


## Installation

Install through npm:
```
npm install --save react-lottie
```



## Usage

Import react-lottie and after-effect.json as animation data
```
import Lottie from 'react-lottie';
import * as animationData from './pinjump.json'
```
Set movinbody config into lottie view
```
const defaultOptions = {animationData: animationData};
<Lottie options={defaultOptions} height={500} width={500}/>
```

## License
MIT
