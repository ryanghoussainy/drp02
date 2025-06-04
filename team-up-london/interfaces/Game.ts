export default interface Game {
    id: string;
    name: string;
    host_id: string;
    start_time: string;
    end_time: string;
    location: string;
    location_type: string;
    sport_id: string;
    notes_from_host: string;
    max_players: number;
    min_players: number;
    cost: number;
}
