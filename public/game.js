export function setupKeyboard(keys) {
    window.addEventListener('keydown', (e) => {
      if (e.key in keys) keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key in keys) keys[e.key] = false;
    });
  }
  