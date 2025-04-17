import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/server/models/User.js';
import Item from '../src/server/models/Item.js';
import Shop from '../src/server/models/Shop.js';
import UserItem from '../src/server/models/UserItem.js';

const uri = 'mongodb+srv://alextibo1:Onbx2AHLV0znIxDO@jeu2d.abhfwam.mongodb.net/?retryWrites=true&w=majority&appName=jeu2d';

async function initDB() {
  try {
    await mongoose.connect(uri);
    console.log('[✅] Connexion MongoDB réussie');

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Shop.deleteMany({}),
      UserItem.deleteMany({})
    ]);
    console.log('[✅] Base de données nettoyée');

    // Créer les items
    const items = await Item.create([
      { 
        name: 'Skin Mage',
        description: 'Un puissant mage aux pouvoirs mystiques',
        type: 'skin',
        rarity: 'rare',
        price: 500,
        isShopAvailable: true,
        skinData: {
          characterName: 'Mage',
          imageUrl: 'assets/skins/mage.png'
        }
      },
      {
        name: 'Potion de Vie',
        description: 'Restaure 50 points de vie',
        type: 'consumable',
        rarity: 'common',
        price: 100,
        isShopAvailable: true,
        consumableData: {
          maxDurability: 1,
          effectDescription: 'Restaure 50 HP'
        }
      }
    ]);
    console.log('[✅] Items créés');

    // Créer l'utilisateur root
    const hashedPassword = await bcrypt.hash('root', 10);
    const user = await User.create({
      username: 'root',
      email: 'root@example.com',
      password: hashedPassword,
      gold: 3999
    });
    console.log('[✅] Utilisateur root créé');

    // Ajouter les items à la boutique
    await Shop.create(
      items.map(item => ({
        itemId: item._id,
        stock: null,
        discountPercentage: 0
      }))
    );
    console.log('[✅] Boutique initialisée');

    // Donner le Skin Mage à root
    await UserItem.create({
      userId: user._id,
      itemId: items[0]._id, // Skin Mage
      quantity: 1,
      isEquipped: false
    });
    console.log('[✅] Item donné à root');

    console.log('[✅] Initialisation terminée avec succès');
    process.exit(0);
  } catch (err) {
    console.error('[❌] Erreur lors de l\'initialisation:', err);
    process.exit(1);
  }
}

initDB(); 