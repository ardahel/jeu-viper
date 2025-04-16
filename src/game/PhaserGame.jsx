import { useEffect, useRef } from 'react';
import StartGame from './main';

const PhaserGame = ({ username, gold }) => {
    const game = useRef();

    useEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");
            
            // Attendre que le jeu soit prêt
            const checkGameReady = setInterval(() => {
                if (game.current && game.current.scene && game.current.scene.scenes) {
                    const gameScene = game.current.scene.scenes.find(scene => scene.scene.key === 'Game');
                    if (gameScene) {
                        gameScene.username = username;
                        gameScene.gold = gold;
                        clearInterval(checkGameReady);
                    }
                }
            }, 100);
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, [username]);

    // Mettre à jour l'or en temps réel
    useEffect(() => {
        if (game.current && game.current.scene && game.current.scene.scenes) {
            const gameScene = game.current.scene.scenes.find(scene => scene.scene.key === 'Game');
            if (gameScene) {
                gameScene.gold = gold;
            }
        }
    }, [gold]);

    return <div id="game-container"></div>;
};

export default PhaserGame;
