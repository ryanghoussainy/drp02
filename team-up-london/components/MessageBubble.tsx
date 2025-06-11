import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Message from '../interfaces/Message';
import Fonts from '../config/Fonts';
import Colours from '../config/Colours';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
            <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
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
    messageText: {
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    ownText: {
        color: 'white',
    },
    otherText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: Fonts.main,
    },
    ownTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    otherTimestamp: {
        color: '#666',
    },
});