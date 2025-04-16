export class RenderSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.entities = new Set();
    this.background = null;
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update(deltaTime) {
    this.clear();
    this.drawBackground();
    this.drawEntities();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    if (this.background) {
      this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  drawEntities() {
    for (const entity of this.entities) {
      if (entity.sprite) {
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(entity.position.x, entity.position.y);
        this.ctx.rotate(entity.rotation);
        this.ctx.scale(entity.scale.x, entity.scale.y);
        
        // Draw sprite
        this.ctx.drawImage(
          entity.sprite,
          -entity.width / 2,
          -entity.height / 2,
          entity.width,
          entity.height
        );
        
        this.ctx.restore();
      }
    }
  }

  addEntity(entity) {
    this.entities.add(entity);
  }

  removeEntity(entity) {
    this.entities.delete(entity);
  }

  setBackground(image) {
    this.background = image;
  }
} 