import { useState, useEffect } from 'react';
import { getPlayers, joinGame, leaveGame, Player } from '../operations/Games';

export default function useGamePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);

  const refreshPlayers = async () => {
    const fetchedPlayers = await getPlayers();
    // Sort: host first, 'You' second
    const sorted = fetchedPlayers.sort((a, b) => {
      if (a.host && !b.host) return -1;
      if (!a.host && b.host) return 1;
      if (a.name === 'You' && b.name !== 'You') return -1;
      if (a.name !== 'You' && b.name === 'You') return 1;
      return 0;
    });
    setPlayers(sorted);
  };

  useEffect(() => {
    refreshPlayers();
  }, []);

  const handleJoin = async () => {
    if (players.some((p) => p.name === 'You')) return;
    await joinGame('You');
    await refreshPlayers();
  };

  const handleLeave = async () => {
    await leaveGame('You');
    await refreshPlayers();
  };

  return { players, handleJoin, handleLeave };
}
