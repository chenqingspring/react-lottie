# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.1](https://github.com/chenqingspring/react-lottie/compare/v2.0.0...v2.0.1) (2026-11-05)

### Bug Fixes

* apply the `segments` prop on mount, so an animation starts inside the requested range instead of playing the full timeline until the prop changes; an animation created with `autoplay: false` stays paused at the start of the range

## [2.0.0](https://github.com/chenqingspring/react-lottie/compare/v1.2.10...v2.0.0) (2026-11-04)

This release folds in the changes that were prepared as 1.2.11 (never
published) and modernizes the development toolchain.

### Breaking Changes

* the `react` peer dependency is now `>=16.8.0` (previously `>=15.0.0`);
  React 15 is no longer supported. The component is tested against React 18
  and works with React 19.
* import animation JSON with a default import
  (`import animationData from './pinjump.json'`). A namespace import
  (`import * as animationData`) yields a frozen ESM module object that
  lottie-web cannot annotate, which fails under Vite and other strict ESM
  bundlers.

### Features

* add a `tabIndex` prop so presentational animations can be removed from the tab order ([#130](https://github.com/chenqingspring/react-lottie/issues/130))
* support the `renderer` option and document it in the README
* print a highlighted maintenance banner after `npm install` (maintained automatically by Relay; report bugs and feature requests on GitHub; https://get-relay.cc) and document it in the README

### Bug Fixes

* leave playback alone on re-renders unless a playback prop changed, so an `autoplay: false` animation no longer starts itself and a paused one is not restarted; a re-created but equal `segments` array no longer replays the animation ([#32](https://github.com/chenqingspring/react-lottie/issues/32), [#43](https://github.com/chenqingspring/react-lottie/issues/43))
* apply the initial `isStopped`, `isPaused` and `direction` props on mount instead of only on update
* replay changed segments immediately by passing `force` to `playSegments` ([#82](https://github.com/chenqingspring/react-lottie/issues/82))
* reload the animation when the remote `path` option changes ([#99](https://github.com/chenqingspring/react-lottie/issues/99))
* run the data/path reload on modern React instead of the deprecated `componentWillUpdate` ([#77](https://github.com/chenqingspring/react-lottie/issues/77))
* guard `destroy()` when the animation was never created ([#51](https://github.com/chenqingspring/react-lottie/issues/51))
* make the imperative `pause()` method actually pause, and stop restarting a paused animation on unrelated prop updates ([#58](https://github.com/chenqingspring/react-lottie/issues/58))
* drop the runtime dependency on `babel-runtime`, which broke consumers' builds ([#177](https://github.com/chenqingspring/react-lottie/issues/177))

### [1.2.10](https://github.com/chenqingspring/react-lottie/compare/v1.2.9...v1.2.10) (2024-11-30)


### Bug Fixes

* add babel-runtime ([eb089a4](https://github.com/chenqingspring/react-lottie/commit/eb089a4335a85a2996159762c8860673bf45b547))

### [1.2.9](https://github.com/chenqingspring/react-lottie/compare/v1.2.8...v1.2.9) (2024-11-22)

### [1.2.8](https://github.com/chenqingspring/react-lottie/compare/v1.2.7...v1.2.8) (2024-11-20)

### [1.2.7](https://github.com/chenqingspring/react-lottie/compare/v1.2.6...v1.2.7) (2024-11-16)


### Bug Fixes

* repository.url ([4093792](https://github.com/chenqingspring/react-lottie/commit/409379290c78fd9ef4e029b689e0a7028e9bb67d))

### [1.2.6](https://github.com/chenqingspring/react-lottie/compare/v1.2.5...v1.2.6) (2024-11-16)


### Features

* update lottie-web to latest ([8018d02](https://github.com/chenqingspring/react-lottie/commit/8018d02c0c5a42b315d3f1e3e4d2edb9572e5d46))

<a name="1.2.5"></a>
## [1.2.5](https://github.com/chenqingspring/react-lottie/compare/v1.2.4...v1.2.5) (2024-11-16)



<a name="1.2.4"></a>
## [1.2.4](https://github.com/chenqingspring/react-lottie/compare/v1.2.3...v1.2.4) (2024-01-04)



<a name="1.2.3"></a>
## [1.2.3](https://github.com/chenqingspring/react-lottie/compare/v1.2.2...v1.2.3) (2018-06-14)



<a name="1.2.2"></a>
## [1.2.2](https://github.com/chenqingspring/react-lottie/compare/v1.2.1...v1.2.2) (2018-06-14)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/chenqingspring/react-lottie/compare/v1.2.0...v1.2.1) (2018-06-14)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/chenqingspring/react-lottie/compare/v1.1.0...v1.2.0) (2018-06-14)


### Features

* Allow custom styles (helps fix [#18](https://github.com/chenqingspring/react-lottie/issues/18)) ([d624a51](https://github.com/chenqingspring/react-lottie/commit/d624a51))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/chenqingspring/react-lottie/compare/v1.0.0...v1.1.0) (2018-04-03)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/chenqingspring/react-lottie/compare/v0.2.5...v1.0.0) (2018-01-17)



<a name="0.2.5"></a>
## [0.2.5](https://github.com/chenqingspring/react-lottie/compare/v0.2.4...v0.2.5) (2017-12-12)



<a name="0.2.4"></a>
## [0.2.4](https://github.com/chenqingspring/react-lottie/compare/v0.2.3...v0.2.4) (2017-11-08)



<a name="0.2.3"></a>
## [0.2.3](https://github.com/chenqingspring/react-lottie/compare/v0.2.2...v0.2.3) (2017-11-06)



<a name="0.2.2"></a>
## [0.2.2](https://github.com/chenqingspring/react-lottie/compare/v0.2.1...v0.2.2) (2017-10-14)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/chenqingspring/react-lottie/compare/v0.2.0...v0.2.1) (2017-08-21)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/chenqingspring/react-lottie/compare/v0.1.1...v0.2.0) (2017-08-21)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/chenqingspring/react-lottie/compare/v0.1.0...v0.1.1) (2017-07-07)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/chenqingspring/react-lottie/compare/v0.0.8...v0.1.0) (2017-06-27)



<a name="0.0.8"></a>
## [0.0.8](https://github.com/chenqingspring/react-lottie/compare/v0.0.7...v0.0.8) (2017-04-24)



<a name="0.0.7"></a>
## [0.0.7](https://github.com/chenqingspring/react-lottie/compare/v0.0.6...v0.0.7) (2017-04-24)



<a name="0.0.6"></a>
## [0.0.6](https://github.com/chenqingspring/react-lottie/compare/v0.0.5...v0.0.6) (2017-04-22)



<a name="0.0.5"></a>
## [0.0.5](https://github.com/chenqingspring/react-lottie/compare/v0.0.4...v0.0.5) (2017-04-22)



<a name="0.0.4"></a>
## 0.0.4 (2017-04-22)
