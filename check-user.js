import mongoose from 'mongoose';
import User from './models/User.js';

async function checkUser() {
    try {
        await mongoose.connect('mongodb://localhost:27017/viper-game');
        console.log('✅ Connexion à MongoDB réussie');
        
        const user = await User.findOne({ username: 'root' });
        console.log('Or de root:', user ? user.gold : 'Utilisateur non trouvé');
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

checkUser(); 