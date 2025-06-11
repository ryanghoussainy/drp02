export default interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: Date;
    read_at: Date | null;
}
