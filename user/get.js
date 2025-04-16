import User from '../models/User.js';

export default function setupGetUserRoute(app) {
  console.log('[ROUTE] /user/:username initialisée ✅');

  app.get('/user/:username', async (req, res) => {
    try {
      const { username } = req.params;
      console.log('Recherche de l\'utilisateur:', username);
      
      const user = await User.findOne({ username });
      console.log('Résultat de la recherche:', user);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }
      
      res.json({ 
        username: user.username,
        gold: user.gold,
        inventory: user.inventory
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
} 