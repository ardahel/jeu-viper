export class Renderer {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.layers = new Map();
    this.camera = { x: 0, y: 0, scale: 1 };
    this.background = null;
  }

  init() {
    // Initialize renderer
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    

    this.map = new Image();
    this.map.src = '/map-foret.png';
    this.map.onload = () => {
      console.log('Map loaded successfully');
      // Forcer un rendu immédiat après le chargement
      this.render({ platforms: [], players: [], score: 0 });
    };
    this.map.onerror = (error) => {
      console.error('Error loading map:', error);
    };
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  render(state) {
    // Render background
    this.renderBackground();

    // Render game objects
    this.renderPlatforms(state.platforms);
    this.renderPlayers(state.players);

    // Render UI
    this.renderUI(state);
  }

  renderBackground() {
    if (this.background && this.background.complete) {
      this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
    }
    
    if (this.map && this.map.complete) {
      // Ajouter des marges en haut et en bas
      const margin = 50; // 50 pixels de marge
      const availableHeight = this.height - (margin * 2);
      
      // Calculer les dimensions pour maintenir le ratio 16:9
      const targetWidth = this.width;
      const targetHeight = Math.min((targetWidth * 9) / 16, availableHeight);
      
      // Centrer verticalement
      const y = margin + (availableHeight - targetHeight) / 2;
      
      this.ctx.drawImage(this.map, 0, y, targetWidth, targetHeight);
    }
  }

  renderPlatforms(platforms) {
    this.ctx.fillStyle = '#8B4513'; // Brown
    for (const platform of platforms) {
      this.ctx.fillRect(
        platform.x - this.camera.x,
        platform.y - this.camera.y,
        platform.width,
        platform.height
      );
    }
  }

  renderPlayers(players) {
    for (const player of players) {
      // Render player sprite
      if (player.sprite) {
        this.ctx.save();
        if (!player.facingRight) {
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(
            player.sprite,
            -player.x - player.width - this.camera.x,
            player.y - this.camera.y,
            player.width,
            player.height
          );
        } else {
          this.ctx.drawImage(
            player.sprite,
            player.x - this.camera.x,
            player.y - this.camera.y,
            player.width,
            player.height
          );
        }
        this.ctx.restore();
      }

      // Render player name
      this.ctx.fillStyle = 'black';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        player.username,
        player.x - this.camera.x + player.width / 2,
        player.y - this.camera.y - 5
      );
    }
  }

  renderUI(state) {
    // Render score
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${state.score}`, 10, 30);

    // Afficher le chat
    this.renderChat();
  }

  setCamera(x, y, scale = 1) {
    this.camera = { x, y, scale };
  }
} 