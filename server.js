import express from 'express';
import cors from 'cors';
import connectDB from './db.js'; // 👉 Connexion MongoDB
import setupSignupRoute from './signup/signup.js';
import setupLoginRoute from './login/login.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 🌍 CORS config pour frontend Render
app.use(cors({
  origin: 'https://jeu-viper.onrender.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

await connectDB(); // 👉 Appelle la connexion MongoDB ici

// 🚏 monte les routes
setupSignupRoute(app);
setupLoginRoute(app);

// 🎯 sert le dossier public avec le jeu HTML
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré : http://localhost:${PORT}`);
});
