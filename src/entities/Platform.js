import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(id, x, y, width, height) {
    super(id, x, y);
    
    this.width = width;
    this.height = height;
    this.updateCollider();
    
    // Platforms don't need physics
    this.disablePhysics();
  }

  // Platforms don't need to update
  update(deltaTime) {
    // No update needed
  }

  // Override setPosition to ensure collider is updated
  setPosition(x, y) {
    super.setPosition(x, y);
    this.updateCollider();
  }

  // Override setScale to ensure collider is updated
  setScale(x, y) {
    super.setScale(x, y);
    this.updateCollider();
  }

  // Override updateCollider to use width and height directly
  updateCollider() {
    this.collider = {
      x: this.position.x,
      y: this.position.y,
      width: this.width * this.scale.x,
      height: this.height * this.scale.y
    };
  }
} 