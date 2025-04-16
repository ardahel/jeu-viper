import User from '../models/User.js';

export default function setupGetInventoryRoute(app) {
  console.log('[ROUTE] /inventory initialisée ✅');

  app.get('/inventory/:username', async (req, res) => {
    try {
      const { username } = req.params;
      
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }

      res.json({
        gold: user.gold,
        inventory: user.inventory
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'inventaire:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
} 