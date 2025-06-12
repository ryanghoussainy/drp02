import GameMessage from "../interfaces/GameMessages";
import { supabase } from "../lib/supabase";

// Get all messages for a game
export async function getGameMessages(gameId: string): Promise<GameMessage[]> {
    const { data, error } = await supabase
        .from('game_messages')
        .select(`
            *,
            sender:players(id, name)
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching game messages:', error);
        return [];
    }

    return data as GameMessage[];
}

// Send a message to a game
export async function sendgameMessage(senderId: string, gameId: string, content: string): Promise<GameMessage | null> {
    const { data, error } = await supabase
        .from('game_messages')
        .insert([
            {
                sender_id: senderId,
                game_id: gameId,
                content: content,
                created_at: new Date().toISOString()
            }
        ])
        .select(`
            *,
            sender:players(id, name)
        `)
        .single();

    if (error) {
        console.error('Error sending game message:', error);
        return null;
    }

    return data as GameMessage;
}

// Mark game messages as read for a specific user
export async function markgameMessagesAsRead(gameId: string, playerId: string): Promise<void> {
    // This could be implemented with a separate table to track read status per user
    // For now, we'll skip this functionality as it would require additional database schema
    return;
}

// Subscribe to real-time game message updates
export function subscribeTogameMessages(gameId: string, onNewMessage: (message: GameMessage) => void) {
    const subscription = supabase
        .channel(`game_messages:${gameId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'game_messages',
            },
            async (payload) => {
                // Fetch the complete message with sender info
                const { data } = await supabase
                    .from('game_messages')
                    .select(`
                        *,
                        sender:players(id, name)
                    `)
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    onNewMessage(data as GameMessage);
                }
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}