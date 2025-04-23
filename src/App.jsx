import { useState } from 'react';
import PhaserGame from './game/PhaserGame';
import Auth from './components/Auth';
import Chat from './components/Chat';
import './App.css';

function App() {
    const [username, setUsername] = useState(null);
    const [gold, setGold] = useState(1000);

    const handleLogin = (user) => {
        setUsername(user.username);
        setGold(user.gold || 1000);
    };

    return (
        <div id="app">
            {!username ? (
                <Auth onLogin={handleLogin} />
            ) : (
                <>
                    <div className="gold-display">
                        <img src="/assets/icons/gold.png" alt="Gold" className="gold-icon" />
                        <span>{gold}</span>
                    </div>
                    <PhaserGame username={username} gold={gold} />
                    <Chat currentUser={{ id: 1, username: username }} />
                </>
            )}
        </div>
    );
}

export default App;
