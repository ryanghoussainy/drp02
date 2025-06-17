import React, { useState, useRef } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Player from "../interfaces/Player";
import { RootStackParamList } from "../navigation/StackNavigator";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import BackArrow from "../components/BackArrow";
import Fonts from "../config/Fonts";
import Colours from "../config/Colours";
import { Feather } from '@expo/vector-icons';
import useMessages from "../hooks/useMessages";
import MessageBubble from "../components/MessageBubble";
import { sendMessage } from "../operations/Messages";
import Logo from '../components/Logo';

type Props = NativeStackScreenProps<RootStackParamList, "PlayerChat">;

export default function PlayerChatScreen({ player, route }: { player: Player } & Props) {
    const { player: otherPlayer } = route.params;
    const { messages, loading } = useMessages(player.id, otherPlayer.id);

    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const handleSend = async () => {
        if (!inputText.trim() || sending) return;

        setSending(true);
        const message = await sendMessage(player.id, otherPlayer.id, inputText.trim());

        if (message) {
            setInputText('');
            // Scroll to bottom after sending
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }

        setSending(false);
    };

    const renderMessage = ({ item, index }: { item: any; index: number }) => (
        <MessageBubble
            key={item.id}
            message={item}
            isOwn={item.sender_id === player.id}
        />
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colours.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Logo />

            <View style={styles.otherPlayerContainer}>
                <BackArrow style={{ zIndex: 1 }}/>
                <Text style={styles.otherPlayerName}>{otherPlayer.name}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || sending}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Feather name="send" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 16,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    otherPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    otherPlayerName: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    messagesList: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    messagesContent: {
        paddingVertical: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colours.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
