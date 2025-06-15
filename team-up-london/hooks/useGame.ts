import { useState, useEffect } from 'react';
import { getGame } from '../operations/Games';
import Game from '../interfaces/Game';
import Sport from '../interfaces/Sport';
import { getSport } from '../operations/Sports';

export default function useGame(gameId: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [sport, setSport] = useState<Sport | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
        const fetchedGame = await getGame(gameId);
        setGame(fetchedGame);
        if (fetchedGame && fetchedGame.sport_id) {
            const fetchedSport = await getSport(fetchedGame.sport_id);
            setSport(fetchedSport);
        }
    };

    fetchGame();
  }, []);

  return { game, sport };
}
