import { db } from "../lib/supabase";
import { Alert } from "react-native";
import Time from "../interfaces/Time";

// Get all times
export async function getTimes(): Promise<Time[]> {
    const { data, error } = await db
        .from("times")
        .select("*");

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return data as Time[];
}
