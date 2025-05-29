import { useEffect, useState } from 'react';
import { Button, Icon, Text } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getPlayers, joinGame, leaveGame } from '../operations/Games';
import Fonts from '../config/Fonts';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Player } from '../operations/Games';
import { useRef } from 'react';

const gameLocation = {
    latitude: 51.506249,
    longitude: -0.176205,
};

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

    // Distance of the player to the game location
    const [distance, setDistance] = useState<{ km: number, miles: number } | null>(null);

    useEffect(() => {
        if (location) {
            const toRad = (val: number) => val * Math.PI / 180;

            const lat1 = location.latitude;
            const lon1 = location.longitude;
            const lat2 = 51.506249;
            const lon2 = -0.176205;

            const R = 6371; // km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const km = R * c;
            const miles = km * 0.621371;

            setDistance({ km, miles });
        }
    }, [location]);


    // State for players. For now a list of string names.
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Refresh players
    const refreshPlayers = async () => {
            const fetchedPlayers = await getPlayers();
            // Host should be first in the list, I should be second if joined
            setPlayers(fetchedPlayers.sort((a, b) => {
                // Host should be first
                if (a.host && !b.host) return -1;
                if (!a.host && b.host) return 1;
                // "You" should be second (after host)
                if (a.name === "You" && b.name !== "You") return -1;
                if (a.name !== "You" && b.name === "You") return 1;
                return 0;
            }));
        };

    useEffect(() => {
        refreshPlayers();
    }, [])

    // Player pressed join button
    const handleJoin = async () => {
        // Check if already joined
        if (players.some(player => player.name === 'You')) {
            return;
        }

        // Join the game
        await joinGame("You");

        await refreshPlayers();
    };

    // User pressed leave button
    const handleLeave = async () => {
        // Leave the game
        await leaveGame("You");

        await refreshPlayers();
    };

    // Render the join button
    const renderJoinButton = () => {
        return (
            <Button
                title="Join!"
                onPress={handleJoin}
                color="green"
                titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                buttonStyle={styles.button}/>
        );
    }

    // Render the leave button
    const renderLeaveButton = () => {
        return (
            <Button
                title="Leave"
                onPress={handleLeave}
                color="red"
                titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                buttonStyle={styles.button}/>
        );
    }

    // Render the list of players
    const renderPlayerList = () => {
        return players.map((player, index) => (
            <View
                key={index}
                style={[
                    styles.playerCard,
                    player.name === "You" ? { borderWidth: 2, borderColor: 'green'} : { borderWidth: 2, borderColor: '#eee' }
                ]}
            >
                <Icon
                    name="person"
                    type="material"
                    size={24}
                    color="black"
                />
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerRole}>{player.host ? <Text style={styles.hostRole}>Host</Text> : "Player"}</Text>
                <Text>Age: {player.age}</Text>
                <Text>{player.gender ? "Male" : "Female"}</Text>
                <Text><Text style={{ color: "purple", fontSize: 16 }}>★</Text>{player.skill_level}</Text>
            </View>
        ));
    };

    const markerRef = useRef<any>(null);

    useEffect(() => {
        // Show the callout when the map is rendered
        if (markerRef.current) {
            setTimeout(() => {
                markerRef.current.showCallout();
            }, 500); // Delay helps on some devices
        }
    }, [markerRef.current]);

    return (
    <View style={styles.container}>
        <Text style={styles.title}>TeamUp LDN</Text>
        <Text style={styles.gameTitle}>— Joe's Football Game</Text>

        <View style={styles.gameDetails}>
            <View style={[styles.detailBlock, { flex: 1.3 }]}>
                <Text style={[styles.detailText, styles.timeText]}>14:00 - 16:00</Text>
                <Text style={styles.detailText}>
                    <Text style={styles.tagText}>Average Skill:</Text> <Text style={styles.highlight}>★ {
                        players.length > 0
                            ? (players.reduce((sum, player) => sum + player.skill_level, 0) / players.length).toFixed(1)
                            : "-"
                    }</Text>
                </Text>
            </View>
            <View style={[styles.detailBlock, styles.rightAligned]}>
                <Text style={styles.detailText}><Text style={styles.tagText}>Location: </Text>Hyde Park</Text>
                <Text style={styles.detailText}><Text style={styles.tagText}>Location Type: </Text>Park</Text>
                <Text style={styles.detailText}><Text style={styles.tagText}>Cost: </Text>Free</Text>
            </View>
        </View>

        <View>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: gameLocation.latitude,
                    longitude: gameLocation.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
                showsUserLocation
                followsUserLocation
                shouldRasterizeIOS
                showsMyLocationButton
            >
                <Marker
                    ref={markerRef}
                    coordinate={gameLocation}
                    title="Game"
                    description="Hyde Park"
                />
            </MapView>
            {distance && (
                <Text style={styles.distanceText}>
                    <Text style={styles.tagText}>Distance to you: </Text>
                    {distance.km.toFixed(2)} km / {distance.miles.toFixed(2)} mi
                </Text>
            )}
        </View>


        <View style={styles.sideBySide}>
            <View style={styles.playerSection}>
                <Text style={styles.sectionTitle}>
                    Players ({players.length}/10, min 6)
                </Text>
                <View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.playerList}
                    >
                        {renderPlayerList()}
                    </ScrollView>

                    <Text style={styles.scrollHint}>Scroll for more players</Text>
                </View>
            </View>

            <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Notes from Host</Text>
                <View style={styles.notesBox}>
                    <Text>Everyone bring boots please!</Text>
                </View>
            </View>
        </View>

      {players.some(player => player.name === 'You') ? renderLeaveButton() : renderJoinButton()}
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
        fontWeight: 'bold',
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
    timeText: {
        fontSize: 18,
    },
    tagText: {
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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
    playerName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    playerRole: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
        fontStyle: 'italic',
    },
    hostRole: {
        fontWeight: 'bold',
    },
    rightAligned: {
        alignItems: 'flex-end',
    },
    notesBox: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        height: 100,
        borderWidth: 0.1
    },
    button: {
        borderRadius: 6,
        padding: 25,
        marginVertical: 18,
    },
    scrollHint: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    distanceText: {
        position: 'absolute',
        right: -1,
        bottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: 229,
        height: 20,
        margin: 1,
        borderRadius: 8,

        // add small shadow
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
});
