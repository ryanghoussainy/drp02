import { useState, useEffect } from 'react';
import Sport from '../interfaces/Sport';
import { getPlayerPreferences } from '../operations/Player';
import { YOU_PLAYER_ID } from '../constants/youPlayerId';


export default function usePreferences(sports: Sport[]) {
    const [preferredTimes, setPreferredTimes] = useState<string[]>([]);
    const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});

    const fetchPreferences = async () => {
        const { preferred_times, preferred_sports_ids, preferred_sports_skill_levels } = await getPlayerPreferences(YOU_PLAYER_ID);
        setPreferredTimes(preferred_times || []);
        setSelectedSports(sports.filter(s => preferred_sports_ids?.includes(s.id)));

        // create a map of all the preferred sports and their corresponding skill levels
        const skillLevelMap: { [key: string]: number } = {};
        preferred_sports_ids?.forEach((id: string, index: number) => {
            if (preferred_sports_skill_levels && preferred_sports_skill_levels[index]) {
                skillLevelMap[id] = preferred_sports_skill_levels[index];
            }
        });

        setSkillLevels(skillLevelMap);
    }

    // Get community data when screen is focused
    useEffect(() => {
        if (sports.length === 0) return; // wait for sports to load

        fetchPreferences();
    }, [sports]);


    return { preferredTimes, selectedSports, skillLevels,
        setPreferredTimes, setSelectedSports, setSkillLevels
     };
}
