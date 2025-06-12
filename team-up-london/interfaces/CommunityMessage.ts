export default interface CommunityMessage {
    id: string;
    community_id?: string; // optional for community messages
    sender_id: string;
    content: string;
    created_at: Date;
    read_at: Date | null;
}
