import { useEffect, useState } from 'react';
import { Button, Text } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { getPlayers, joinGame, leaveGame } from '../operations/Games';

export default function JoinGameScreen() {
    // State for players. For now a list of string names.
    const [players, setPlayers] = useState<string[]>([]);
    
    // Refresh players
    const refreshPlayers = async () => {
            const fetchedPlayers = await getPlayers();
            setPlayers(fetchedPlayers);
        };

    useEffect(() => {
        refreshPlayers();
    }, [])

    // Player pressed join button
    const handleJoin = () => {
        // Join the game
        joinGame("You");
        refreshPlayers();
    };

    // User pressed leave button
    const handleLeave = () => {
        // Leave the game
        leaveGame("You");
        refreshPlayers();
    };

    // Render the join button
    const renderJoinButton = () => {
        return (
            <Button
                title="Join Game"
                onPress={handleJoin}
                color="green"
                style={styles.joinButton}/>
        );
    }

    // Render the leave button
    const renderLeaveButton = () => {
        return (
            <Button
                title="Leave Game"
                onPress={handleLeave}
                color="red"
                style={styles.leaveButton}/>
        );
    }

    // Render the list of players
    const renderPlayerList = () => {
        return players.map((player, index) => (
            <Text key={index} style={styles.playerName}>
                {player}
            </Text>
        ));
    };

    return (
        <View style={styles.container}>
            {renderPlayerList()}
            {players.includes("You") ? renderLeaveButton() : renderJoinButton()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinButton: {
        borderRadius: 5,
        padding: 10,
        margin: 10,
    },
    leaveButton: {
        borderRadius: 5,
        padding: 10,
        margin: 10,
    },
    playerName: {
        fontSize: 18,
        marginVertical: 5,
    },
});
