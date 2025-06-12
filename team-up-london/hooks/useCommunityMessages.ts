import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCommunityMessages, markCommunityMessagesAsRead, subscribeToCommunityMessages } from "../operations/CommunityMessages";
import CommunityMessage from '../interfaces/CommunityMessage';

export default function useCommunityMessages(communityId: string, playerId: string) {
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const fetchedMessages = await getCommunityMessages(communityId);
            setMessages(fetchedMessages);
            
            // Mark messages as read
            await markCommunityMessagesAsRead(communityId, playerId);
        } catch (error) {
            console.error('Error loading community messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [communityId]);

    useFocusEffect(
        useCallback(() => {
            loadMessages();
            
            // Subscribe to real-time updates
            const unsubscribe = subscribeToCommunityMessages(communityId, (newMessage: CommunityMessage) => {
                setMessages(prev => [...prev, newMessage]);
            });

            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        }, [communityId])
    );

    return { messages, loading };
}