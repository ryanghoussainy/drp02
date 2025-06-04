import Sport from "../interfaces/Sport";
import { db } from "../lib/supabase";
import { Alert } from "react-native";

// Get all sports
export async function getSports(): Promise<Sport[]> {
    const { data, error } = await db
        .from("sports")
        .select("*");

    if (error) {
        Alert.alert(error.message);
        return [];
    }

    return data;
}

// Get a sport by ID
export async function getSport(sportId: string): Promise<Sport> {
    const { data, error } = await db
        .from("sports")
        .select("*")
        .eq("id", sportId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Sport;
}
