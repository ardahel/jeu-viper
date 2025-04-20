import { playerConfig } from '../config/playerConfig.js';

/**
 * Initialise les paramètres de mouvement du joueur
 * @param {Phaser.Scene} scene - La scène où initialiser le joueur
 * @param {number} x - Position X initiale
 * @param {number} y - Position Y initiale
 * @param {string} spriteKey - Clé du sprite du joueur
 * @returns {Object} - Le joueur et ses paramètres de mouvement
 */
export function initPlayer(scene, x, y, spriteKey = 'cat') {
    // Créer le sprite du joueur
    const player = scene.add.sprite(x, y, spriteKey);
    player.setScale(playerConfig.scale);
    
    // Ajouter la physique au joueur
    scene.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    
    // Initialiser les variables de mouvement
    const playerVelocity = { x: 0, y: 0 };
    const isGrounded = false;
    
    return {
        player,
        playerVelocity,
        isGrounded,
        config: playerConfig
    };
}

/**
 * Met à jour le mouvement du joueur
 * @param {Object} params - Paramètres de mise à jour
 * @param {Phaser.Scene} params.scene - La scène
 * @param {Phaser.GameObjects.Sprite} params.player - Le sprite du joueur
 * @param {Object} params.playerVelocity - La vélocité du joueur
 * @param {boolean} params.isGrounded - Si le joueur est au sol
 * @param {Phaser.Input.Keyboard.CursorKeys} params.cursors - Les touches de contrôle
 * @param {number} params.groundY - Position Y du sol
 */
export function updatePlayerMovement({ scene, player, playerVelocity, isGrounded, cursors, groundY }) {
    // Gestion du mouvement horizontal
    if (cursors.left.isDown) {
        playerVelocity.x = -playerConfig.playerSpeed;
        player.flipX = true;
    } else if (cursors.right.isDown) {
        playerVelocity.x = playerConfig.playerSpeed;
        player.flipX = false;
    } else {
        playerVelocity.x = 0;
    }

    // Gestion du saut
    if (cursors.up.isDown && isGrounded) {
        playerVelocity.y = playerConfig.jumpForce;
        isGrounded = false;
    }

    // Application de la gravité
    playerVelocity.y += playerConfig.gravity * (1/60);

    // Mise à jour de la position
    player.x += playerVelocity.x * (1/60);
    player.y += playerVelocity.y * (1/60);

    // Collision avec le sol
    if (player.y > scene.scale.height / 2 + groundY) {
        player.y = scene.scale.height / 2 + groundY;
        playerVelocity.y = 0;
        isGrounded = true;
    }
    
    return { playerVelocity, isGrounded };
} 