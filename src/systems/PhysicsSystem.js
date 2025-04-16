import { Vector2D } from '../utils/Vector2D.js';

export class PhysicsSystem {
  constructor() {
    this.gravity = new Vector2D(0, 9.8); // 9.8 m/s²
    this.entities = new Set();
  }

  init() {
    // Initialize physics system
  }

  update(deltaTime) {
    for (const entity of this.entities) {
      if (entity.hasPhysics) {
        this.updateEntity(entity, deltaTime);
      }
    }
  }

  updateEntity(entity, deltaTime) {
    // Apply gravity
    entity.velocity = entity.velocity.add(this.gravity.scale(deltaTime));
    
    // Update position
    entity.position = entity.position.add(entity.velocity.scale(deltaTime));
    
    // Apply friction
    if (entity.grounded) {
      entity.velocity = entity.velocity.scale(0.8); // Friction coefficient
    }
  }

  addEntity(entity) {
    this.entities.add(entity);
  }

  removeEntity(entity) {
    this.entities.delete(entity);
  }

  applyForce(entity, force) {
    if (entity.hasPhysics) {
      entity.velocity = entity.velocity.add(force);
    }
  }

  setGravity(gravity) {
    this.gravity = gravity;
  }
} 