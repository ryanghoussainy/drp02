export default interface Game {
    id: string;
    name: string;
    host_id: string;
    start_time: string;
    end_time: string;
    location: string;
    notes_from_host: string;
    max_players: number;
    min_players: number;
    sport_id: string;
    cost: number;
    location_type: string;
    community_id?: string; // Optional, for community games
}
