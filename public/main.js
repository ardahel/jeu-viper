import { Game } from '../src/core/Game.js';
import { Player } from '../src/entities/Player.js';
import { Platform } from '../src/entities/Platform.js';
import { GameConfig } from '../src/config/GameConfig.js';
import { ChatMovementSystem } from '../src/systems/ChatMovementSystem.js';
import { ChatSystem } from '../src/systems/ChatSystem.js';
import { AuthSystem } from '../src/systems/AuthSystem.js';
import { authConfig } from '../src/config/auth.config.js';

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const authContainer = document.getElementById('authContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const mapChatIcon = document.getElementById('mapChatIcon');

// Hide chat by default
chatContainer.style.display = 'none';

// Game instance
let game;
let chatSystem;
let chatMovementSystem;

// Initialize game
function initGame(username) {
  // Hide auth container
  authContainer.classList.add('hidden');
  
  // Create game instance
  game = new Game(canvas);
  game.init();
  
  // Initialize chat systems
  chatSystem = new ChatSystem(game);
  chatSystem.position();
  chatSystem.show();
  
  chatMovementSystem = new ChatMovementSystem();
  chatMovementSystem.init(mapChatIcon, canvas);
  mapChatIcon.style.display = 'block';
  
  // Position chat on the right side
  chatContainer.style.right = '20px';
  chatContainer.style.top = '50%';
  chatContainer.style.transform = 'translateY(-50%)';
  
  // Create and setup player
  const currentPlayer = new Player('local', username, 100, 100);
  loadPlayerSprites(currentPlayer);
  
  // Add player to game
  game.state.setCurrentPlayer(currentPlayer);
  game.collision.addEntity(currentPlayer);
  
  // Setup network
  game.network.registerPlayer({
    id: 'local',
    username: username,
    x: currentPlayer.position.x,
    y: currentPlayer.position.y
  });
  
  // Setup event listeners
  setupEventListeners();
  
  // Start game
  game.start();
  
  // Show chat
  chatContainer.style.display = 'block';
}

// Load player sprites
function loadPlayerSprites(player) {
  const idleSprite = new Image();
  idleSprite.src = GameConfig.ASSETS.SPRITES.PLAYER_IDLE;
  
  const walkSprites = GameConfig.ASSETS.SPRITES.PLAYER_WALK.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
  
  const jumpSprite = new Image();
  jumpSprite.src = GameConfig.ASSETS.SPRITES.PLAYER_JUMP;
  
  player.setAnimations({
    idle: idleSprite,
    walk: walkSprites,
    jump: jumpSprite
  });
  
  player.sprite = idleSprite;
}

// Setup event listeners
function setupEventListeners() {
  // Keyboard input
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
      currentPlayer.move(-1);
    } else if (e.code === 'ArrowRight') {
      currentPlayer.move(1);
    } else if (e.code === 'ArrowUp' || e.code === 'Space') {
      currentPlayer.jump();
    } else if (e.code === 'KeyT') {
      chatInput.focus();
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      currentPlayer.stop();
    }
  });
  
  // Chat input
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
      const message = {
        username: currentPlayer.username,
        text: chatInput.value.trim()
      };
      
      // Ajouter le message au chat
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message';
      messageElement.innerHTML = `
        <span class="chat-username">${message.username}:</span>
        <span class="chat-text">${message.text}</span>
      `;
      
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Envoyer le message au serveur
      game.network.sendChatMessage(message);
      
      // Vider l'input
      chatInput.value = '';
    } else if (e.key === 'Escape') {
      chatInput.blur();
    }
  });
  
  // Network events
  game.network.onPlayersUpdate((players) => {
    game.state.setPlayer('local', currentPlayer);
    Object.entries(players).forEach(([id, playerData]) => {
      if (id !== 'local') {
        game.state.setPlayer(id, playerData);
      }
    });
  });
  
  game.network.onChatMessage((message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${message.username}: ${message.text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// Auth event listeners
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUser').value;
  const password = document.getElementById('loginPass').value;
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      initGame(username);
      authContainer.style.display = 'none';
    } else {
      alert(data.message || 'Erreur de connexion');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    alert('Erreur de connexion au serveur');
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUser').value;
  const password = document.getElementById('signupPass').value;
  
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('Compte créé avec succès! Connectez-vous maintenant.');
      showLoginForm();
    } else {
      alert(data.message || 'Erreur d\'inscription');
    }
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    alert('Erreur de connexion au serveur');
  }
});

showSignupBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'flex';
});

showLoginBtn.addEventListener('click', () => {
  signupForm.style.display = 'none';
  loginForm.style.display = 'flex';
});

function showLoginForm() {
  signupForm.style.display = 'none';
  loginForm.style.display = 'flex';
}

// Initialize auth system if enabled
if (authConfig.enableAuth) {
  new AuthSystem(initGame);
} else {
  initGame('Player');
}

let lastTime = 0;
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Update game state
    game.update(deltaTime);
    chatMovementSystem.update(deltaTime);

    // Update chat icon position
    const chatPosition = chatMovementSystem.getPosition();
    mapChatIcon.style.left = `${chatPosition.x}px`;
    mapChatIcon.style.top = `${chatPosition.y}px`;
    
    requestAnimationFrame(gameLoop);
} 