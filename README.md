# react-component-lib

This is a boilerplate repository for creating npm packages with React components written in TypeScript and using styled-components.

Medium article explaining step by step how to use this repo to publish your own library to NPM:
https://medium.com/@xfor/developing-publishing-react-component-library-to-npm-styled-components-typescript-cc8274305f5a

## Installation:

To install all dependencies run `npm run install-all`.

## Developing your library:

To start developing your library, run `npm run dev`. It will build your library and run example create-react-app where you can test your components. Each time you make changes to your library or example app, app will be reloaded to reflect your changes.

## Styled-components:

Developing library with components built with styled-components is challenging because you have to keep only one instance of styled-components. If you would just symlink your library (`file:../` or `npm link`) to example app that is also using styled-components you'll get a console warning about multiple instances of styled-components (even though styled-components are peer dependency) and your styles will be possibly broken. To be able to conveniently develop styled components I am injecting bundled files directly into example app's /src folder and importing it in App.tsx along with type declaration.

## Typescript

This boilerplate lets you develop your libraries in Typescript and you can simultaneously test it in Typescript example create-react-app.
