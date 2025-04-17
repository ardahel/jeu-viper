import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import express from 'express';

const router = express.Router();

// Route d'inscription
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const user = new User({
            username,
            password: hashedPassword,
            gold: 1000
        });

        await user.save();

        res.status(201).json({ 
            message: 'Inscription réussie',
            user: {
                username: user.username,
                gold: user.gold
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }

        // Trouver l'utilisateur
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        res.json({ 
            message: 'Connexion réussie',
            user: {
                username: user.username,
                gold: user.gold
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

export default router; 