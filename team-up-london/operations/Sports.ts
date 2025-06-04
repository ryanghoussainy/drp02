import { db } from "../lib/supabase";
import { Alert } from "react-native";

// Define the Sport type according to your database schema
export type Sport = {
    id: number;
    name: string;
    icon: string; // nameo of icon image
    icon_family: string; // e.g., "FontAwesome", "MaterialIcons"
    size: number; // size of the icon
};

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
