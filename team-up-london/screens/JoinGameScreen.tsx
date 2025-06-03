import { useState } from 'react';
import { Button, Icon, Text } from '@rneui/themed';
import { ScrollView, StyleSheet, View } from 'react-native';
import Fonts from '../config/Fonts';
import { Player } from '../operations/Games';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SKILL_MAPPING } from '../constants/skills';
import useDistanceAndRegion from '../hooks/useDistanceAndRegion';
import PlayerCard from '../components/PlayerCard';
import GameMap from '../components/GameMap';
import useGamePlayers from '../hooks/useGamePlayers';
import ConfirmationModal from '../components/ConfirmationModal';

export default function JoinGameScreen() {
    const { distance, mapRegion } = useDistanceAndRegion();

    const { players, handleJoin, handleLeave } = useGamePlayers();

    // Modal for confirmation when leaving
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    
    // Calculate average skill level by rounding to nearest whole number
    const averageSkillLevel = (players: Player[]) => {
        if (players.length === 0) return 0;
        const total = players.reduce((sum, player) => sum + player.skill_level, 0);
        return SKILL_MAPPING[Math.round(total / players.length)];
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

        <GameMap mapRegion={mapRegion} distance={distance} />

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
                        {players.map((player, idx) => (
                            <PlayerCard key={idx} player={player} highlightYou={player.name === 'You'} />
                        ))}
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

        {players.some(player => player.name === 'You') ? (
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
                        onPress={() => setShowLeaveModal(true)}
                    />
                </View>
            </View>
        ) : (
            <Button
                title="Join"
                onPress={handleJoin}
                color="green"
                titleStyle={{ fontSize: 24, fontWeight: 'bold' }}
                buttonStyle={styles.button}/>
        )}

        {/* Confirmation modal for leaving */}
        <ConfirmationModal
            visible={showLeaveModal}
            title="Leave Game"
            message="Are you sure you want to leave the game?"
            confirmText="Leave"
            cancelText="Cancel"
            onCancel={() => setShowLeaveModal(false)}
            onConfirm={() => {
                handleLeave();
                setShowLeaveModal(false);
            }}
        />

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
    requiredPlayersSection: {
        fontSize: 14,
        color: '#888',
        marginTop: 12,
        fontWeight: 'bold',
        textAlign: 'center',
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
});
