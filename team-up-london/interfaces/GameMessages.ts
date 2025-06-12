export default interface GameMessage {
    id: string;
    game_id: string;
    sender_id: string;
    content: string;
    created_at: Date;
    read_at: Date | null;
}
