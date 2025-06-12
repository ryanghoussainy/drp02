export default interface Player {
    id: string;
    name: string;
    age: number;
    gender: boolean;
    preferred_times?: string[]; // Optional, can be used to store preferred times for games
    preferred_sports_ids: string[];
    preferred_sports_skill_levels: number[];
    target_games?: number;
    target_timeframe?: string; // week or month
}
