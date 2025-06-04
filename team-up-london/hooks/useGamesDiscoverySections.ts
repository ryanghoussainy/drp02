import { useState, useEffect } from 'react';
import { getForYouGames } from '../operations/Games';
import { YOU_PLAYER_ID } from '../constants/youPlayerId';
import Game from '../interfaces/Game';

export default function useGamesDiscoverySections() {
    // For you section
    const [forYouSectionOpen, setForYouSectionOpen] = useState<boolean>(true);
    const [forYouGames, setForYouGames] = useState<Game[]>([]);

    // Near you section
    const [nearYouSectionOpen, setNearYouSectionOpen] = useState<boolean>(true);
    const [nearYouGames, setNearYouGames] = useState<Game[]>([]);

    // Try something new section
    const [trySomethingNewSectionOpen, setTrySomethingNewSectionOpen] = useState<boolean>(true);
    const [trySomethingNewGames, setTrySomethingNewGames] = useState<Game[]>([]);

    // Fetch games for each section (mocked for now)
    useEffect(() => {
        const fetchForYouGames = async () => {
            const forYouGames = await getForYouGames(YOU_PLAYER_ID);
            setForYouGames(forYouGames);
        };
        // const fetchNearYouGames = async () => {
        //     const nearYouGames = await getNearYouGames();
        //     setNearYouGames(nearYouGames);
        // };
        // const fetchTrySomethingNewGames = async () => {
        //     const trySomethingNewGames = await getTrySomethingNewGames();
        //     setTrySomethingNewGames(trySomethingNewGames);
        // };
        fetchForYouGames();
        // fetchNearYouGames();
        // fetchTrySomethingNewGames();
    }, []);

    return {
        forYouSectionOpen,
        setForYouSectionOpen,
        forYouGames,

        nearYouSectionOpen,
        setNearYouSectionOpen,
        nearYouGames,

        trySomethingNewSectionOpen,
        setTrySomethingNewSectionOpen,
        trySomethingNewGames,
    };
}
