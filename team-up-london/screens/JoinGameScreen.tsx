import { useEffect, useState } from 'react';
import { Button, Icon, Text } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import { getPlayers, joinGame, leaveGame } from '../operations/Games';
import Fonts from '../config/Fonts';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function JoinGameScreen() {
    // Location
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    useEffect(() => {
        (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Permission to access location was denied.');
            return;
        }

            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);


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
                title="Join!"
                onPress={handleJoin}
                color="green"
                style={styles.joinButton}/>
        );
    }

    // Render the leave button
    const renderLeaveButton = () => {
        return (
            <Button
                title="Leave"
                onPress={handleLeave}
                color="red"
                style={styles.leaveButton}/>
        );
    }

    // Render the list of players
    const renderPlayerList = () => {
        return players.map((player, index) => (
            <View key={index} style={styles.playerCard}>
                <Icon
                    name="person"
                    type="material"
                    size={24}
                    color="black"
                />
                <Text style={styles.playerName}>{player}</Text>
                <Text>Age: 25</Text>
                <Text>Male</Text>
                <Text><Text style={{ color: "purple", fontSize: 16 }}>★</Text>4.3</Text>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* App name */}
            <Text style={styles.title}>TeamUp LDN</Text>
            
            {/* Game name */}
            <Text style={styles.header}>- Joe's Football Game</Text>

            {/* Game details */}
            <View style={styles.gameDetails}>
                <View>
                    <Text>14:00-16:00</Text>
                    <Text>Open Play</Text>
                    <Text>Average Skill Level: <Text style={{ color: "purple", fontSize: 16 }}>★</Text>4.3</Text>
                </View>

                <View>
                    <Text>Hyde Park</Text>
                    <Text>Free to Play</Text>
                </View>
            </View>

            {/* Map */}
            <MapView
                style={{ height: 200, marginBottom: 20 }}
                initialRegion={{
                    latitude: 51.506249205590926,
                    longitude: -0.17620473623021551,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
                showsUserLocation={true}
                followsUserLocation={true}>
                <Marker
                    coordinate={{ latitude: 51.506249205590926, longitude: -0.17620473623021551 }}
                    title="Game"
                    description="Hyde Park"
                />
            </MapView>

            <View style={styles.sideBySide}>
                {/* Player list */}
                <View>
                    <Text>Players in Game (3/10) min: 6</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {renderPlayerList()}
                    </View>
                </View>

                {/* Notes from host */}
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <Text>Notes from Host</Text>
                    <View style={styles.notesBox}>
                        <Text>Everyone bring boots please!</Text>
                    </View>
                </View>
            </View>

            {/* Join/Leave button */}
            {players.includes("You") ? renderLeaveButton() : renderJoinButton()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 30,
        fontFamily: Fonts.main,
        alignSelf: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: Fonts.main,
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
        fontSize: 14,
        marginVertical: 5,
    },
    gameDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderLeftWidth: 2,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    playerCard: {
        backgroundColor: '#f0f0f0',
        borderWidth: 3,
        margin: 1,
        borderRadius: 5,
        padding: 2,
        alignItems: 'center',
        width: 65,
    },
    notesBox: {
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 120,
        height: 100,
    },
});
