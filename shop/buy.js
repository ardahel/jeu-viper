import User from '../models/User.js';
import Item from '../models/Item.js';

export default function setupBuyRoute(app) {
  console.log('[ROUTE] /buy initialisée ✅');

  app.post('/buy', async (req, res) => {
    try {
      const { username, itemId } = req.body;
      
      if (!username || !itemId) {
        return res.status(400).json({ message: 'Données manquantes.' });
      }

      // Trouver l'utilisateur
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }

      // Trouver l'item
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item introuvable.' });
      }

      // Vérifier si l'utilisateur a assez d'or
      if (user.gold < item.price) {
        return res.status(400).json({ message: 'Pas assez d\'or.' });
      }

      // Mettre à jour l'or de l'utilisateur
      user.gold -= item.price;

      // Ajouter l'item à l'inventaire
      const existingItem = user.inventory.find(i => i.itemId === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.inventory.push({
          itemId: item._id,
          name: item.name,
          quantity: 1,
          icon: item.icon
        });
      }

      // Sauvegarder les modifications
      await user.save();

      res.json({ 
        message: 'Achat réussi ✅', 
        gold: user.gold,
        inventory: user.inventory
      });
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
} 