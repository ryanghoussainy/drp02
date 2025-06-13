import { useState, useCallback } from 'react';
import { getGames, getPlayersInGame } from '../operations/Games';
import Game from '../interfaces/Game';
import { useFocusEffect } from '@react-navigation/native';
import Player from '../interfaces/Player';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import { getPlayersInCommunity } from '../operations/Communities';
import usePlayer from './usePlayer';
import { getPlayer } from '../operations/Player';

export default function useGamesDiscoverySections(playerId: string) {
    // For you section
    const [forYouSectionOpen, setForYouSectionOpen] = useState<boolean>(true);
    const [forYouGames, setForYouGames] = useState<Game[]>([]);

    // Near you section
    const [nearYouSectionOpen, setNearYouSectionOpen] = useState<boolean>(true);
    const [nearYouGames, setNearYouGames] = useState<Game[]>([]);

    // Try something new section
    const [trySomethingNewSectionOpen, setTrySomethingNewSectionOpen] = useState<boolean>(true);
    const [trySomethingNewGames, setTrySomethingNewGames] = useState<Game[]>([]);

    // Fetch games for each section
    useFocusEffect(
        useCallback(() => {
            const fetchGames = async () => {
                const player = await getPlayer(playerId);

                const games = await getGames();
                /**
                 * For you section:
                 * Filter by (player level at that sport == game average level)
                 * Add all games created in communities the player is a member of
                 */
                // Create a Map to store community players for quick lookup
                const communityPlayersMap = new Map<string, Player[]>();
                const gamePlayersMap = new Map<string, Player[]>();

                // Batch fetch all unique community and game data
                const uniqueCommunityIds = [...new Set(games.filter(g => g.community_id).map(g => g.community_id).filter(id => id !== undefined))] as string[];
                const gameIds = games.map(g => g.id);

                // Pre-populate maps with batch fetches
                await Promise.all([
                    ...uniqueCommunityIds.map(async (communityId) => {
                        const players = await getPlayersInCommunity(communityId);
                        communityPlayersMap.set(communityId, players);
                    }),
                    ...gameIds.map(async (gameId) => {
                        const players = await getPlayersInGame(gameId);
                        gamePlayersMap.set(gameId, players);
                    })
                ]);

                // Create a Set for O(1) duplicate checking
                const forYouGameIds = new Set<string>();
                const forYouGamesArray: Game[] = [];

                // Pre-calculate player skill levels for each sport to avoid repeated calculations
                const playerSkillLevels = new Map<string, string>();

                games.forEach(game => {
                    // Get or calculate player skill level for this sport
                    let playerSkillLevel = playerSkillLevels.get(game.sport_id);
                    if (!playerSkillLevel) {
                        playerSkillLevel = AVERAGE_SKILL_LEVEL([player], game.sport_id);
                        playerSkillLevels.set(game.sport_id, playerSkillLevel);
                    }

                    const gamePlayers = gamePlayersMap.get(game.id) || [];
                    const avgLevel = AVERAGE_SKILL_LEVEL(gamePlayers, game.sport_id);
                    
                    if (playerSkillLevel === avgLevel && !forYouGameIds.has(game.id) && player.preferred_sports_ids.includes(game.sport_id)) {
                        forYouGameIds.add(game.id);
                        forYouGamesArray.push(game);
                    }
                });

                // Filter games by community membership
                games.forEach(game => {
                    if (game.community_id && !forYouGameIds.has(game.id)) {
                        const communityPlayers = communityPlayersMap.get(game.community_id) || [];
                        if (communityPlayers.some(p => p.id === player.id)) {
                            forYouGameIds.add(game.id);
                            forYouGamesArray.push(game);
                        }
                    }
                });

                setForYouGames(forYouGamesArray);

                /**
                 * Near you section:
                 * Will be sorted by distance from the player later. Just fetch all games.
                 */
                setNearYouGames(games);

                /**
                 * Try something new section:
                 * Filter by ((player level at that sport == "Beginner" or not selected) && average level of players in game == "Beginner" or "Intermediate")
                 */

                const trySomethingNewGamesArray: Game[] = [];
                games.forEach(game => {
                    const gamePlayerSkillLevel = playerSkillLevels.get(game.sport_id) || AVERAGE_SKILL_LEVEL([player], game.sport_id);
                    const averageSkillLevel = AVERAGE_SKILL_LEVEL(gamePlayersMap.get(game.id) || [], game.sport_id);
                    if ((gamePlayerSkillLevel === 'Beginner') && (averageSkillLevel === 'Beginner' || averageSkillLevel === 'Intermediate')) {
                        trySomethingNewGamesArray.push(game);
                    }
                });

                setTrySomethingNewGames(trySomethingNewGamesArray);
            };

            fetchGames();
        }, [])
    );

    return {
        forYouSectionOpen,
        setForYouSectionOpen,
        forYouGames,

        nearYouSectionOpen,
        setNearYouSectionOpen,
        nearYouGames,

        trySomethingNewSectionOpen,
        setTrySomethingNewSectionOpen,
        trySomethingNewGames,
    };
}
