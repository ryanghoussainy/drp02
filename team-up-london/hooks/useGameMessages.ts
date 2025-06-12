import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import GameMessage from '../interfaces/GameMessages';
import { getGameMessages, markgameMessagesAsRead, subscribeTogameMessages } from '../operations/ChatMessages';

export default function useGameMessages(gameId: string, playerId: string) {
    const [messages, setMessages] = useState<GameMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const fetchedMessages = await getGameMessages(gameId);
            setMessages(fetchedMessages);
            
            // Mark messages as read
            await markgameMessagesAsRead(gameId, playerId);
        } catch (error) {
            console.error('Error loading game messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [gameId]);

    useFocusEffect(
        useCallback(() => {
            loadMessages();
            
            // Subscribe to real-time updates
            const unsubscribe = subscribeTogameMessages(gameId, (newMessage: GameMessage) => {
                setMessages(prev => [...prev, newMessage]);
            });

            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        }, [gameId])
    );

    return { messages, loading };
}