export class InputManager {
  constructor() {
    this.keys = new Map();
    this.mousePosition = { x: 0, y: 0 };
    this.mouseButtons = new Map();
    this.touchEvents = new Map();
  }

  init() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    window.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  update() {
    // Reset one-frame states if needed
  }

  handleKeyDown(event) {
    this.keys.set(event.code, true);
  }

  handleKeyUp(event) {
    this.keys.set(event.code, false);
  }

  handleMouseMove(event) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  handleMouseDown(event) {
    this.mouseButtons.set(event.button, true);
  }

  handleMouseUp(event) {
    this.mouseButtons.set(event.button, false);
  }

  handleTouchStart(event) {
    event.preventDefault();
    Array.from(event.touches).forEach(touch => {
      this.touchEvents.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        startTime: Date.now()
      });
    });
  }

  handleTouchMove(event) {
    event.preventDefault();
    Array.from(event.touches).forEach(touch => {
      if (this.touchEvents.has(touch.identifier)) {
        const touchEvent = this.touchEvents.get(touch.identifier);
        touchEvent.x = touch.clientX;
        touchEvent.y = touch.clientY;
      }
    });
  }

  handleTouchEnd(event) {
    event.preventDefault();
    Array.from(event.changedTouches).forEach(touch => {
      this.touchEvents.delete(touch.identifier);
    });
  }

  isKeyPressed(keyCode) {
    return this.keys.get(keyCode) || false;
  }

  isMouseButtonPressed(button) {
    return this.mouseButtons.get(button) || false;
  }

  getMousePosition() {
    return { ...this.mousePosition };
  }

  getTouchEvents() {
    return Array.from(this.touchEvents.values());
  }
} 