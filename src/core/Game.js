import { TimeManager } from './TimeManager.js';
import { InputManager } from './InputManager.js';
import { StateManager } from './StateManager.js';
import { PhysicsSystem } from '../systems/PhysicsSystem.js';
import { AnimationSystem } from '../systems/AnimationSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { NetworkSystem } from '../systems/NetworkSystem.js';
import { Renderer } from '../renderer/Renderer.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Core systems
    this.time = new TimeManager();
    this.input = new InputManager();
    this.state = new StateManager();
    
    // Game systems
    this.physics = new PhysicsSystem();
    this.animation = new AnimationSystem();
    this.collision = new CollisionSystem();
    this.network = new NetworkSystem();
    
    // Renderer
    this.renderer = new Renderer(this.ctx, canvas.width, canvas.height);
    
    this.isRunning = false;
  }

  init() {
    this.time.init();
    this.input.init();
    this.state.init();
    this.physics.init();
    this.animation.init();
    this.collision.init();
    this.network.init();
    this.renderer.init();
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
  }

  gameLoop() {
    if (!this.isRunning) return;

    // Update
    this.time.update();
    this.input.update();
    this.physics.update(this.time.deltaTime);
    this.animation.update(this.time.deltaTime);
    this.collision.update();
    this.network.update();
    
    // Render
    this.renderer.clear();
    this.renderer.render({
      platforms: this.state.getPlatforms(),
      players: this.state.getPlayers(),
      chat: this.state.getChat(),
      gameState: this.state.getGameState(),
      currentPlayer: this.state.getCurrentPlayer(),
      score: this.state.getScore()
    });
    
    requestAnimationFrame(() => this.gameLoop());
  }
} 