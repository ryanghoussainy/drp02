import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCommunity from "../hooks/useCommunity";
import Fonts from "../config/Fonts";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import usePlayer from "../hooks/usePlayer";
import useSport from "../hooks/useSport";
import CustomIcon from "../components/CustomIcon";
import { ICON_FAMILIES } from "../constants/iconFamilies";
import useCommunityGames from "../hooks/useCommunityGames";
import GameCard from "../components/GameCard";
import useCommunityPlayers from "../hooks/useCommunityPlayers";
import { YOU_PLAYER_ID } from "../constants/youPlayerId";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import { RootStackParamList } from "../navigation/StackNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Community">;

export default function CommunityScreen({ route }: Props) {
    const { communityId } = route.params;

    const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>['navigation']>();

    const { community } = useCommunity(communityId);
    const { player: creator } = usePlayer(community?.creator_id || "");
    const { sport } = useSport(community?.sport_id || "");

    const { games } = useCommunityGames(communityId);
    const { players, handleJoin, handleLeave } = useCommunityPlayers(communityId);

    // Modal for confirmation when leaving
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Toggle whether member list is shown
    const [showMembers, setShowMembers] = useState(false);

    // Requested to join
    const [requestedToJoin, setRequestedToJoin] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Team Up London</Text>

            {/* Back button */}
            <MaterialIcons
                name="arrow-back"
                size={24}
                color="black"
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 30 }}
            />

            <View style={styles.sideBySide}>
                <Text style={styles.subTitle}>{community?.name}</Text>

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
            </View>

            {/* Expandable member list */}
            {showMembers && (
                <View style={styles.membersListContainer}>
                    {players.length > 0 ? (
                        players.map((item) => (
                            <View key={item.id} style={styles.memberRow}>
                                {/* Avatar with first letter of name */}
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                                </View>

                                {/* Host indicator */}
                                {item.id === creator?.id && (
                                    <MaterialCommunityIcons
                                        name="crown"
                                        size={26}
                                        color="gold"
                                    />
                                )}

                                <Text style={styles.memberName}>{item.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noMembersText}>
                            No members in this community yet.
                        </Text>
                    )}
                </View>
            )}

            {/* Community description */}
            <Text style={{ fontSize: 16, fontFamily: Fonts.main, marginVertical: 8 }}>
                {community?.description}
            </Text>

            <View style={styles.communityDetails}>
                <View style={[styles.detailBlock, { flex: 1.6 }]}>
                    <View style={[styles.sideBySide, { justifyContent: "flex-start" }]}>
                        <Text style={[styles.detailText, { marginRight: 4 }]}><Text style={styles.tagText}>Sport: </Text>{sport?.name}</Text>
                        <CustomIcon
                            name={sport?.icon || 'default-icon'}
                            family={sport?.icon_family as ICON_FAMILIES}
                            size={(sport?.icon_size || 20) * 0.8}
                            color="purple"
                        />
                    </View>

                    <Text style={styles.detailText}><Text style={styles.tagText}>Needs acceptance: </Text>{community?.is_public ? "No" : "Yes"}</Text>

                    <Text style={styles.detailText}><Text style={styles.tagText}>Creator: </Text>{creator?.name}</Text>
                </View>
                <View style={[styles.detailBlock, styles.rightAligned]}>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Primary Location: </Text>{community?.primary_location}</Text>
                    <Text style={styles.detailText}><Text style={styles.tagText}>Location Type: </Text>{community?.primary_location_type}</Text>
                </View>
            </View>

            {/* Games coming up */}
            <Text style={styles.subTitle}>Upcoming Games</Text>
            {games.map((game, idx) => (
                <GameCard key={idx} game={game} onPress={() => navigation.navigate("Game", { gameId: game.id })} />
            ))}

            {players.some(player => player.id === YOU_PLAYER_ID) ? (
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
                    style={[styles.button, { backgroundColor: requestedToJoin ? "#ccc" : "green" }]}
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
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'purple',
    },
    communityDetails: {
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
    tagText: {
        fontWeight: 'bold',
    },
    rightAligned: {
        alignItems: 'flex-end',
    },
    button: {
        borderRadius: 15,
        padding: 25,
        marginVertical: 5,
        marginBottom: 16,
        backgroundColor: "green",
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
})
