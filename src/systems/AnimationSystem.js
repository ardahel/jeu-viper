export class AnimationSystem {
  constructor() {
    this.entities = new Set();
  }

  init() {
    // Initialize animation system
  }

  update(deltaTime) {
    for (const entity of this.entities) {
      if (entity.animations && entity.currentAnimation) {
        this.updateEntityAnimation(entity, deltaTime);
      }
    }
  }

  updateEntityAnimation(entity, deltaTime) {
    // Update animation timer
    entity.animationTimer += deltaTime;
    
    // Check if it's time to update the frame
    if (entity.animationTimer >= 0.1) { // 10 FPS animation
      entity.animationTimer = 0;
      
      // Get current animation
      const currentAnim = entity.animations[entity.currentAnimation];
      
      if (Array.isArray(currentAnim)) {
        // For sprite sheets
        entity.animationFrame = (entity.animationFrame + 1) % currentAnim.length;
        entity.sprite = currentAnim[entity.animationFrame];
      } else if (currentAnim) {
        // For single sprites
        entity.sprite = currentAnim;
      }
    }
  }

  addEntity(entity) {
    this.entities.add(entity);
  }

  removeEntity(entity) {
    this.entities.delete(entity);
  }

  setAnimation(entity, animationName) {
    if (entity.animations && entity.animations[animationName]) {
      entity.currentAnimation = animationName;
      entity.animationFrame = 0;
      entity.animationTimer = 0;
      
      // Set initial sprite
      const anim = entity.animations[animationName];
      if (Array.isArray(anim)) {
        entity.sprite = anim[0];
      } else {
        entity.sprite = anim;
      }
    }
  }
} 