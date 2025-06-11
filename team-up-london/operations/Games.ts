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

    return players as Player[];
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

    return games as Game[];
}

// Create game
export async function createGame(
    name: string,
    start_time: Date,
    end_time: Date,
    location: string,
    location_type: string,
    notes_from_host: string,
    max_players: number,
    min_players: number,
    sport_id: string,
    cost: number,
    host_id: string,
    latitude: number,
    longitude: number,
    community_id?: string | null,
): Promise<Game> {
    const { data, error } = await db
        .from("games")
        .insert([{
            name,
            start_time,
            end_time,
            location,
            location_type,
            notes_from_host,
            max_players,
            min_players,
            sport_id,
            cost,
            host_id,
            latitude,
            longitude,
            community_id,
        }])
        .select("*")
        .single();

    if (error) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }

    return data as Game;
}
