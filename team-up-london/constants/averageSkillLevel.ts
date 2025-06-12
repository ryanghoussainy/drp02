import Player from "../interfaces/Player";
import { SKILL_MAPPING } from "./skills";

// Calculate average skill level by rounding to nearest whole number
export const AVERAGE_SKILL_LEVEL = (players: Player[], sportId: string) => {
    if (players.length === 0) return "";
    const total = players.reduce((sum, player) => {
        const index = player.preferred_sports_ids.indexOf(sportId);
        return sum + (index !== -1 ? player.preferred_sports_skill_levels[index] : 1);
    }, 0);
    return SKILL_MAPPING[Math.round(total / players.length)];
};
