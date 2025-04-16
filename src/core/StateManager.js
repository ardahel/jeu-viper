export class StateManager {
  constructor() {
    this.state = {
      players: new Map(),
      platforms: [],
      chat: [],
      gameState: 'lobby', // lobby, playing, paused
      currentPlayer: null,
      score: 0,
      time: 0
    };

    this.listeners = new Map();
  }

  init() {
    // Initialize default state
  }

  update() {
    // Update game time
    this.state.time += 1/60; // Assuming 60 FPS, should be updated with actual deltaTime
  }

  // State getters
  getPlayers() {
    return Array.from(this.state.players.values());
  }

  getPlatforms() {
    return this.state.platforms;
  }

  getChat() {
    return this.state.chat;
  }

  getGameState() {
    return this.state.gameState;
  }

  getCurrentPlayer() {
    return this.state.currentPlayer;
  }

  getScore() {
    return this.state.score;
  }

  // State setters
  setPlayer(id, playerData) {
    this.state.players.set(id, playerData);
    this.notifyListeners('players');
  }

  removePlayer(id) {
    this.state.players.delete(id);
    this.notifyListeners('players');
  }

  setPlatforms(platforms) {
    this.state.platforms = platforms;
    this.notifyListeners('platforms');
  }

  addChatMessage(message) {
    this.state.chat.push(message);
    if (this.state.chat.length > 50) { // Keep last 50 messages
      this.state.chat.shift();
    }
    this.notifyListeners('chat');
  }

  setGameState(state) {
    this.state.gameState = state;
    this.notifyListeners('gameState');
  }

  setCurrentPlayer(player) {
    this.state.currentPlayer = player;
    this.notifyListeners('currentPlayer');
  }

  setScore(score) {
    this.state.score = score;
    this.notifyListeners('score');
  }

  // Event listeners
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(this.state[event]));
    }
  }
} 