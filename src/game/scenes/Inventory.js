import { Scene } from 'phaser';

export class Inventory extends Scene
{
    constructor ()
    {
        super('Inventory');
        this.username = '';
        this.inventory = [];
    }

    init(data) {
        this.username = data.username || '';
    }

    create ()


    // ceci est un test
    {
        // Fond semi-transparent
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);

        // Panneau de l'inventaire (à droite)
        const inventoryPanel = this.add.rectangle(this.scale.width - 300, 0, 300, this.scale.height, 0x2c3e50);
        inventoryPanel.setOrigin(0, 0);

        // Titre de l'inventaire
        const title = this.add.text(inventoryPanel.x + 120, 20, 'Inventaire', {
            fontSize: '24px',
            fill: '#ffffff'
        });
        title.setOrigin(0.5, 0);

        // Bouton de fermeture avec l'icône redo (à gauche)
        const closeButton = this.add.image(inventoryPanel.x + 30, 30, 'redo');
        closeButton.setScale(0.2);
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => {
            this.scene.resume('Game');
            this.scene.stop();
        });

        // Récupérer l'inventaire depuis la base de données
        this.fetchInventory().then(() => {
            this.displayItems(inventoryPanel);
        });
    }

    async fetchInventory() {
        try {
            const response = await fetch(`http://localhost:3000/inventory/${this.username}`);
            if (response.ok) {
                const data = await response.json();
                this.inventory = data.inventory || [];
            } else {
                console.error('Erreur lors de la récupération de l\'inventaire');
                // Utiliser des items par défaut en cas d'erreur
                this.inventory = [
                    { name: 'Potion de Vie', quantity: 2, icon: '❤️' },
                    { name: 'Potion de Force', quantity: 1, icon: '💪' },
                    { name: 'Potion de Vitesse', quantity: 3, icon: '⚡' }
                ];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'inventaire:', error);
            // Utiliser des items par défaut en cas d'erreur
            this.inventory = [
                { name: 'Potion de Vie', quantity: 2, icon: '❤️' },
                { name: 'Potion de Force', quantity: 1, icon: '💪' },
                { name: 'Potion de Vitesse', quantity: 3, icon: '⚡' }
            ];
        }
    }

    displayItems(inventoryPanel) {
        if (this.inventory.length === 0) {
            // Afficher un message si l'inventaire est vide
            this.add.text(inventoryPanel.x + 150, 200, 'Inventaire vide', {
                fontSize: '24px',
                fill: '#ffffff'
            }).setOrigin(0.5);
            return;
        }

        this.inventory.forEach((item, index) => {
            const y = 100 + (index * 100);
            
            // Fond de l'item
            const itemBg = this.add.rectangle(inventoryPanel.x + 150, y, 280, 80, 0x1e2d3d);
            itemBg.setOrigin(0.5, 0.5);

            // Icône de l'item
            this.add.text(inventoryPanel.x + 50, y, item.icon, {
                fontSize: '32px'
            }).setOrigin(0.5);

            // Nom de l'item
            this.add.text(inventoryPanel.x + 100, y - 15, item.name, {
                fontSize: '22px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);

            // Quantité
            this.add.text(inventoryPanel.x + 100, y + 15, `Quantité: ${item.quantity}`, {
                fontSize: '18px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);

            // Bouton d'utilisation
            const useButton = this.add.rectangle(inventoryPanel.x + 240, y, 100, 40, 0x4CAF50);
            useButton.setInteractive();

            const useText = this.add.text(inventoryPanel.x + 240, y, 'Utiliser', {
                fontSize: '18px',
                fill: '#ffffff',
                fontWeight: 'bold'
            });
            useText.setOrigin(0.5);

            // Effet hover sur le bouton
            useButton.on('pointerover', () => {
                useButton.setScale(1.05);
                useText.setScale(1.05);
            });

            useButton.on('pointerout', () => {
                useButton.setScale(1);
                useText.setScale(1);
            });

            useButton.on('pointerdown', () => {
                this.useItem(item);
            });
        });
    }

    useItem(item) {
        // Afficher un message de confirmation
        const confirmText = this.add.text(this.scale.width / 2, this.scale.height / 2, `Utilisation de ${item.name}`, {
            fontSize: '32px',
            fill: '#4CAF50',
            fontWeight: 'bold'
        });
        confirmText.setOrigin(0.5);
        
        // Faire disparaître le message après 2 secondes
        this.time.delayedCall(2000, () => {
            confirmText.destroy();
        });
    }
} 