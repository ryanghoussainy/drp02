import { db } from "../lib/supabase";
import { Alert } from "react-native";


// User joins a game
export async function joinGame(playerName: string) {
    const { error } = await db
        .from("game")
        .insert([{ name: playerName }]);

    if (error) {
        Alert.alert(error.message);
    }
}

// User leaves a game
export async function leaveGame(playerName: string) {
    const { error } = await db
        .from("game")
        .delete()
        .eq("name", playerName);

    if (error) {
        Alert.alert(error.message);
    }
}

// Get players in the game
export async function getPlayers(): Promise<string[]> {
    const { data, error } = await db
        .from("game")
        .select("name");

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return data.map((player) => player.name);
}
