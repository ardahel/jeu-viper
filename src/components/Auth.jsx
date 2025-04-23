import { useState } from 'react';
import './Auth.css';

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : 'http://localhost:5000';

export default function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const apiEndpoint = `${API_URL}/api/auth/${isLogin ? 'login' : 'signup'}`;
            console.log('URL de l\'API:', apiEndpoint);
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage(data.message);
            if (isLogin) {
                onLogin(data.user);
            } else {
                setIsLogin(true);
                setMessage('Compte créé ! Vous pouvez maintenant vous connecter.');
            }
        } catch (err) {
            setError(err.message || 'Une erreur est survenue');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
                
                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Se connecter' : "S'inscrire"}
                    </button>
                </form>

                <button 
                    className="switch-btn"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setMessage('');
                    }}
                >
                    {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                </button>
            </div>
        </div>
    );
} 