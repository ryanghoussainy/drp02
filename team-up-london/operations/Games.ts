import { db } from "../lib/supabase";
import { Alert } from "react-native";

// Define the Player interface
export interface Player {
    name: string;
    host: boolean;
    age: number;
    gender: boolean;
    skill_level: number;
}


// User joins a game
export async function joinGame(playerName: string) {
    const { error } = await db
        .from("game")
        .upsert([{
            name: playerName,
            host: false,
            age: 23,
            gender: true, // male
            skill_level: 2,
            id: "ce40f00b-3c74-41b0-8759-10de4f4c8ab9",
        }]);

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
export async function getPlayers(): Promise<Player[]> {
    const { data, error } = await db
        .from("game")
        .select("*");

    if (error || !data) {
        Alert.alert(error ? error.message : "Unknown error");
        return [];
    }

    return data.map((player: any) => ({
        name: player.name,
        host: player.host,
        age: player.age,
        gender: player.gender,
        skill_level: player.skill_level,
    }));
}
