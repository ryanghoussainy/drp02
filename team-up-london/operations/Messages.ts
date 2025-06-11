import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import Message from "../interfaces/Message";

// Send a message
export async function sendMessage(
    senderId: string,
    receivedId: string,
    content: string,
): Promise<Message | null> {
    const { data, error } = await supabase
        .from("messages")
        .insert({
            sender_id: senderId,
            receiver_id: receivedId,
            content: content,
        })
        .select("*")
        .single();

    if (error) {
        Alert.alert("Error", "Failed to send message");
        return null;
    }

    return data as Message;
}

// Get messages between two players
export async function getMessages(
    playerId: string,
    otherPlayerId: string,
): Promise<Message[]> {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${playerId},receiver_id.eq.${otherPlayerId}),and(sender_id.eq.${otherPlayerId},receiver_id.eq.${playerId})`)
        .order("created_at", { ascending: false })

    if (error) {
        Alert.alert("Error", "Failed to fetch messages");
        return [];
    }

    return (data as Message[]).reverse();
}

// Mark messages as read
export async function markMessagesAsRead(
    senderId: string,
    receiverId: string
): Promise<void> {
    const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", senderId)
        .eq("receiver_id", receiverId)
        .is("read_at", null);

    if (error) {
        console.error("Failed to mark messages as read:", error);
    }
}

// Real-time subscription for new messages
export function subscribeToMessages(
    playerId: string,
    onNewMessage: (message: Message) => void
) {    
    const subscription = supabase
        .channel(`messages-${playerId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `sender_id=eq.${playerId}`
            },
            (payload) => {
                onNewMessage(payload.new as Message);
            }
        )
        .subscribe();

    // Return the unsubscribe function
    return () => {
        subscription.unsubscribe();
    };
}
