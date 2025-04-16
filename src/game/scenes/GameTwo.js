import { Scene } from 'phaser';

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

        // Ajout du personnage à la position de téléportation
        this.player = this.add.sprite(this.playerX, this.scale.height / 2 - 100, 'cat');
        this.player.setScale(0.2);

        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Variables pour le mouvement
        this.playerSpeed = 400;
        this.jumpForce = -400;
        this.gravity = 800;
        this.playerVelocity = { x: 0, y: 0 };
        this.isGrounded = false;

        // Ajout de la physique au joueur
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Ajuster la taille de la map pour qu'elle soit identique à la première
        const firstMapWidth = this.textures.get('map-foret').getSourceImage().width;
        const secondMapWidth = this.textures.get('map-two').getSourceImage().width;
        const scaleRatio = firstMapWidth / secondMapWidth;
        this.map.setScale(1.2 * scaleRatio);
    }

    update() {
        // Gestion du mouvement horizontal
        if (this.cursors.left.isDown) {
            this.playerVelocity.x = -this.playerSpeed;
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.playerVelocity.x = this.playerSpeed;
            this.player.flipX = false;
        } else {
            this.playerVelocity.x = 0;
        }

        // Gestion du saut
        if (this.cursors.up.isDown && this.isGrounded) {
            this.playerVelocity.y = this.jumpForce;
            this.isGrounded = false;
        }

        // Application de la gravité
        this.playerVelocity.y += this.gravity * (1/60);

        // Mise à jour de la position
        this.player.x += this.playerVelocity.x * (1/60);
        this.player.y += this.playerVelocity.y * (1/60);

        // Collision avec le sol
        if (this.player.y > this.scale.height / 2 + 100) {
            this.player.y = this.scale.height / 2 + 100;
            this.playerVelocity.y = 0;
            this.isGrounded = true;
        }

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