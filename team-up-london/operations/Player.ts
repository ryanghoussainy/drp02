import { db } from "../lib/supabase";
import { Alert } from "react-native";
import Player from "../interfaces/Player";

// Get a player by ID
export async function getPlayer(playerId: string): Promise<Player> {
    const { data, error } = await db
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Player;
}
