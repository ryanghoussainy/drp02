import Player from "../interfaces/Player";
import { SKILL_MAPPING } from "./skills";

// Calculate average skill level by rounding to nearest whole number
export const AVERAGE_SKILL_LEVEL = (players: Player[]) => {
    if (players.length === 0) return 0;
    const total = players.reduce((sum, player) => sum + player.skill_level, 0);
    return SKILL_MAPPING[Math.round(total / players.length)];
};
