import { useState, useEffect } from 'react';
import { getPlayer } from '../operations/Player';
import { Alert } from 'react-native';

export default function usePersonalGoal(playerId: string) {
    const [goalGames, setGoalGames] = useState<number | null>(null);
    const [goalTimeframe, setGoalTimeframe] = useState<'week' | 'month'>('week');

    const fetchPersonalGoal = async () => {
        const fetchedPlayer = await getPlayer(playerId);
        setGoalGames(fetchedPlayer.target_games ?? null);
        if (!["week", "month"].includes(fetchedPlayer.target_timeframe ?? "")) {
            return;
        }
        setGoalTimeframe(fetchedPlayer.target_timeframe as 'week' | 'month');
    };

    useEffect(() => {
        if (playerId) {
            fetchPersonalGoal();
        }
    }, [playerId]);

    return { goalGames, goalTimeframe, setGoalGames, setGoalTimeframe };
}
