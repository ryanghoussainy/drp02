import { useEffect, useState } from 'react';
import { Button, Icon, Text } from '@rneui/themed';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getPlayers, joinGame, leaveGame } from '../operations/Games';
import Fonts from '../config/Fonts';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Player } from '../operations/Games';
import { useRef } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const gameLocation = {
    latitude: 51.506249,
    longitude: -0.176205,
};

// Skill levels mapping
const skillMapping: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};

export default function JoinGameScreen() {
    // Location
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
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

            const midLatitude = (location.latitude + gameLocation.latitude) / 2;
            const midLongitude = (location.longitude + gameLocation.longitude) / 2;

            const latitudeDelta = Math.abs(location.latitude - gameLocation.latitude) * 2 || 0.05;
            const longitudeDelta = Math.abs(location.longitude - gameLocation.longitude) * 2 || 0.05;

            setMapRegion({
                latitude: midLatitude,
                longitude: midLongitude,
                latitudeDelta,
                longitudeDelta,
            });
        }
    }, [location]);

    // Satellite mode state
    const [satelliteMode, setSatelliteMode] = useState(false);

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
                    title="Join"
                    onPress={handleJoin}
                    color="green"
                    titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                    buttonStyle={styles.button}/>
        );
    }

    // Modal for confirmation when leaving
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Handle leave icon press
    const handleLeaveIconPress = () => {
        // Show confirmation modal
        setShowLeaveModal(true);
    };

    // Confirmation modal for leaving
    const leaveConfirmationModal = () => {
        return (
            <Modal
                transparent={true}
                visible={showLeaveModal}
                onRequestClose={() => setShowLeaveModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Leave Game</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to leave the game?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Cancel" onPress={() => setShowLeaveModal(false)} />
                            <Button color="red" title="Leave" onPress={() => {
                                handleLeave();
                                setShowLeaveModal(false);
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Render the leave button
    const renderLeaveButton = () => {
        return (
            <View style={styles.sideBySide}>
                <Button
                    containerStyle={{ flex: 1 }}
                    title="Joined"
                    disabled
                    titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                    buttonStyle={styles.button}/>

                {/* exit icon */}
                <View style={styles.leaveIconContainer}>
                    <MaterialCommunityIcons
                        name="exit-run"
                        size={30}
                        color="black"
                        onPress={handleLeaveIconPress}
                    />
                </View>
            </View>
        );
    }

    // Render the list of players
    const renderPlayerList = () => {
        return players.map((player, index) => {
            const skill = skillMapping[player.skill_level] || "";
            return (

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
                <View style={styles.skillContainer}>
                    <Text style={styles.skillText}>{skill}</Text>
                </View>
            </View>
            )
        });
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

    // Calculate average skill level by rounding to nearest whole number
    const averageSkillLevel = (players: Player[]) => {
        if (players.length === 0) return 0;
        const total = players.reduce((sum, player) => sum + player.skill_level, 0);
        return skillMapping[Math.round(total / players.length)];
    };

    return (
    <View style={styles.container}>
        <Text style={styles.title}>Team Up London</Text>
        <View style={styles.sideBySide}>
            <Text style={styles.gameTitle}>— Joe's Football Game </Text>

            <Icon
                name="soccer-ball-o"
                type="font-awesome"
                size={30}
                color="black"
            />
        </View>

        <View style={styles.gameDetails}>
            <View style={[styles.detailBlock, { flex: 1.3 }]}>
                <Text style={[styles.detailText, styles.timeText]}>14:00 - 16:00</Text>
                <Text style={styles.detailText}><Text style={styles.tagText}>Date: </Text>Today</Text>
                <Text style={styles.detailText}>
                    <Text style={styles.tagText}>Average Skill:</Text> <Text style={styles.highlight}>
                        {averageSkillLevel(players)}
                    </Text>
                </Text>
            </View>
            <View style={[styles.detailBlock, styles.rightAligned]}>
                <Text style={styles.detailText}><Text style={styles.tagText}>Location: </Text>Hyde Park</Text>
                <Text style={styles.detailText}><Text style={styles.tagText}>Location Type: </Text>Park</Text>
                <Text style={styles.detailText}><Text style={styles.tagText}>Cost: </Text>Free</Text>
            </View>
        </View>

        <View style={{ flex: 1 }}>
            {mapRegion && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation
                    followsUserLocation
                    shouldRasterizeIOS
                    showsMyLocationButton
                    mapType={satelliteMode ? 'hybrid' : 'standard'}
                >
                    <Marker
                        ref={markerRef}
                        coordinate={gameLocation}
                        title="Game"
                        description="Hyde Park"
                    />
                </MapView>
            )}

            {/* Show distance */}
            {distance && (
                <Text style={styles.distanceText}>
                    <Text style={styles.tagText}>Distance to you: </Text>
                    {distance.km.toFixed(2)} km / {distance.miles.toFixed(2)} mi
                </Text>
            )}

            {/* Satellite toggle button */}
            <TouchableOpacity style={styles.toggleMap} onPress={() => setSatelliteMode(!satelliteMode)}>
                <Icon 
                    name={satelliteMode ? 'map' : 'satellite'}
                    type="material"
                    size={25}
                    color="black"
                />
            </TouchableOpacity>
        </View>

        <View style={styles.sideBySide}>
            <View style={styles.playerSection}>
                <Text style={styles.sectionTitle}>
                    Players ({players.length}/10)
                </Text>
                <View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={[styles.playerList, { paddingHorizontal: 16 }]}
                        showsHorizontalScrollIndicator={true}
                        snapToInterval={98}      // card width + horizontal margin
                        decelerationRate="fast"
                    >
                        {renderPlayerList()}
                    </ScrollView>

                    <Text style={styles.scrollHint}>Swipe for more players</Text>
                </View>
            </View>

            <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Notes from Host</Text>
                <View style={styles.notesBox}>
                    <Text>Everyone bring boots please!</Text>
                </View>
            </View>
        </View>

        <Text style={styles.requiredPlayersSection}>{6 - players.length} more players required to start</Text>

        {players.some(player => player.name === 'You') ? renderLeaveButton() : renderJoinButton()}

        {/* Confirmation modal for leaving */}
        {showLeaveModal && leaveConfirmationModal()}
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
        fontWeight: 'regular',
    },
    map: {
        flex: 1,
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        paddingVertical: 8,
        alignItems: "center",
    },
    playerCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 4,
        alignItems: 'center',
        marginHorizontal: 4,
        width: 90,
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
        borderRadius: 15,
        padding: 12,
        height: 100,
        borderWidth: 0.1
    },
    button: {
        borderRadius: 15,
        padding: 25,
        marginVertical: 5,
        marginBottom: 16,
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
    requiredPlayersSection: {
        fontSize: 14,
        color: '#888',
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    toggleMap: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    skillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    skillText: {
        color: 'purple',
        fontSize: 14,
        marginLeft: 4,
    },
    leaveIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        marginBottom: 16,
        marginTop: 5,
        borderRadius: 10,
        padding: 5,
        marginRight: 2,
        backgroundColor: "red",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
