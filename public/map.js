// map.js

export const bgImage = new Image();
bgImage.src = './background.png';

export const gravity = 0.45; // Ajustée pour une chute plus naturelle

export const platforms = Object.freeze([
  Object.freeze({ x: 0, y: 520, width: 1024, height: 56 }),
  Object.freeze({ x: 60, y: 418, width: 355, height: 20 }),
  Object.freeze({ x: 360, y: 230, width: 170, height: 20 }),
  Object.freeze({ x: 580, y: 320, width: 200, height: 20 }),
  Object.freeze({ x: 500, y: 490, width: 420, height: 20 }),
  Object.freeze({ x: 410, y: 420, width: 10, height: 100 }),
  Object.freeze({ x: 390, y: 418, width: 10, height: 100 })
]);

Object.freeze(bgImage);
Object.freeze(gravity);
