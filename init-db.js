import mongoose from 'mongoose';
import Item from './models/Item.js';

const uri = 'mongodb+srv://alextibo1:Onbx2AHLV0znIxDO@jeu2d.abhfwam.mongodb.net/?retryWrites=true&w=majority&appName=jeu2d';

async function initDB() {
  try {
    await mongoose.connect(uri);
    console.log('[✅] Connexion MongoDB réussie');

    // Supprimer tous les items existants
    await Item.deleteMany({});
    console.log('[✅] Items existants supprimés');

    // Créer le nouveau skin mage
    const items = [
      { 
        name: 'Skin Mage', 
        price: 500, 
        icon: '🧙', 
        description: 'Skin de personnage Mage',
        effect: 'skin',
        imagePath: 'assets/skins/mage.png'
      }
    ];

    await Item.insertMany(items);
    console.log('[✅] Nouveau skin créé');

    console.log('[✅] Initialisation de la base de données terminée');
    process.exit(0);
  } catch (err) {
    console.error('[❌] Erreur lors de l\'initialisation de la base de données:', err);
    process.exit(1);
  }
}

initDB(); 