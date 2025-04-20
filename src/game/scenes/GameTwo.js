import { Scene } from 'phaser';
import { initPlayer, updatePlayerMovement } from '../utils/playerUtils.js';
import { createIcons } from '../utils/uiUtils.js';
import { playerConfig } from '../config/playerConfig.js';

export class GameTwo extends Scene
{
    constructor ()
    {
        super('GameTwo');
    }

    init(data)
    {
        this.playerX = data.playerX;
    }

    create ()
    {
        // Ajout du fond en plein écran
        const bg = this.add.image(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        // Ajout de la deuxième carte centrée avec la même taille que la première
        this.map = this.add.image(this.scale.width / 2, this.scale.height / 2, 'map-two');
        this.map.setOrigin(0.5, 0.5);
        this.map.setScale(1.2); // Même scale que la première map

        // Initialisation du joueur avec les utilitaires
        const playerData = initPlayer(this, this.playerX, this.scale.height / 2 - 100);
        
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

        // Ajuster la taille de la map pour qu'elle soit identique à la première
        const firstMapWidth = this.textures.get('map-foret').getSourceImage().width;
        const secondMapWidth = this.textures.get('map-two').getSourceImage().width;
        const scaleRatio = firstMapWidth / secondMapWidth;
        this.map.setScale(1.2 * scaleRatio);
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
            left: this.scale.width / 2 - (this.map.width * this.map.scale) / 2 + 50,
            right: this.scale.width / 2 + (this.map.width * this.map.scale) / 2 - 50
        };

        if (this.player.x < mapBounds.left) {
            // Retour à la première map
            this.scene.start('Game', { playerX: this.scale.width / 2 + (this.map.width * this.map.scale) / 2 - 100 });
        } else if (this.player.x > mapBounds.right) {
            this.player.x = mapBounds.right;
        }
    }
} 