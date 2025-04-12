import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';

export default function setupSignupRoute(app) {
  console.log('[ROUTE] /signup initialisée ✅');

  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Champs requis.' });
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Utilisateur déjà existant.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ username, password: hashedPassword });

      res.json({ message: 'Compte créé avec succès ✅' });
    } catch (err) {
      console.error('Erreur lors de l\'inscription :', err);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
}
