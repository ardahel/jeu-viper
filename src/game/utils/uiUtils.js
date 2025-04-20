import { uiConfig } from '../config/uiConfig.js';

/**
 * Crée les icônes d'interface utilisateur dans une scène
 * @param {Phaser.Scene} scene - La scène où créer les icônes
 * @param {Object} callbacks - Les callbacks pour les actions des icônes
 * @returns {Object} - Les icônes créées
 */
export function createIcons(scene, callbacks = {}) {
    const icons = {};
    const { size, spacing, startX, y, scale } = uiConfig.icons;
    
    uiConfig.iconList.forEach((icon, index) => {
        const x = startX + (size + spacing) * index;
        
        // Créer l'icône
        const iconSprite = scene.add.image(x, y, icon.key);
        iconSprite.setScale(scale);
        iconSprite.setInteractive();
        iconSprite.setDepth(1);
        
        // Ajouter le callback si spécifié
        if (callbacks[icon.name]) {
            iconSprite.on('pointerdown', callbacks[icon.name]);
        }
        
        // Stocker l'icône
        icons[icon.name] = iconSprite;
    });
    
    return icons;
} 