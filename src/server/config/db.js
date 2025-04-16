import mongoose from 'mongoose';

const uri = 'mongodb+srv://alextibo1:Onbx2AHLV0znIxDO@jeu2d.abhfwam.mongodb.net/?retryWrites=true&w=majority&appName=jeu2d';

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('[✅] Connexion MongoDB réussie');
    } catch (err) {
        console.error('[❌] Erreur de connexion MongoDB:', err);
        process.exit(1);
    }
}

export default connectDB; 