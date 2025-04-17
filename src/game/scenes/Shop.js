import { Scene } from 'phaser';

export class Shop extends Scene
{
    constructor ()
    {
        super('Shop');
        this.items = [];
        this.username = '';
        this.gold = 0;
    }

    init(data) {
        this.username = data.username || '';
        this.gold = data.gold || 0;
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

        // Affichage de l'or
        const goldIcon = this.add.image(shopPanel.x + 30, 70, 'gold');
        goldIcon.setScale(0.1);
        
        const goldText = this.add.text(shopPanel.x + 50, 70, `${this.gold}`, {
            fontSize: '20px',
            fill: '#ffd700',
            fontWeight: 'bold'
        });
        goldText.setOrigin(0, 0.5);

        // Bouton de fermeture avec l'icône redo (à gauche)
        const closeButton = this.add.image(shopPanel.x + 30, 30, 'redo');
        closeButton.setScale(0.2);
        closeButton.setInteractive();
        closeButton.on('pointerdown', () => {
            this.scene.resume('Game');
            this.scene.stop();
        });

        // Récupérer les items depuis la base de données
        this.fetchItems().then(() => {
            this.displayItems(shopPanel);
        });
    }

    async fetchItems() {
        try {
            console.log('Récupération des items depuis le serveur...');
            const response = await fetch('/api/items');
            if (response.ok) {
                this.items = await response.json();
                console.log('Items récupérés:', this.items);
            } else {
                console.error('Erreur lors de la récupération des items');
                // Utiliser des items par défaut en cas d'erreur
                this.items = [
                    { _id: '1', name: 'Potion de Vie', price: 100, icon: '❤️' },
                    { _id: '2', name: 'Potion de Force', price: 200, icon: '💪' },
                    { _id: '3', name: 'Potion de Vitesse', price: 150, icon: '⚡' }
                ];
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des items:', error);
            // Utiliser des items par défaut en cas d'erreur
            this.items = [
                { _id: '1', name: 'Potion de Vie', price: 100, icon: '❤️' },
                { _id: '2', name: 'Potion de Force', price: 200, icon: '💪' },
                { _id: '3', name: 'Potion de Vitesse', price: 150, icon: '⚡' }
            ];
        }
    }

    displayItems(shopPanel) {
        this.items.forEach((item, index) => {
            const y = 120 + (index * 100);
            
            // Fond de l'item (plus sombre)
            const itemBg = this.add.rectangle(shopPanel.x + 150, y, 280, 80, 0x1e2d3d);
            itemBg.setOrigin(0.5, 0.5);

            // Image de l'item (pour le skin)
            if (item.imagePath) {
                const itemImage = this.add.image(shopPanel.x + 50, y, 'mage');
                itemImage.setScale(0.15);
            } else {
                // Fallback sur l'icône si pas d'image
                this.add.text(shopPanel.x + 50, y, item.icon, {
                    fontSize: '32px'
                }).setOrigin(0.5);
            }

            // Nom de l'item
            this.add.text(shopPanel.x + 100, y - 15, item.name, {
                fontSize: '22px',
                fill: '#ffffff'
            }).setOrigin(0, 0.5);

            // Prix
            const goldIcon = this.add.image(shopPanel.x + 90, y + 15, 'gold');
            goldIcon.setScale(0.1);
            
            this.add.text(shopPanel.x + 110, y + 15, `${item.price}`, {
                fontSize: '20px',
                fill: '#ffd700',
                fontWeight: 'bold'
            }).setOrigin(0, 0.5);

            // Bouton d'achat
            const buttonWidth = 100;
            const buttonX = shopPanel.x + 240;
            const buttonColor = this.gold >= item.price ? 0x2196F3 : 0x9E9E9E;
            const buttonText = this.gold >= item.price ? 'Acheter' : 'Pas assez d\'or';

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
                if (this.gold >= item.price) {
                    buyButton.setScale(1.05);
                    buyText.setScale(1.05);
                }
            });

            buyButton.on('pointerout', () => {
                buyButton.setScale(1);
                buyText.setScale(1);
            });

            buyButton.on('pointerdown', () => {
                if (this.gold >= item.price) {
                    this.buyItem(item);
                }
            });
        });
    }

    async buyItem(item) {
        try {
            const response = await fetch('/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    itemId: item._id
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.gold = data.gold;
                
                // Mettre à jour l'or dans la scène Game
                const gameScene = this.scene.get('Game');
                if (gameScene) {
                    gameScene.gold = this.gold;
                }
                
                // Afficher un message de succès
                const successText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Achat réussi!', {
                    fontSize: '32px',
                    fill: '#4CAF50',
                    fontWeight: 'bold'
                });
                successText.setOrigin(0.5);
                
                // Faire disparaître le message après 2 secondes
                this.time.delayedCall(2000, () => {
                    successText.destroy();
                    // Rafraîchir la boutique
                    this.scene.restart({ username: this.username, gold: this.gold });
                });
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de l\'achat:', errorData.message);
                
                // Afficher un message d'erreur
                const errorText = this.add.text(this.scale.width / 2, this.scale.height / 2, errorData.message, {
                    fontSize: '32px',
                    fill: '#F44336',
                    fontWeight: 'bold'
                });
                errorText.setOrigin(0.5);
                
                // Faire disparaître le message après 2 secondes
                this.time.delayedCall(2000, () => {
                    errorText.destroy();
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'achat:', error);
            
            // Afficher un message d'erreur
            const errorText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Erreur lors de l\'achat', {
                fontSize: '32px',
                fill: '#F44336',
                fontWeight: 'bold'
            });
            errorText.setOrigin(0.5);
            
            // Faire disparaître le message après 2 secondes
            this.time.delayedCall(2000, () => {
                errorText.destroy();
            });
        }
    }
} 