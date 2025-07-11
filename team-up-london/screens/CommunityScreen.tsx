import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCommunity from "../hooks/useCommunity";
import Fonts from "../config/Fonts";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import SportIcon from "../components/SportIcon";
import { ICON_FAMILIES } from "../constants/iconFamilies";
import useCommunityGames from "../hooks/useCommunityGames";
import GameCard from "../components/GameCard";
import useCommunityPlayers from "../hooks/useCommunityPlayers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { RootStackParamList } from "../navigation/StackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import useSports from "../hooks/useSports";
import Colours from "../config/Colours";
import BackArrow from "../components/BackArrow";
import Player from "../interfaces/Player";
import usePlayer from "../hooks/usePlayer";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useDistancesAndRegions from "../hooks/useDistancesAndRegions";
import { AVERAGE_SKILL_LEVEL } from "../constants/averageSkillLevel";

type Props = NativeStackScreenProps<RootStackParamList, "Community">;

export default function CommunityScreen({ player, route }: { player: Player } & Props) {
    const { communityId } = route.params;

    const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();

    const { community } = useCommunity(communityId);
    const { player: creator } = usePlayer(community?.creator_id || "");
    const { sports: allSports } = useSports();
    const sports = allSports.filter(s => community?.sports_ids.includes(s.id));

    const { games } = useCommunityGames(communityId);
    const { players, handleJoin, handleLeave } = useCommunityPlayers(player.id, communityId);

    const { distances, mapRegions } = useDistancesAndRegions(games);

    // Modal for confirmation when leaving
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Toggle whether member list is shown
    const [showMembers, setShowMembers] = useState(false);

    // Requested to join
    const [requestedToJoin, setRequestedToJoin] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={[styles.sideBySide, { marginTop: 10 }]}>
                {/* Back button */}
                <BackArrow
                    style={{ top: 20 }}
                />
                <Text style={styles.title}>{community?.name}</Text>
            </View>

            {/* Community description */}
            <Text style={{ fontSize: 16, fontFamily: Fonts.main, marginVertical: 8 }}>
                {community?.description}
            </Text>

            <View style={styles.sideBySide}>

                <TouchableOpacity
                    onPress={() => setShowMembers(prev => !prev)}
                    style={styles.membersButton}
                >
                    <Text style={styles.membersButtonText}>
                        {showMembers ? "Hide Members" : "View Members"}
                    </Text>
                    <SimpleLineIcons
                        name={showMembers ? "arrow-up" : "arrow-down"}
                        size={20}
                        color="black"
                    />
                </TouchableOpacity>

                {/* Community Message button */}
                {players.some(p => p.id === player.id) && community && <TouchableOpacity
                    onPress={() => navigation.navigate("CommunityChat", { communityId: community.id })}
                    style={styles.membersButton}
                >
                    <Text style={styles.membersButtonText}>Community Chat</Text>
                    <MaterialIcons name="message" size={20} color="black" />
                </TouchableOpacity>}
            </View>

            {/* Expandable member list */}
            {showMembers && (
                <View style={styles.membersListContainer}>
                    {players.length > 0 ? (
                        players.map((p) => (
                            <View key={p.id} style={styles.memberRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* Avatar with first letter of name */}
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{p.name.charAt(0)}</Text>
                                    </View>

                                    {/* Host indicator */}
                                    {p.id === creator?.id && (
                                        <MaterialCommunityIcons
                                            name="crown"
                                            size={24}
                                            color="gold"
                                        />
                                    )}

                                    <Text style={styles.memberName}>{p.name}</Text>
                                </View>

                                {/* Message button */}
                                {p.id !== player.id && <TouchableOpacity style={styles.messageButton} onPress={() => navigation.navigate("PlayerChat", { player: p })}>
                                    <MaterialIcons name="message" size={24} color="black" />
                                </TouchableOpacity>}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noMembersText}>
                            No members in this community yet.
                        </Text>
                    )}
                </View>
            )}

            <View style={styles.communityDetails}>
                <View style={[styles.detailBlock, { flex: 1.6 }]}>
                    <View style={[styles.sideBySide, { justifyContent: "flex-start" }]}>
                        <Text style={[styles.detailText, { marginRight: 4 }]}><Text style={styles.tagText}>Sports: </Text></Text>
                        {sports.slice(0,3).map(sport => (
                            <SportIcon
                                key={sport.id}
                                name={sport?.icon || 'default-icon'}
                                family={sport?.icon_family as ICON_FAMILIES}
                                size={(sport?.icon_size || 20) * 0.8}
                                color={Colours.primary}
                            />
                        ))}
                        {sports.length > 3 && (
                            <Text style={{ marginLeft: 4, fontSize: 16, color: Colours.primary }}>...</Text>
                        )}
                    </View>

                    <Text style={styles.detailText}><Text style={styles.tagText}>Needs acceptance: </Text>{community?.is_public ? "No" : "Yes"}</Text>

                    <Text style={styles.detailText}><Text style={styles.tagText}>Creator: </Text>{creator?.name}</Text>
                </View>
                <View style={[styles.detailBlock, styles.leftAligned]}>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Primary Location: </Text>{community?.primary_location}</Text>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Location Type: </Text>{community?.primary_location_type}</Text>
                </View>
            </View>

            {/* Games coming up */}
            <View style={styles.sideBySide}>
                <Text style={styles.subTitle}>Upcoming Games</Text>

                {/* Plus button to create game */}
                {players.some(p => p.id === player.id) && community && <TouchableOpacity
                    onPress={() => navigation.navigate("CreateGame", { communityId: community?.id })}
                    style={styles.createGameButton}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>}
            </View>

            {games.map((game, idx) => {
                const avgSkillLevel = AVERAGE_SKILL_LEVEL(players, game.sport_id); // THIS players is wrong. It's the community players, not the game players

                return <GameCard
                    key={idx}
                    player={player}
                    game={game}
                    onPress={() => navigation.navigate("Game", { game, distance: distances[idx], mapRegion: mapRegions[idx] })}
                    distance={distances[idx]}
                    isCommunityMember={false}
                    numPlayers={players.length}
                    averageSkillLevel={avgSkillLevel}
                />
            })}

            {players.some(p => p.id === player.id) ? (
                <View style={styles.sideBySide}>
                    <TouchableOpacity
                        disabled
                        style={[styles.button, { backgroundColor: "#ccc", flex: 1 }]}
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
                    onPress={community?.is_public ? handleJoin : () => setRequestedToJoin(true)}
                    disabled={requestedToJoin}
                    style={[styles.button, { backgroundColor: requestedToJoin ? "#ccc" : Colours.secondary }]}
                >
                    <Text style={styles.buttonText}>{community?.is_public ? "Join" : (requestedToJoin ? "Requested to Join" : "Request to Join")}</Text>
                </TouchableOpacity>
            )}

            {/* Confirmation modal for leaving */}
            <ConfirmationModal
                visible={showLeaveModal}
                title="Leave Community"
                message="Are you sure you want to leave the community?"
                confirmText="Leave"
                cancelText="Cancel"
                onCancel={() => setShowLeaveModal(false)}
                onConfirm={() => {
                    handleLeave();
                    setShowLeaveModal(false);
                }}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        textAlign: 'center',
        marginVertical: 12,
        marginTop: 20,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 8,
        width: "60%",
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    membersButton: {
        backgroundColor: Colours.extraButtons,
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colours.primary,
        marginBottom: 8,
    },
    communityDetails: {
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
    tagText: {
        fontWeight: 'bold',
    },
    rightAligned: {
        alignItems: 'flex-end',
    },
    leftAligned: {
        alignItems: 'flex-start',
    },
    button: {
        borderRadius: 15,
        padding: 25,
        marginVertical: 5,
        marginBottom: 16,
        backgroundColor: Colours.secondary,
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
    membersButtonText: {
        fontSize: 16,
        marginRight: 4,
        fontFamily: Fonts.main,
    },
    membersListContainer: {
        marginTop: 8,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        backgroundColor: '#bbb',
        marginRight: 4,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 4,
        borderRadius: 50,
    },
    memberName: {
        fontSize: 16,
        marginLeft: 4,
        fontFamily: Fonts.main,
    },
    noMembersText: {
        textAlign: 'center',
        color: '#666',
        fontFamily: Fonts.main,
    },
    buttonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    createGameButton: {
        backgroundColor: Colours.primary,
        borderRadius: 16,
        height: 34,
        width: 50,
        alignItems: 'center',
    },
    messageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colours.extraButtons,
        padding: 6,
        borderRadius: 8,
    },
})
