import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PlayerCard from '../components/PlayerCard';
import GameMap from '../components/GameMap';
import useGamePlayers from '../hooks/useGamePlayers';
import ConfirmationModal from '../components/ConfirmationModal';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import SportIcon from '../components/SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { formatDate } from 'date-fns';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';
import useGameCommunity from '../hooks/useGameCommunity';
import Colours from '../config/Colours';
import BackArrow from '../components/BackArrow';
import Player from '../interfaces/Player';
import { MaterialIcons } from '@expo/vector-icons';
import useSport from '../hooks/useSport';
import useDistanceAndRegion from '../hooks/useDistanceAndRegion';
import Logo from '../components/Logo';

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export default function JoinGameScreen({ player, route }: { player: Player } & Props) {
    const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();

    const { game, distance, mapRegion } = route.params;

    // This is only if we just created a game and need to manually get distance and region
    const { distance: newDistance, mapRegion: newMapRegion } = useDistanceAndRegion(game.id);

    const { players, handleJoin, handleLeave, hostId } = useGamePlayers(player.id, game.id);

    const { sport } = useSport(game.sport_id);

    const { community } = useGameCommunity(game.id);

    // Modal for confirmation when leaving
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    return (
        <View style={styles.container}>
            <Logo />

            {/* Back button */}
            <BackArrow
                style={{ position: 'absolute', top: 45, left: 10 }}
            />

            <View style={styles.sideBySide}>
                <Text style={styles.gameTitle}>— {game?.name} </Text>

                <SportIcon
                    name={sport?.icon || 'default-icon'}
                    family={sport?.icon_family as ICON_FAMILIES}
                    size={(sport?.icon_size || 20) * 1.5}
                    color= {Colours.primary}
                />
            </View>

            {community && <Text style={styles.subTitle} onPress={() => navigation.navigate("Community", { communityId: community.id })}>Community: <Text style={{ color: Colours.secondary, textDecorationLine: "underline" }}>{community?.name}</Text></Text>}

            <View style={styles.gameDetails}>
                <View style={[styles.detailBlock, { flex: 1.5 }]}>
                    {game && <Text style={[styles.detailText, styles.timeText]}>{formatDate(new Date(game.start_time), "PP'\n'p")} — {formatDate(new Date(game.end_time), "p")}</Text>}
                    <Text style={styles.detailText}>
                        <Text style={styles.tagText}>Average Skill:</Text> <Text style={styles.highlight}>
                            {AVERAGE_SKILL_LEVEL(players, game?.sport_id || '')}
                        </Text>
                    </Text>
                </View>
                <View style={[styles.detailBlock, styles.leftAligned]}>
                    <Text style={styles.detailText}><Text style={styles.tagText} numberOfLines={2}>Location: </Text>{game?.location}</Text>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Location Type: </Text>{game?.location_type}</Text>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Cost: </Text>{game?.cost === 0 ? 'Free' : `£${game?.cost}`}</Text>
                </View>
            </View>

            <GameMap mapRegion={mapRegion || newMapRegion} distance={distance || newDistance} gameId={game.id} location={game?.location || ""} />

            <View style={styles.sideBySide}>
                <View style={styles.playerSection}>
                    <Text style={styles.sectionTitle}>
                        Players ({players.length}/{game?.max_players})
                    </Text>
                    <View>
                        <ScrollView
                            horizontal
                            contentContainerStyle={[styles.playerList, { paddingHorizontal: 16 }]}
                            showsHorizontalScrollIndicator={true}
                            snapToInterval={98}      // card width + horizontal margin
                            decelerationRate="fast"
                        >
                            {players.map((p, idx) => (
                                <PlayerCard
                                    key={idx}
                                    player={player}
                                    cardPlayer={p}
                                    isHost={p.id === hostId}
                                    sportId={game?.sport_id || ''}
                                    onPress={() => navigation.navigate('OtherPlayerProfile', { player: p })}
                                />
                            ))}
                        </ScrollView>

                        <Text style={styles.scrollHint}>Swipe for more players</Text>
                    </View>
                </View>

                <View style={styles.notesSection}>
                    <Text style={styles.sectionTitle}>Notes from Host</Text>
                    <View style={styles.notesBox}>
                        <Text>{game?.notes_from_host}</Text>
                    </View>

                    {/* Game chat */}
                    {players.some(p => p.id === player.id) && <View>
                        <Text style={styles.sectionTitle}>Any questions?</Text>
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => navigation.navigate('GameChat', { gameId: game.id })}
                        >
                            <Text style={styles.chatButtonText}>Game Chat </Text>
                            <MaterialIcons name="message" size={20} color="black" />
                        </TouchableOpacity>
                    </View>}
                </View>
            </View>

            <Text style={styles.requiredPlayersSection}>{Math.max(0, (game?.min_players || 0) - players.length)} more players required to start</Text>

            {players.some(p => p.id === player.id) ? (
                <View style={styles.sideBySide}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#ccc", flex: 1 }]}
                        disabled
                    >
                        <Text style={styles.buttonText}>Joined</Text>
                    </TouchableOpacity>

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
                <TouchableOpacity
                    style={[styles.button,
                    game?.max_players && players.length >= game.max_players ? { backgroundColor: "grey" } : { backgroundColor: Colours.success }]}
                    onPress={handleJoin}
                    disabled={(game?.max_players && players.length >= game.max_players) || false}
                >
                    <Text style={styles.buttonText}>{game?.max_players && players.length >= game.max_players ? 'Full' : 'Join'}</Text>
                </TouchableOpacity>
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
    gameTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 16,
        color: Colours.primary,
    },
    gameDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colours.accentBackground,
        padding: 12,
        marginBottom: 20,
        borderLeftWidth: 2,
        borderLeftColor: Colours.primary,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
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
        color: Colours.primary,
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
    leftAligned: {
        alignItems: 'flex-start',
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
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
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
    subTitle: {
        fontFamily: Fonts.main,
        marginBottom: 5,
        marginTop: -10,
        marginLeft: 25,
        fontWeight: 'bold',
    },
    chatButton: {
        backgroundColor: Colours.extraButtons,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colours.primary,
        marginBottom: 8,
        flexDirection: 'row',
    },
    chatButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
    },
});
