import { useState, useEffect } from 'react';
import Game from '../interfaces/Game';
import { getGamesInCommunity } from '../operations/Communities';

export default function useCommunityGames(community_id: string) {
  const [games, setGames] = useState<Game[]>([]);

  const refreshGames = async () => {
    const fetchedGames = await getGamesInCommunity(community_id);

    setGames(fetchedGames);
  };

  useEffect(() => {
    refreshGames();
  }, []);

  return { games };
}
