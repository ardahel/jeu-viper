import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import setupAuthRoutes from './routes/auth.js';
import Item from './models/Item.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
setupAuthRoutes(app);

// Route pour récupérer les items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    console.log('Items trouvés:', items);
    res.json(items);
  } catch (error) {
    console.error('Erreur lors de la récupération des items:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour acheter un item
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

// Route pour récupérer l'inventaire
app.get('/inventory/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    
    res.json({ inventory: user.inventory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'inventaire:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API de jeu 2D opérationnelle ✅' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`[🚀] Serveur démarré sur le port ${PORT}`);
}); 