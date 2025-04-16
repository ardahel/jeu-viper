import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
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

        // Ajout du personnage
        this.player = this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 100, 'cat');
        this.player.setScale(0.2);

        // Barre d'icônes en haut
        const iconSize = 25;
        const iconSpacing = 45;
        const startX = 285;
        const iconY = 35;

        // Icône Shop
        this.shopIcon = this.add.image(startX, iconY, 'shop-icon');
        this.shopIcon.setScale(0.2);
        this.shopIcon.setInteractive();
        this.shopIcon.setDepth(1);
        this.shopIcon.on('pointerdown', () => {
            this.scene.pause();
            this.scene.launch('Shop');
        });

        // Icône Accounts
        const accountsIcon = this.add.image(startX + iconSize + iconSpacing, iconY, 'accounts');
        accountsIcon.setScale(0.2);
        accountsIcon.setInteractive();
        accountsIcon.setDepth(1);

        // Icône Friends
        const friendsIcon = this.add.image(startX + (iconSize + iconSpacing) * 2, iconY, 'friends');
        friendsIcon.setScale(0.2);
        friendsIcon.setInteractive();
        friendsIcon.setDepth(1);

        // Icône Settings
        const settingsIcon = this.add.image(startX + (iconSize + iconSpacing) * 3, iconY, 'settings');
        settingsIcon.setScale(0.2);
        settingsIcon.setInteractive();
        settingsIcon.setDepth(1);

        // Icône Bag
        const bagIcon = this.add.image(startX + (iconSize + iconSpacing) * 4, iconY, 'bag');
        bagIcon.setScale(0.2);
        bagIcon.setInteractive();
        bagIcon.setDepth(1);
        bagIcon.on('pointerdown', () => {
            this.scene.pause();
            this.scene.launch('Inventory');
        });

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
