export default interface Player {
    id: string;
    name: string;
    age: number;
    gender: boolean;
    skill_level: number;
    preferred_times?: string[]; // Optional, can be used to store preferred times for games
}
