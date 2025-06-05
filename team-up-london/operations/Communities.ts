import Community from "../interfaces/Community";
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
