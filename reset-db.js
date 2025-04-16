import mongoose from 'mongoose';
import User from './models/User.js';
import Item from './models/Item.js';

const uri = 'mongodb+srv://alextibo1:Onbx2AHLV0znIxDO@jeu2d.abhfwam.mongodb.net/?retryWrites=true&w=majority&appName=jeu2d';

async function resetDB() {
  try {
    await mongoose.connect(uri);
    console.log('[✅] Connexion MongoDB réussie');

    // Supprimer tous les utilisateurs et items existants
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('[✅] Base de données réinitialisée');

    // Créer le skin mage
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
    console.log('[✅] Items créés');

    console.log('[✅] Réinitialisation terminée');
    process.exit(0);
  } catch (err) {
    console.error('[❌] Erreur lors de la réinitialisation:', err);
    process.exit(1);
  }
}

resetDB(); 