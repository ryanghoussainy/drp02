import { useEffect, useState } from 'react';
import { Button, Icon, Text } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getPlayers, joinGame, leaveGame } from '../operations/Games';
import Fonts from '../config/Fonts';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
                buttonStyle={styles.joinButton}/>
        );
    }

    // Render the leave button
    const renderLeaveButton = () => {
        return (
            <Button
                title="Leave"
                onPress={handleLeave}
                color="red"
                buttonStyle={styles.leaveButton}/>
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
        <Text style={styles.title}>TeamUp LDN</Text>
        <Text style={styles.gameTitle}>- Joe's Football Game</Text>

        <View style={styles.gameDetails}>
            <View style={styles.detailBlock}>
            <Text style={styles.detailText}>14:00 - 16:00</Text>
            <Text style={styles.detailText}>Open Play</Text>
            <Text style={styles.detailText}>
                Average Skill: <Text style={styles.highlight}>★ 4.3</Text>
            </Text>
            </View>
            <View style={styles.detailBlock}>
            <Text style={styles.detailText}>Hyde Park</Text>
            <Text style={styles.detailText}>Free to Play</Text>
            </View>
        </View>

        {/* <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
            latitude: 51.506249,
            longitude: -0.176205,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
            }}
            showsUserLocation
            followsUserLocation
        >
            <Marker
            coordinate={{ latitude: 51.506249, longitude: -0.176205 }}
            title="Game"
            description="Hyde Park"
            />
        </MapView> */}

        <View style={styles.sideBySide}>
            <View style={styles.playerSection}>
                <Text style={styles.sectionTitle}>
                    Players ({players.length}/10, min 6)
                </Text>
                <View style={styles.sideBySide}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.playerList}
                        
                    >
                        {renderPlayerList()}
                    </ScrollView>

                    <View style={styles.scrollHint}>
                        <Icon
                            name="arrow-forward"
                            type="material"
                            size={24}
                            color="black"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Notes from Host</Text>
                <View style={styles.notesBox}>
                    <Text>Everyone bring boots please!</Text>
                </View>
            </View>
        </View>

      {players.includes('You') ? renderLeaveButton() : renderJoinButton()}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        textAlign: 'center',
        marginVertical: 12,
    },
    gameTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: Fonts.main,
        marginBottom: 16,
    },
    gameDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 2,
    },
    detailBlock: {
        flex: 1,
    },
    detailText: {
        fontSize: 14,
        marginBottom: 4,
    },
    highlight: {
        color: 'purple',
        fontSize: 16,
        fontWeight: 'bold',
    },
    map: {
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    playerSection: {
        flex: 1.5,
    },
    notesSection: {
        flex: 1,
        marginLeft: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    playerList: {
        paddingVertical: 4,
    },
    playerCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        marginRight: 8,
        minWidth: 80,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    playerIcon: {
        marginBottom: 4,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    playerMeta: {
        fontSize: 12,
        color: '#555',
    },
    notesBox: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        height: 100,
        borderWidth: 0.1
    },
    joinButton: {
        backgroundColor: 'green',
        borderRadius: 6,
        padding: 12,
        marginHorizontal: 40,
    },
    leaveButton: {
        backgroundColor: 'red',
        borderRadius: 6,
        padding: 12,
        marginHorizontal: 40,
    },
    scrollHint: {
        justifyContent: 'center',
    },
});
