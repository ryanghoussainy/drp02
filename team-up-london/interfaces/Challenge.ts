export default interface Challenge {
    id: string;
    title: string;
    description: string;
    targetGames: number;
    sport?: string;
    startDate: Date;
    endDate: Date;
    currentProgress: number;
}
