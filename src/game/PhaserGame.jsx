import { useEffect, useRef } from 'react';
import StartGame from './main';

const PhaserGame = () => {
    const game = useRef();

    useEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        }
    }, []);

    return <div id="game-container"></div>;
};

export default PhaserGame;
