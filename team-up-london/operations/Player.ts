import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import Player from "../interfaces/Player";

// Get a player by ID
export async function getPlayer(playerId: string): Promise<Player> {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Player;
}

// Register preferences
export async function registerPreferences(
    playerId: string,
    preferredTimes: string[],
    preferredSportsIds: string[],
    preferredSportsSkillLevels: number[],
) {
    const { error } = await supabase
        .from("players")
        .update({
            preferred_times: preferredTimes,
            preferred_sports_ids: preferredSportsIds,
            preferred_sports_skill_levels: preferredSportsSkillLevels,
        })
        .eq("id", playerId);

    if (error) {
        Alert.alert(error.message);
    }
}

// Get player preferences
export async function getPlayerPreferences(playerId: string): Promise<{
    preferred_times: string[];
    preferred_sports_ids: string[];
    preferred_sports_skill_levels: number[];
}> {
    const { data, error } = await supabase
        .from("players")
        .select("preferred_times, preferred_sports_ids, preferred_sports_skill_levels")
        .eq("id", playerId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return {
        preferred_times: data?.preferred_times || [],
        preferred_sports_ids: data?.preferred_sports_ids || [],
        preferred_sports_skill_levels: data?.preferred_sports_skill_levels || [],
    };
}

// Get player by name
export async function getPlayerByName(name: string): Promise<Player> {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("name", name)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Player;
}

// Set personal goal
export async function setPersonalGoal(
    playerId: string,
    targetGames: number,
    targetTimeframe: string,
): Promise<void> {
    const { error } = await supabase
        .from("players")
        .update({
            target_games: targetGames,
            target_timeframe: targetTimeframe,
        })
        .eq("id", playerId);

    if (error) {
        Alert.alert(error.message);
    }
}

// Get player communities
export async function getPlayerCommunities(playerId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from("community_players")
        .select("community_id")
        .eq("player_id", playerId);

    if (error) {
        Alert.alert(error.message);
    }

    return data ? data.map(item => item.community_id) : [];
}
