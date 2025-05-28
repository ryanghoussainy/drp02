import { PostgrestClient } from "@supabase/postgrest-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "react-native-dotenv";

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY;

export const db = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
  fetch,  // Use native fetch API
});
