import { useState, useEffect, useCallback, useRef } from 'react';
import { getGame, getPlayersInGame, joinGame, leaveGame } from '../operations/Games';
import Player from '../interfaces/Player';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase'; // Adjust path to your Supabase client

export default function useGamePlayers(playerId: string, gameId: string) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Your existing sorting logic extracted to a helper function
  const sortPlayers = (playersList: Player[], hostId: string | null) => {
    return playersList.sort((a, b) => {
      if (a.id === hostId && b.id !== hostId) return -1;
      if (a.id !== hostId && b.id === hostId) return 1;
      if (a.id === playerId && b.id !== playerId) return -1;
      if (a.id !== playerId && b.id === playerId) return 1;
      return 0;
    });
  };

  const refreshPlayers = async () => {
    try {
      const fetchedPlayers = await getPlayersInGame(gameId);
      const game = await getGame(gameId);
      const hostId = game.host_id;

      setHostId(hostId);

      // Apply your existing sorting logic
      const sorted = sortPlayers(fetchedPlayers, hostId);
      setPlayers(sorted);
    } catch (error) {
      console.error('Error refreshing players:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!gameId) return;

    // Clean up any existing subscription first
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Create a unique channel name to avoid conflicts
    const channelName = `game-players-${gameId}-${Date.now()}`;
    
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
        },
        async (payload) => {
          console.log('Real-time player update:', payload);
          
          try {
            // For any change, just refresh all players to keep it simple and reliable
            await refreshPlayers();
          } catch (error) {
            console.error('Error handling real-time update:', error);
          }
        }
      )
      .subscribe();

    subscriptionRef.current = subscription;

    // Cleanup subscription
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [gameId]);

  // Your existing useFocusEffect for when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshPlayers();
    }, [gameId])
  );

  const handleJoin = async () => {
    if (players.some((p) => p.id === playerId)) return;
    
    try {
      await joinGame(playerId, gameId);
      // Don't refresh manually - let the real-time subscription handle it
    } catch (error) {
      console.error('Error joining game:', error);
      // Only refresh on error as fallback
      await refreshPlayers();
    }
  };

  const handleLeave = async () => {
    try {
      await leaveGame(playerId, gameId);
      // Don't refresh manually - let the real-time subscription handle it
    } catch (error) {
      console.error('Error leaving game:', error);
      // Only refresh on error as fallback
      await refreshPlayers();
    }
  };

  return { players, handleJoin, handleLeave, hostId, refreshPlayers };
}
