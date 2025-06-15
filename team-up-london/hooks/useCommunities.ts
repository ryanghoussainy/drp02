import { useCallback, useState } from 'react';
import Community from '../interfaces/Community';
import { getCommunities, getPlayersInCommunity } from '../operations/Communities';
import { useFocusEffect } from '@react-navigation/native';


export default function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);

  const [communityPlayers, setCommunityPlayers] = useState<Map<string, string[]>>(new Map());

  const refreshCommunities = async () => {
    const fetchedCommunities = await getCommunities();
    setCommunities(fetchedCommunities);

    // Create a Map to store community players for quick lookup
    const communityPlayersMap = new Map<string, string[]>();
    // Batch fetch all unique community IDs
    const uniqueCommunityIds = [...new Set(fetchedCommunities.map(c => c.id))];
    // Pre-populate the map with community players
    await Promise.all(
      uniqueCommunityIds.map(async (communityId) => {
        const players = await getPlayersInCommunity(communityId);
        communityPlayersMap.set(communityId, players.map(player => player.id));
      })
    );
    setCommunityPlayers(communityPlayersMap);
  };

  useFocusEffect(
    useCallback(() => {
      refreshCommunities();
    }, [])
  );

  return { communities, communityPlayers };
}
