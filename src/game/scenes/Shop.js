import { Scene } from 'phaser';

export class Shop extends Scene
{
    constructor ()
    {
        super('Shop');
    }

    create ()
    {
        // Fond semi-transparent
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);

        // Panneau de la boutique (à droite)
        const shopPanel = this.add.rectangle(this.scale.width - 300, 0, 300, this.scale.height, 0x2c3e50);
        shopPanel.setOrigin(0, 0);

        // Titre de la boutique
        const title = this.add.text(shopPanel.x + 120, 20, 'Boutique', {
            fontSize: '24px',
            fill: '#ffffff'
        });
        title.setOrigin(0.5, 0);

        // Bouton de fermeture avec l'icône redo (à gauche)
        const closeButton = this.add.image(shopPanel.x + 30, 30, 'redo');
        closeButton.setScale(0.2);
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => {
            this.scene.resume('Game');
            this.scene.stop();
        });

        // Liste des skins à vendre
        const skins = [
            { name: 'Chat', price: 0, image: 'cat', owned: true },
            { name: 'Mage', price: 1500, image: 'mage', owned: false }
        ];

        // Afficher les skins
        skins.forEach((skin, index) => {
            const y = 100 + (index * 100);
            
            // Fond de l'item (plus sombre)
            const itemBg = this.add.rectangle(shopPanel.x + 150, y, 280, 80, 0x1e2d3d);
            itemBg.setOrigin(0.5, 0.5);

            // Image du skin (plus à gauche)
            const skinImage = this.add.image(shopPanel.x + 50, y, skin.image);
            skinImage.setScale(0.15);

            // Nom (plus grand et plus haut)
            this.add.text(shopPanel.x + 100, y - 15, skin.name, {
                fontSize: '22px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);

            // Prix
            if (skin.price > 0) {
                // Image de la pièce d'or (plus grande)
                const goldIcon = this.add.image(shopPanel.x + 90, y + 15, 'gold');
                goldIcon.setScale(0.1);
                
                // Prix en or (plus grand et aligné avec l'icône)
                this.add.text(shopPanel.x + 110, y + 15, `${skin.price}`, {
                    fontSize: '20px',
                    fill: '#ffd700',
                    fontWeight: 'bold'
                }).setOrigin(0, 0.5);
            } else {
                // Texte "Gratuit" en vert
                this.add.text(shopPanel.x + 100, y + 15, 'Gratuit', {
                    fontSize: '20px',
                    fill: '#4CAF50',
                    fontWeight: 'bold'
                }).setOrigin(0, 0.5);
            }

            // Bouton d'achat/équiper (plus à droite et plus grand)
            const buttonWidth = 100;
            const buttonX = shopPanel.x + 240;
            const buttonColor = skin.owned ? 0x4CAF50 : 0x2196F3;
            const buttonText = skin.owned ? 'Équiper' : 'Acheter';

            const buyButton = this.add.rectangle(buttonX, y, buttonWidth, 40, buttonColor);
            buyButton.setInteractive();

            const buyText = this.add.text(buttonX, y, buttonText, {
                fontSize: '18px',
                fill: '#ffffff',
                fontWeight: 'bold'
            });
            buyText.setOrigin(0.5);

            // Ajout d'effet hover sur le bouton
            buyButton.on('pointerover', () => {
                buyButton.setScale(1.05);
                buyText.setScale(1.05);
            });

            buyButton.on('pointerout', () => {
                buyButton.setScale(1);
                buyText.setScale(1);
            });

            buyButton.on('pointerdown', () => {
                if (skin.owned) {
                    console.log(`Équipement du skin ${skin.name}`);
                } else {
                    console.log(`Achat du skin ${skin.name} pour ${skin.price} gold`);
                }
            });
        });
    }
} 