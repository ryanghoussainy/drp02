import { useState, useEffect } from 'react';
import { getPlayerCommunities } from '../operations/Player';

export default function usePlayerCommunities(playerId: string) {
  const [communityIds, setCommunityIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      const communities = await getPlayerCommunities(playerId);
      setCommunityIds(communities); 
    };

    fetchCommunities();
  }, [playerId]);

  return { communityIds };
}
