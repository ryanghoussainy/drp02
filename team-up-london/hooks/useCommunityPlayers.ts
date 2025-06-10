import { useState, useEffect } from 'react';
import Player from '../interfaces/Player';
import { getCommunity, getPlayersInCommunity, joinCommunity, leaveCommunity } from '../operations/Communities';

export default function useCommunityPlayers(playerId: string, communityId: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);

  const refreshPlayers = async () => {
    const fetchedPlayers = await getPlayersInCommunity(communityId);
    const community = await getCommunity(communityId);
    const creator_id = community.creator_id;

    setCreatorId(creator_id);

    // Sort: creator first, 'You' second
    const sorted = fetchedPlayers.sort((a, b) => {
      if (a.id === creatorId && b.id !== creatorId) return -1;
      if (a.id !== creatorId && b.id === creatorId) return 1;
      if (a.id === playerId && b.id !== playerId) return -1;
      if (a.id !== playerId && b.id === playerId) return 1;
      return 0;
    });
    setPlayers(sorted);
  };

  useEffect(() => {
    refreshPlayers();
  }, []);

  const handleJoin = async () => {
    // TODO: Implement join community logic
    await joinCommunity(playerId, communityId);
    await refreshPlayers();
  }

  const handleLeave = async () => {
    await leaveCommunity(playerId, communityId);
    await refreshPlayers();
  }

  return { players, creatorId, handleJoin, handleLeave };
}
