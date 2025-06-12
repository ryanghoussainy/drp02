import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CommunityMessage from '../interfaces/CommunityMessage';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';
import { formatDistanceToNow } from 'date-fns';
import usePlayer from '../hooks/usePlayer';

interface MessageBubbleProps {
    message: CommunityMessage;
    isOwn: boolean;
}

export default function CommunityMessageBubble({ message, isOwn }: MessageBubbleProps) {
    const { player: senderName } = usePlayer(message.sender_id);
    
    return (
        <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
            <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                {/* Show sender name for community messages when not own message */}
                {!isOwn && (
                    <Text style={styles.senderName}>{senderName?.name}</Text>
                )}
                <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
                    {message.content}
                </Text>
                <Text style={[styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    ownMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 18,
    },
    ownBubble: {
        backgroundColor: Colours.primary,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 4,
    },
    senderName: {
        fontSize: 12,
        fontFamily: Fonts.main,
        fontWeight: 'bold',
        color: Colours.primary,
        marginBottom: 4,
    },
    messageText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        lineHeight: 20,
    },
    ownMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        fontFamily: Fonts.main,
        marginTop: 4,
    },
    ownTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimestamp: {
        color: '#666',
    },
});