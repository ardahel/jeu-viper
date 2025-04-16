import Item from '../models/Item.js';

export default function setupItemsRoute(app) {
  console.log('[ROUTE] /items initialisée ✅');

  app.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error('Erreur lors de la récupération des items:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
} 