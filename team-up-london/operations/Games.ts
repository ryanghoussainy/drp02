import Game from "../interfaces/Game";
import Player from "../interfaces/Player";
import { db } from "../lib/supabase";
import { Alert } from "react-native";

// Get a game by ID
export async function getGame(gameId: string): Promise<Game> {
    const { data, error } = await db
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Game;
}

// User joins a game
export async function joinGame(playerId: string, gameId: string) {
    const { error } = await db
        .from("game_players")
        .upsert([{
            player_id: playerId,
            game_id: gameId,
        }]);

    if (error) {
        Alert.alert(error.message);
    }
}

// User leaves a game
export async function leaveGame(playerId: string, gameId: string) {
    const { error } = await db
        .from("game_players")
        .delete()
        .eq("player_id", playerId)
        .eq("game_id", gameId);

    if (error) {
        Alert.alert(error.message);
    }
}

// Get players in the game
export async function getPlayersInGame(game_id: string): Promise<Player[]> {
    // 1. get the player ids in that game
    const { data: playerIds, error: playerIdsError } = await db
        .from("game_players")
        .select("player_id")
        .eq("game_id", game_id);

    if (playerIdsError) {
        Alert.alert(playerIdsError.message);
        return [];
    }

    // 2. get the players
    const { data: players, error: playersError } = await db
        .from("players")
        .select("*")
        .in("id", playerIds.map(player => player.player_id));

    if (playersError) {
        Alert.alert(playersError.message);
        return [];
    }

    return players.map((player: any) => ({
        id: player.id,
        name: player.name,
        age: player.age,
        gender: player.gender,
        skill_level: player.skill_level,
    }));
}

// For you games
export async function getForYouGames(playerId: string): Promise<Game[]> {
    const { data: games, error } = await db
        .from("games")
        .select("*")

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return games.map((game: any) => ({
        id: game.id,
        name: game.name,
        host_id: game.host_id,
        start_time: game.start_time,
        end_time: game.end_time,
        location: game.location,
        location_type: game.location_type,
        sport_id: game.sport_id,
        notes_from_host: game.notes_from_host,
        max_players: game.max_players,
        min_players: game.min_players,
        cost: game.cost,
    }));
}
