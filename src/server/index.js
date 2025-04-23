import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import Item from './models/Item.js';
import User from './models/User.js';
import UserItem from './models/UserItem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Stockage temporaire des messages (à remplacer par une base de données dans un environnement de production)
let messages = [];

// Routes pour le chat
app.get('/api/chat/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/chat/messages', (req, res) => {
    const { content, userId, username, timestamp } = req.body;
    
    if (!content || !userId || !username) {
        return res.status(400).json({ error: 'Données manquantes' });
    }

    const newMessage = {
        id: Date.now(),
        content,
        userId,
        username,
        timestamp: timestamp || new Date().toISOString()
    };

    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// En production, servir les fichiers statiques avant les routes API
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));
  console.log('Serving static files from:', distPath);
}

// Routes API
app.use('/api/auth', authRoutes);

// Route pour récupérer les items
app.get('/api/items', async (req, res) => {
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
app.post('/api/buy', async (req, res) => {
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
app.get('/api/inventory/:username', async (req, res) => {
  try {
    const { username } = req.params;
    console.log('Recherche de l\'inventaire pour:', username);
    
    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    console.log('Utilisateur trouvé:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }
    
    // Récupérer l'inventaire avec les détails des items
    const userItems = await UserItem.find({ userId: user._id })
      .populate('itemId')
      .lean();

    // Formater les données pour le client
    const inventory = userItems.map(userItem => ({
      itemId: userItem.itemId._id,
      name: userItem.itemId.name,
      quantity: userItem.quantity,
      isEquipped: userItem.isEquipped,
      type: userItem.itemId.type,
      rarity: userItem.itemId.rarity,
      description: userItem.itemId.description,
      currentDurability: userItem.currentDurability,
      // Données spécifiques selon le type
      ...(userItem.itemId.type === 'skin' ? userItem.itemId.skinData : {}),
      ...(userItem.itemId.type === 'consumable' ? userItem.itemId.consumableData : {})
    }));

    console.log('Inventaire à envoyer:', inventory);
    res.json({ inventory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'inventaire:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour ajouter un item spécifique à l'inventaire
app.post('/api/add-item', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Nom d\'utilisateur manquant.' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Item à ajouter
    const newItem = {
      itemId: '68000ebc365fb4dc654b2a1f',
      name: 'Skin Mage',
      quantity: 1,
      icon: '🧙'
    };

    // Vérifier si l'item existe déjà dans l'inventaire
    const existingItem = user.inventory.find(i => i.itemId === newItem.itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.inventory.push(newItem);
    }

    // Sauvegarder les modifications
    await user.save();

    res.json({ 
      message: 'Item ajouté avec succès ✅', 
      inventory: user.inventory
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'item:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour réinitialiser l'inventaire d'un utilisateur
app.post('/api/reset-inventory', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Nom d\'utilisateur manquant.' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Réinitialiser l'inventaire
    user.inventory = [];
    await user.save();

    res.json({ 
      message: 'Inventaire réinitialisé ✅',
      inventory: user.inventory
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de l\'inventaire:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route API de test
app.get('/api/status', (req, res) => {
  res.json({ message: 'API de jeu 2D opérationnelle ✅' });
});

// En production, toutes les autres routes renvoient index.html
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return res.sendFile(path.join(__dirname, '../../dist/index.html'));
    }
    next();
  });
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`[🚀] Serveur démarré sur le port ${PORT}`);
}); 