import { Vector2D } from '../utils/Vector2D.js';

export class Entity {
  constructor(id, x = 0, y = 0) {
    this.id = id;
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D();
    this.acceleration = new Vector2D();
    this.rotation = 0;
    this.scale = new Vector2D(1, 1);
    
    this.width = 0;
    this.height = 0;
    this.sprite = null;
    
    this.hasPhysics = false;
    this.grounded = false;
    this.facingRight = true;
    
    this.collider = null;
    this.onCollision = null;
  }

  update(deltaTime) {
    if (this.hasPhysics) {
      // Update physics
      this.velocity = this.velocity.add(this.acceleration.scale(deltaTime));
      this.position = this.position.add(this.velocity.scale(deltaTime));
    }
  }

  setPosition(x, y) {
    this.position = new Vector2D(x, y);
    this.updateCollider();
  }

  setVelocity(x, y) {
    this.velocity = new Vector2D(x, y);
  }

  setAcceleration(x, y) {
    this.acceleration = new Vector2D(x, y);
  }

  setRotation(angle) {
    this.rotation = angle;
  }

  setScale(x, y) {
    this.scale = new Vector2D(x, y);
    this.updateCollider();
  }

  setSprite(sprite) {
    this.sprite = sprite;
    if (sprite) {
      this.width = sprite.width;
      this.height = sprite.height;
      this.updateCollider();
    }
  }

  updateCollider() {
    if (this.width && this.height) {
      this.collider = {
        x: this.position.x,
        y: this.position.y,
        width: this.width * this.scale.x,
        height: this.height * this.scale.y
      };
    }
  }

  enablePhysics() {
    this.hasPhysics = true;
  }

  disablePhysics() {
    this.hasPhysics = false;
  }

  setCollisionCallback(callback) {
    this.onCollision = callback;
  }
} 