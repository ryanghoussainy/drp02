import { useState, useEffect } from 'react';
import { getGame, getPlayersInGame, joinGame, leaveGame } from '../operations/Games';
import { YOU_PLAYER_ID } from '../constants/youPlayerId';
import Player from '../interfaces/Player';

export default function useGamePlayers(game_id: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);

  const refreshPlayers = async () => {
    const fetchedPlayers = await getPlayersInGame(game_id);
    const game = await getGame(game_id);
    const hostId = game.host_id;

    setHostId(hostId);

    // Sort: host first, 'You' second
    const sorted = fetchedPlayers.sort((a, b) => {
      if (a.id === hostId && b.id !== hostId) return -1;
      if (a.id !== hostId && b.id === hostId) return 1;
      if (a.id === YOU_PLAYER_ID && b.id !== YOU_PLAYER_ID) return -1;
      if (a.id !== YOU_PLAYER_ID && b.id === YOU_PLAYER_ID) return 1;
      return 0;
    });
    setPlayers(sorted);
  };

  useEffect(() => {
    refreshPlayers();
  }, []);

  const handleJoin = async () => {
    if (players.some((p) => p.id === YOU_PLAYER_ID)) return;
    await joinGame(YOU_PLAYER_ID, game_id);
    await refreshPlayers();
  };

  const handleLeave = async () => {
    await leaveGame(YOU_PLAYER_ID, game_id);
    await refreshPlayers();
  };

  return { players, handleJoin, handleLeave, hostId };
}
