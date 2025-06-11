import Sport from "../interfaces/Sport";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

// Get a sport by id
export async function getSportById(sportId: string): Promise<Sport> {
    const { data, error } = await supabase
        .from("sports")
        .select("*")
        .eq("id", sportId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Sport;
}

// Get all sports
export async function getSports(): Promise<Sport[]> {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
        .from("sports")
        .select("*")
        .eq("id", sportId)
        .single();

    if (error) {
        Alert.alert(error.message);
    }

    return data as Sport;
}
