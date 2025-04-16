import { Vector2D } from '../utils/Vector2D.js';

export class CollisionSystem {
  constructor() {
    this.entities = new Set();
    this.colliders = new Map();
  }

  init() {
    // Initialize collision system
  }

  update() {
    // Check collisions between all entities
    const entities = Array.from(this.entities);
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        this.checkCollision(entities[i], entities[j]);
      }
    }
  }

  addEntity(entity) {
    this.entities.add(entity);
    if (entity.collider) {
      this.colliders.set(entity.id, entity.collider);
    }
  }

  removeEntity(entity) {
    this.entities.delete(entity);
    this.colliders.delete(entity.id);
  }

  checkCollision(entityA, entityB) {
    if (!entityA.collider || !entityB.collider) return;

    const collision = this.detectCollision(entityA, entityB);
    if (collision) {
      this.resolveCollision(entityA, entityB, collision);
    }
  }

  detectCollision(entityA, entityB) {
    // AABB collision detection
    const a = entityA.collider;
    const b = entityB.collider;

    if (a.x + a.width < b.x || b.x + b.width < a.x) return null;
    if (a.y + a.height < b.y || b.y + b.height < a.y) return null;

    // Calculate overlap
    const overlapX = Math.min(a.x + a.width - b.x, b.x + b.width - a.x);
    const overlapY = Math.min(a.y + a.height - b.y, b.y + b.height - a.y);

    return {
      axis: overlapX < overlapY ? 'x' : 'y',
      overlap: Math.min(overlapX, overlapY),
      normal: new Vector2D(
        entityB.position.x - entityA.position.x,
        entityB.position.y - entityA.position.y
      ).normalize()
    };
  }

  resolveCollision(entityA, entityB, collision) {
    if (!entityA.hasPhysics && !entityB.hasPhysics) return;

    const moveAmount = collision.overlap / 2;
    const normal = collision.normal;

    if (entityA.hasPhysics) {
      entityA.position = entityA.position.subtract(normal.scale(moveAmount));
      if (collision.axis === 'y') {
        entityA.grounded = true;
        entityA.velocity.y = 0;
      }
    }

    if (entityB.hasPhysics) {
      entityB.position = entityB.position.add(normal.scale(moveAmount));
      if (collision.axis === 'y') {
        entityB.grounded = true;
        entityB.velocity.y = 0;
      }
    }

    // Notify entities of collision
    if (entityA.onCollision) entityA.onCollision(entityB, collision);
    if (entityB.onCollision) entityB.onCollision(entityA, collision);
  }
} 