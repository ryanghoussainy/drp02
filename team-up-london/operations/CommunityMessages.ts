import CommunityMessage from "../interfaces/CommunityMessage";
import { supabase } from "../lib/supabase";

// Get all messages for a community
export async function getCommunityMessages(communityId: string): Promise<CommunityMessage[]> {
    const { data, error } = await supabase
        .from('community_messages')
        .select(`
            *,
            sender:players(id, name)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching community messages:', error);
        return [];
    }

    return data as CommunityMessage[];
}

// Send a message to a community
export async function sendCommunityMessage(senderId: string, communityId: string, content: string): Promise<CommunityMessage | null> {
    const { data, error } = await supabase
        .from('community_messages')
        .insert([
            {
                sender_id: senderId,
                community_id: communityId,
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
        console.error('Error sending community message:', error);
        return null;
    }

    // Get sender name
    const { data: senderData, error: senderError } = await supabase
        .from("players")
        .select("name")
        .eq("id", senderId)
        .single();
    
    if (senderError) {
        console.error("Failed to fetch sender name:", senderError);
        return null;
    }

    // Get all players in the community to notify them
    const { data: communityMembers, error: membersError } = await supabase
        .from('community_players')
        .select('player_id')
        .eq('community_id', communityId);

    if (membersError) {
        console.error("Failed to fetch community members:", membersError);
        return null;
    }

    // Insert into notifications table to notify the receiver
    const { error: notificationError } = await supabase
        .from("notifications")
        .insert(
            communityMembers.map(member => ({
                player_id: member.player_id,
                title:  `New message from ${senderData.name}`,
                body: content.trim().length > 50 ? content.trim().substring(0, 50) + "..." : content.trim(),
            }))
        );

    if (notificationError) {
        console.error("Failed to create notification:", notificationError);
    }

    return data as CommunityMessage;
}

// Mark community messages as read for a specific user
export async function markCommunityMessagesAsRead(communityId: string, playerId: string): Promise<void> {
    // This could be implemented with a separate table to track read status per user
    // For now, we'll skip this functionality as it would require additional database schema
    return;
}

// Subscribe to real-time community message updates
export function subscribeToCommunityMessages(communityId: string, onNewMessage: (message: CommunityMessage) => void) {
    const subscription = supabase
        .channel(`community_messages:${communityId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'community_messages',
            },
            async (payload) => {
                // Fetch the complete message with sender info
                const { data } = await supabase
                    .from('community_messages')
                    .select(`
                        *,
                        sender:players(id, name)
                    `)
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    onNewMessage(data as CommunityMessage);
                }
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}