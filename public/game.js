// game.js

export function setupKeyboard(keys) {
  window.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
  });

  window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
  });
}
