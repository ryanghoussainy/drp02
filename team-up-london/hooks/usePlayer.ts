import { useState, useEffect } from 'react';
import Player from '../interfaces/Player';
import { getPlayer } from '../operations/Player';

export default function usePlayer(playerId: string) {
    const [player, setPlayer] = useState<Player | null>(null);

    const refreshPlayer = async () => {
        const fetchedPlayer = await getPlayer(playerId);
        setPlayer(fetchedPlayer);
    };

    useEffect(() => {
        if (playerId) {
            refreshPlayer();
        }
    }, [playerId]);

    return { player } as { player: Player };
}
