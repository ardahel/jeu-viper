import { Entity } from './Entity.js';
import { Vector2D } from '../utils/Vector2D.js';

export class Player extends Entity {
  constructor(id, username, x = 0, y = 0) {
    super(id, x, y);
    
    this.username = username;
    this.speed = 5;
    this.jumpForce = -15;
    this.maxSpeed = 10;
    
    // Animation states
    this.animations = {
      idle: null,
      walk: [],
      jump: null
    };
    this.currentAnimation = 'idle';
    this.animationFrame = 0;
    this.animationTimer = 0;
    
    // Enable physics by default
    this.enablePhysics();
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.updateAnimation(deltaTime);
  }

  move(direction) {
    // Apply movement force
    const force = new Vector2D(direction * this.speed, 0);
    this.velocity = this.velocity.add(force);
    
    // Clamp horizontal speed
    if (Math.abs(this.velocity.x) > this.maxSpeed) {
      this.velocity.x = Math.sign(this.velocity.x) * this.maxSpeed;
    }
    
    // Update facing direction
    this.facingRight = direction > 0;
    
    // Update animation
    this.currentAnimation = 'walk';
  }

  jump() {
    if (this.grounded) {
      this.velocity.y = this.jumpForce;
      this.grounded = false;
      this.currentAnimation = 'jump';
    }
  }

  stop() {
    // Apply friction when no movement input
    this.velocity.x *= 0.8;
    if (Math.abs(this.velocity.x) < 0.1) {
      this.velocity.x = 0;
    }
    
    if (this.grounded) {
      this.currentAnimation = 'idle';
    }
  }

  setAnimations(animations) {
    this.animations = animations;
  }

  updateAnimation(deltaTime) {
    if (!this.animations[this.currentAnimation]) return;

    this.animationTimer += deltaTime;
    if (this.animationTimer >= 0.1) { // 10 FPS animation
      this.animationTimer = 0;
      
      if (Array.isArray(this.animations[this.currentAnimation])) {
        // For sprite sheets
        this.animationFrame = (this.animationFrame + 1) % this.animations[this.currentAnimation].length;
        this.sprite = this.animations[this.currentAnimation][this.animationFrame];
      } else {
        // For single sprites
        this.sprite = this.animations[this.currentAnimation];
      }
    }
  }

  onGroundCollision() {
    this.grounded = true;
    if (this.currentAnimation === 'jump') {
      this.currentAnimation = 'idle';
    }
  }
} 