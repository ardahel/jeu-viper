import React from 'react';
import './ShopPanel.css';

const ShopPanel = ({ onClose }) => {
    const items = [
        { name: 'Potion de Vie', price: 100, icon: '❤️' },
        { name: 'Potion de Force', price: 200, icon: '💪' },
        { name: 'Potion de Vitesse', price: 150, icon: '⚡' }
    ];

    const handleBuy = (item) => {
        console.log(`Achat de ${item.name}`);
        // TODO: Implémenter la logique d'achat
    };

    return (
        <div className="shop-overlay">
            <div className="shop-panel">
                <div className="shop-header">
                    <h2>Boutique</h2>
                    <button className="close-button" onClick={onClose}>
                        <img src="/assets/icons/redo.png" alt="Fermer" />
                    </button>
                </div>
                <div className="shop-items">
                    {items.map((item, index) => (
                        <div key={index} className="shop-item">
                            <div className="item-icon">{item.icon}</div>
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">{item.price} 🪙</span>
                            </div>
                            <button 
                                className="buy-button"
                                onClick={() => handleBuy(item)}
                            >
                                Acheter
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopPanel; 