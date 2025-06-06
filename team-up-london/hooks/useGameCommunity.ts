import { useState, useEffect } from 'react';
import Community from '../interfaces/Community';
import { getGameCommunity } from '../operations/Communities';

export default function useGameCommunity(gameId: string) {
  const [community, setCommunity] = useState<Community | null>(null);

  const refreshCommunity = async (id: string) => {
    const fetchedCommunity = await getGameCommunity(id);
    setCommunity(fetchedCommunity);
  };

  useEffect(() => {
    if (gameId) {
      refreshCommunity(gameId);
    }
  }, [gameId]);

  return { community };
}
