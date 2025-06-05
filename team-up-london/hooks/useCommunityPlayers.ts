import { useState, useEffect } from 'react';
import { YOU_PLAYER_ID } from '../constants/youPlayerId';
import Player from '../interfaces/Player';
import { getCommunity, getPlayersInCommunity } from '../operations/Communities';

export default function useCommunityPlayers(community_id: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const refreshPlayers = async () => {
    const fetchedPlayers = await getPlayersInCommunity(community_id);
    const community = await getCommunity(community_id);
    const creator_id = community.creator_id;

    setCreatorId(creator_id);

    // Sort: creator first, 'You' second
    const sorted = fetchedPlayers.sort((a, b) => {
      if (a.id === creatorId && b.id !== creatorId) return -1;
      if (a.id !== creatorId && b.id === creatorId) return 1;
      if (a.id === YOU_PLAYER_ID && b.id !== YOU_PLAYER_ID) return -1;
      if (a.id !== YOU_PLAYER_ID && b.id === YOU_PLAYER_ID) return 1;
      return 0;
    });
    setPlayers(sorted);
  };

  useEffect(() => {
    refreshPlayers();
  }, []);

  return { players, creatorId };
}
