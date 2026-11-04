// Use this file to setup any test utilities.

// lottie-web >= 5.x probes canvas support while it is being imported
// (`ctx.fillStyle = ...` on createTag('canvas').getContext('2d')). jsdom has no
// canvas backend, so getContext() returns null and every test file that imports
// the component crashes before a single test runs. Return a no-op 2d context so
// the import can complete.
const canvasWindow = global.window;
if (canvasWindow && canvasWindow.HTMLCanvasElement) {
  const noop = () => {};
  const context = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillRect: noop,
    clearRect: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    stroke: noop,
    fill: noop,
    save: noop,
    restore: noop,
    translate: noop,
    scale: noop,
    rotate: noop,
    setTransform: noop,
    drawImage: noop,
    putImageData: noop,
    measureText: () => ({ width: 0 }),
    getImageData: (x, y, width, height) => ({
      data: new Uint8ClampedArray(Math.max(1, width * height * 4)),
      width,
      height,
    }),
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
  };

  canvasWindow.HTMLCanvasElement.prototype.getContext = function getContext() {
    return context;
  };
}

// jsdom 9 does not implement requestAnimationFrame, but lottie-web's play()
// schedules one through its animation manager. Without a stub, any test that
// starts playback dies with "window.requestAnimationFrame is not a function".
// The tests assert on animation state (isPaused / playDirection), not on
// painted frames, so the callback is intentionally never invoked: that avoids
// leaving a frame loop running after the suite finishes.
if (canvasWindow && typeof canvasWindow.requestAnimationFrame !== 'function') {
  canvasWindow.requestAnimationFrame = () => 0;
  canvasWindow.cancelAnimationFrame = () => {};
  global.requestAnimationFrame = canvasWindow.requestAnimationFrame;
  global.cancelAnimationFrame = canvasWindow.cancelAnimationFrame;
}
