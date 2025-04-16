import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import setupAuthRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
setupAuthRoutes(app);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API de jeu 2D opérationnelle ✅' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`[🚀] Serveur démarré sur le port ${PORT}`);
}); 