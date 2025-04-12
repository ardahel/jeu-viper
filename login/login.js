import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';

export default function setupLoginRoute(app) {
  console.log('[ROUTE] /login initialisée ✅');

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Champs requis.' });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      res.json({ message: 'Connecté ✅', username });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  });
}
