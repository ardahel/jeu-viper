import { Scene } from 'phaser';
import { initPlayer, updatePlayerMovement } from '../utils/playerUtils.js';
import { createIcons } from '../utils/uiUtils.js';
import { playerConfig } from '../config/playerConfig.js';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
        this.username = '';
        this.gold = 0;
    }

    init(data) {
        this.username = data.username || '';
        this.gold = data.gold || 0;
    }

    create ()
    {
        // Ajout du fond en plein écran
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // Ajout de la carte de la forêt centrée
        this.map = this.add.image(this.scale.width / 2, this.scale.height / 2, 'map-foret');
        this.map.setOrigin(0.5, 0.5);
        this.map.setScale(1.2); // Réduction de la taille de la carte

        // Initialisation du joueur avec les utilitaires
        const playerCenterX = this.scale.width / 2;
        const playerCenterY = this.scale.height / 2 - 100;
        const playerData = initPlayer(this, playerCenterX, playerCenterY);
        
        this.player = playerData.player;
        this.playerVelocity = playerData.playerVelocity;
        this.isGrounded = playerData.isGrounded;

        // Création des icônes avec les utilitaires
        const iconCallbacks = {
            shop: () => {
                this.scene.pause();
                this.scene.launch('Shop', { username: this.username, gold: this.gold });
            },
            bag: () => {
                this.scene.pause();
                this.scene.launch('Inventory', { username: this.username });
            }
        };
        
        this.icons = createIcons(this, iconCallbacks);

        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Mise à jour du mouvement du joueur avec les utilitaires
        const movementResult = updatePlayerMovement({
            scene: this,
            player: this.player,
            playerVelocity: this.playerVelocity,
            isGrounded: this.isGrounded,
            cursors: this.cursors,
            groundY: playerConfig.groundY
        });
        
        this.playerVelocity = movementResult.playerVelocity;
        this.isGrounded = movementResult.isGrounded;

        // Limites de la carte
        const mapBounds = {
            left: this.scale.width / 2 - (this.map.width * 1.2) / 2 + 50,
            right: this.scale.width / 2 + (this.map.width * 1.2) / 2 - 50
        };

        if (this.player.x < mapBounds.left) {
            this.player.x = mapBounds.left;
        } else if (this.player.x > mapBounds.right) {
            // Téléportation vers la deuxième map
            this.scene.start('GameTwo', { playerX: this.scale.width / 2 - (this.map.width * 1.2) / 2 + 100 });
        }
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
