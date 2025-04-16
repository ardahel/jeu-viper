export class NetworkSystem {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.serverUrl = window.location.origin;
  }

  init() {
    this.connect();
  }

  connect() {
    this.socket = io(this.serverUrl, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  update() {
    // Handle any pending network operations
  }

  // Player events
  registerPlayer(playerData) {
    if (this.connected) {
      this.socket.emit('register', playerData);
    }
  }

  updatePlayerPosition(position) {
    if (this.connected) {
      this.socket.emit('move', position);
    }
  }

  sendChatMessage(message) {
    if (this.connected) {
      this.socket.emit('chatMessage', message);
    }
  }

  // Event handlers
  onPlayersUpdate(callback) {
    this.socket.on('playersUpdate', callback);
  }

  onChatMessage(callback) {
    this.socket.on('chatMessage', callback);
  }

  onPlayerJoined(callback) {
    this.socket.on('playerJoined', callback);
  }

  onPlayerLeft(callback) {
    this.socket.on('playerLeft', callback);
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
} 