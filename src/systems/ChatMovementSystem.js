import { GameConfig } from '../config/GameConfig.js';

export class ChatMovementSystem {
  constructor() {
    // Position initiale au centre de la map
    this.position = { 
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.35  // 35% de la hauteur pour être au milieu de la map
    };
    this.velocity = { x: 0, y: 0 };
    this.speed = 10;
    this.jumpForce = -15;
    this.gravity = 0.8;
    this.isGrounded = false;
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false
    };

    // Définir les limites de la map forest (70% de la hauteur de l'écran)
    const mapHeight = window.innerHeight * 0.7;
    const mapTop = (window.innerHeight - mapHeight) / 2;
    const mapWidth = 1280; // Largeur de la map forest
    const mapLeft = (window.innerWidth - mapWidth) / 2;
    
    this.mapBounds = {
      top: mapTop,
      bottom: mapTop + mapHeight,
      left: mapLeft,
      right: mapLeft + mapWidth
    };
  }

  init(chatIcon, canvas) {
    this.chatIcon = chatIcon;
    this.canvas = canvas;
    this.initKeyboardEvents();
  }

  initKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = true;
        // Saut uniquement si on est au sol
        if (e.key === 'ArrowUp' && this.isGrounded) {
          this.velocity.y = this.jumpForce;
          this.isGrounded = false;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = false;
      }
    });

    // Mettre à jour les limites si la fenêtre est redimensionnée
    window.addEventListener('resize', () => {
      const mapHeight = window.innerHeight * 0.7;
      const mapTop = (window.innerHeight - mapHeight) / 2;
      const mapWidth = 1280; // Largeur de la map forest
      const mapLeft = (window.innerWidth - mapWidth) / 2;
      
      this.mapBounds = {
        top: mapTop,
        bottom: mapTop + mapHeight,
        left: mapLeft,
        right: mapLeft + mapWidth
      };
    });
  }

  update(deltaTime) {
    // Appliquer la gravité
    this.velocity.y += this.gravity;

    // Mise à jour de la position horizontale
    if (this.keys.ArrowLeft) this.velocity.x = -this.speed;
    else if (this.keys.ArrowRight) this.velocity.x = this.speed;
    else this.velocity.x = 0;

    // Mise à jour de la position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Collision avec le sol de la map
    if (this.position.y >= this.mapBounds.bottom - 32) {
      this.position.y = this.mapBounds.bottom - 32;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Collision avec le plafond de la map
    if (this.position.y <= this.mapBounds.top) {
      this.position.y = this.mapBounds.top;
      this.velocity.y = 0;
    }

    // Collision avec les murs de la map
    if (this.position.x <= this.mapBounds.left) {
      this.position.x = this.mapBounds.left;
      this.velocity.x = 0;
    }
    if (this.position.x >= this.mapBounds.right - 32) {
      this.position.x = this.mapBounds.right - 32;
      this.velocity.x = 0;
    }
  }

  getPosition() {
    return this.position;
  }
}

export default ChatMovementSystem; 