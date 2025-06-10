import { useState, useEffect, useCallback } from 'react';
import { getGame, getPlayersInGame, joinGame, leaveGame } from '../operations/Games';
import Player from '../interfaces/Player';
import { useFocusEffect } from '@react-navigation/native';

export default function useGamePlayers(playerId: string, gameId: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);

  const refreshPlayers = async () => {
    const fetchedPlayers = await getPlayersInGame(gameId);
    const game = await getGame(gameId);
    const hostId = game.host_id;

    setHostId(hostId);

    // Sort: host first, 'You' second
    const sorted = fetchedPlayers.sort((a, b) => {
      if (a.id === hostId && b.id !== hostId) return -1;
      if (a.id !== hostId && b.id === hostId) return 1;
      if (a.id === playerId && b.id !== playerId) return -1;
      if (a.id !== playerId && b.id === playerId) return 1;
      return 0;
    });
    setPlayers(sorted);
  };

  // useEffect(() => {
  //   refreshPlayers();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      refreshPlayers();
    }, [players])
  )

  const handleJoin = async () => {
    if (players.some((p) => p.id === playerId)) return;
    await joinGame(playerId, gameId);
    await refreshPlayers();
  };

  const handleLeave = async () => {
    await leaveGame(playerId, gameId);
    await refreshPlayers();
  };

  return { players, handleJoin, handleLeave, hostId };
}
