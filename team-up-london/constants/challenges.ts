import Challenge from "../interfaces/Challenge";

// Dummy challenges data
export const availableChallenges: Challenge[] = [
    {
        id: '1',
        title: 'April Challenge',
        description: '10 games in April',
        targetGames: 10,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        currentProgress: 2
    },
    {
        id: '2',
        title: 'Volleyball Master',
        description: '5 games of volleyball in April',
        targetGames: 5,
        sport: 'Volleyball',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        currentProgress: 1
    },
    {
        id: '3',
        title: 'Tennis Champion',
        description: '8 games of tennis in May',
        targetGames: 8,
        sport: 'Tennis',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-31'),
        currentProgress: 0
    },
    {
        id: '4',
        title: 'Summer Sprint',
        description: '15 games in June',
        targetGames: 15,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        currentProgress: 0
    }
];