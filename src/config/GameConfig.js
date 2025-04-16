export const GameConfig = {
  // Game settings
  GAME_NAME: 'Viper Game',
  VERSION: '1.0.0',
  
  // Display settings
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  TARGET_FPS: 60,
  
  // Physics settings
  GRAVITY: 0.5,
  FRICTION: 0.8,
  AIR_RESISTANCE: 0.99,
  
  // Player settings
  PLAYER_SPEED: 5,
  PLAYER_JUMP_FORCE: -12,
  PLAYER_MAX_SPEED: 10,
  
  // Animation settings
  ANIMATION_FPS: 10,
  
  // Network settings
  SERVER_URL: 'http://localhost:3000',
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  
  // Game mechanics
  PLATFORM_COLORS: {
    NORMAL: '#8B4513',
    MOVING: '#A0522D',
    BREAKING: '#CD853F'
  },
  
  // UI settings
  CHAT_MAX_MESSAGES: 50,
  CHAT_WINDOW_WIDTH: 300,
  CHAT_WINDOW_HEIGHT: 140,
  
  // Asset paths
  ASSETS: {
    SPRITES: {
      PLAYER_IDLE: '/assets/sprites/player_idle.png',
      PLAYER_WALK: [
        '/assets/sprites/player_walk1.png',
        '/assets/sprites/player_walk2.png',
        '/assets/sprites/player_walk3.png',
        '/assets/sprites/player_walk4.png'
      ],
      PLAYER_JUMP: '/assets/sprites/player_jump.png',
      CHAT: '/assets/sprites/chat_assis.png',
      CHAT_ICON: '/assets/sprites/chat_icon.png'
    },
    MAPS: {
      FOREST: '/map-foret.png'
    },
    BACKGROUND: '/background.png'
  },

  // Game settings
  GAME: {
    FPS: 60,
    GRAVITY: 0.5,
    JUMP_FORCE: -12,
    MOVE_SPEED: 5,
    ANIMATION_SPEED: 0.1
  },

  // Network settings
  NETWORK: {
    SERVER_URL: 'http://localhost:3000',
    RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 1000
  },

  CANVAS: {
    WIDTH: 1280,
    HEIGHT: 720
  },

  CHAT: {
    INITIAL: {
      X: 512,
      Y: 400,
      WIDTH: 50,
      HEIGHT: 50
    },
    PHYSICS: {
      SPEED: 3,
      JUMP_POWER: -12,
      GRAVITY: 0.5
    }
  }
}; 