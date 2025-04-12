// db.js
import mongoose from 'mongoose';

const uri = 'mongodb+srv://alextibo1:Onbx2AHLV0znIxDO@jeu2d.abhfwam.mongodb.net/?retryWrites=true&w=majority&appName=jeu2d';

export default async function connectDB() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('[✅] Connexion MongoDB réussie');
  } catch (err) {
    console.error('[❌] Connexion MongoDB échouée :', err.message);
  }
}
