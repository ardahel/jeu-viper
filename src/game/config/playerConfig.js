// Configuration des paramètres de mouvement du joueur
export const playerConfig = {
    // Vitesse de déplacement horizontal
    playerSpeed: 800,
    
    // Force du saut (valeur négative car en Phaser, les coordonnées Y augmentent vers le bas)
    jumpForce: -700,
    
    // Force de la gravité
    gravity: 2500,
    
    // Échelle du personnage
    scale: 0.2,
    
    // Position Y du sol (pour la détection de collision)
    groundY: 100
}; 