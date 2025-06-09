import Community from "../interfaces/Community";
import Game from "../interfaces/Game";
import Player from "../interfaces/Player";
import { db } from "../lib/supabase";
import { Alert } from "react-native";

// Get all communities
export async function getCommunities(): Promise<Community[]> {
    const { data, error } = await db
        .from("communities")
        .select("*");

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return data;
}

// Get a community by ID
export async function getCommunity(communityId: string): Promise<Community> {
    const { data, error } = await db
        .from("communities")
        .select("*")
        .eq("id", communityId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Community;
}

// Get players in a community
export async function getPlayersInCommunity(communityId: string): Promise<Player[]> {
    // 1. Get the player IDs in that community
    const { data: playerIds, error: playerIdsError } = await db
        .from("community_players")
        .select("player_id")
        .eq("community_id", communityId);

    if (playerIdsError) {
        Alert.alert(playerIdsError.message);
        return [];
    }

    // 2. Get the player details for those IDs
    const { data: players, error: playersError } = await db
        .from("players")
        .select("*")
        .in("id", playerIds.map(p => p.player_id));

    if (playersError) {
        Alert.alert(playersError.message);
        return [];
    }

    return players as Player[];
}

// Get games in a community
export async function getGamesInCommunity(communityId: string): Promise<Game[]> {
    const { data, error } = await db
        .from("games")
        .select("*")
        .eq("community_id", communityId);

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return data as Game[];
}

// Join a community
export async function joinCommunity(playerId: string, communityId: string) {
    const { error } = await db
        .from("community_players")
        .upsert({
            player_id: playerId,
            community_id: communityId,
        });
    if (error) {
        Alert.alert(error.message);
    }
}

// Leave a community
export async function leaveCommunity(playerId: string, communityId: string) {
    const { error } = await db
        .from("community_players")
        .delete()
        .eq("player_id", playerId)
        .eq("community_id", communityId);

    if (error) {
        Alert.alert(error.message);
    }
}

// Get a game community
export async function getGameCommunity(gameId: string) {
    const { data: community_id, error: gameError } = await db
        .from("games")
        .select("community_id")
        .eq("id", gameId)
        .single();

    if (gameError) {
        Alert.alert(gameError.message);
    }

    const { data: community, error: communityError } = await db
        .from("communities")
        .select("*")
        .eq("id", community_id?.community_id)
        .single();
    
    if (communityError) {
        Alert.alert(communityError.message);
    }

    return community;
}

// Create a community
export async function createCommunity(
    name: string,
    description: string,
    primary_location: string,
    primary_location_type: 'Sports Venue' | 'Park',
    is_public: boolean,
    sports_ids: string[],
    creator_id: string,
): Promise<Community | null> {
    const { data, error } = await db
        .from("communities")
        .insert({
            name,
            description,
            primary_location,
            primary_location_type,
            is_public,
            sports_ids,
            creator_id,
        })
        .select("*")
        .single();

    if (error) {
        Alert.alert(error.message);
        return null;
    }

    return data as Community;
}
