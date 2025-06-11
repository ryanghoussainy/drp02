import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMessages, markMessagesAsRead, subscribeToMessages } from '../operations/Messages';
import Message from '../interfaces/Message';

export default function useMessages(playerId: string, otherPlayerId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = useCallback(async () => {
        setLoading(true);
        const fetchedMessages = await getMessages(playerId, otherPlayerId);
        setMessages(fetchedMessages);
        setLoading(false);
        
        // Mark messages as read
        await markMessagesAsRead(otherPlayerId, playerId);
    }, [playerId, otherPlayerId]);

    useFocusEffect(
        useCallback(() => {
            loadMessages();
        }, [loadMessages])
    );

    useEffect(() => {
        // Set up real-time subscription
        const unsubscribe = subscribeToMessages(playerId, (newMessage) => {
            if (
                (newMessage.sender_id === otherPlayerId && newMessage.receiver_id === playerId) ||
                (newMessage.sender_id === playerId && newMessage.receiver_id === otherPlayerId)
            ) {
                setMessages((prev) => {
                    // Check if message already exists to avoid duplicates
                    const exists = prev.some(msg => msg.id === newMessage.id);
                    if (exists) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
                
                // Mark as read if it's from the other player
                if (newMessage.sender_id === otherPlayerId) {
                    markMessagesAsRead(otherPlayerId, playerId);
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [playerId, otherPlayerId]);

    return { messages, loading, refreshMessages: loadMessages };
}