import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert, ScrollView, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import Fonts from "../config/Fonts";
import Colours from "../config/Colours";
import Player from "../interfaces/Player";
import Ionicons from '@expo/vector-icons/Ionicons';
import BackArrow from "../components/BackArrow";
import ProgressBar from "../components/ProgressBar";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Challenge from "../interfaces/Challenge";
import { availableChallenges } from "../constants/challenges";
import { setPersonalGoal } from "../operations/Player";
import usePersonalGoal from "../hooks/usePersonalGoal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/StackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type OtherNavProp = NativeStackNavigationProp<RootStackParamList, "OtherPlayerProfile">;

export default function ProfileScreen({ player, profilePlayer }: { player?: Player, profilePlayer: Player }) {
    const navigation = useNavigation<OtherNavProp>();

    const isOwn = !player;

    const [personalGoalModalVisible, setPersonalGoalModalVisible] = useState(false);
    const [challengesModalVisible, setChallengesModalVisible] = useState(false);
    const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);

    const { goalGames, goalTimeframe, setGoalGames, setGoalTimeframe } = usePersonalGoal(profilePlayer.id);

    const handleSetPersonalGoal = async () => {
        if (!goalGames || !goalTimeframe) {
            Alert.alert('Invalid Goal', 'Please set a valid goal before proceeding.');
            return;
        }

        if (isNaN(goalGames) || goalGames <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid number of games');
            return;
        }

        // Save goal to backend
        await setPersonalGoal(profilePlayer.id, goalGames, goalTimeframe);

        Alert.alert('Goal Set!', `Your goal of ${goalGames} games per ${goalTimeframe} has been set.`);
        setPersonalGoalModalVisible(false);
    };

    const handleSelectChallenge = (challenge: Challenge) => {
        const isSelected = selectedChallenges.some(c => c.id === challenge.id);
        if (isSelected) {
            setSelectedChallenges(selectedChallenges.filter(c => c.id !== challenge.id));
        } else {
            setSelectedChallenges([...selectedChallenges, challenge]);
        }
    };

    const handleJoinChallenges = () => {
        if (selectedChallenges.length === 0) {
            Alert.alert('No Challenges Selected', 'Please select at least one challenge to join.');
            return;
        }

        Alert.alert('Challenges Joined!', `You've joined ${selectedChallenges.length} challenge(s).`);
        setChallengesModalVisible(false);
        setSelectedChallenges([]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {!isOwn && <BackArrow style={styles.backArrow} />}
                <Text style={styles.title}>Team Up London</Text>
            </View>

            <Text style={styles.subTitle}>Profile</Text>

            <View style={styles.playerDetailsContainer}>
                {/* Player Icon */}
                <View style={styles.playerIconContainer}>
                    <Ionicons name="person" size={60} color="black" />
                </View>

                {/* Player Details */}
                <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>{profilePlayer.name}</Text>
                    <Text style={styles.playerAge}>Age: {profilePlayer.age}</Text>
                    <Text style={styles.playerGender}>Gender: {profilePlayer.gender ? "Male" : "Female"}</Text>
                </View>

                {/* Message button */}
                {!isOwn && <TouchableOpacity
                    style={styles.messageButton}
                    onPress={() => navigation.navigate('PlayerChat', { player: profilePlayer })}
                >
                    <MaterialCommunityIcons name="message-text" size={35} color={Colours.primary} />
                </TouchableOpacity>}
            </View>

            {/* Choose preferences button */}
            {isOwn && <TouchableOpacity
                style={{
                    backgroundColor: Colours.primary,
                    padding: 12,
                    borderRadius: 8,
                    margin: 16,
                    alignItems: 'center',
                }}
                onPress={() => navigation.navigate('Preferences')}
            >
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Choose Preferences</Text>
            </TouchableOpacity>}

            {/* Goals */}
            <View style={styles.section}>
                <Text style={styles.goalsTitle}>Goals</Text>

                {/* Personal Goals */}
                {goalGames ? <ProgressBar
                    label={`Personal Goal: ${goalGames} games per ${goalTimeframe}`}
                    current={1}
                    target={goalGames || 100}
                    color={Colours.primary}
                /> : <Text style={{ fontSize: 16, color: Colours.textSecondary }}>Set your personal goal below!</Text>}

                {/* Preset challenges */}
                <ProgressBar
                    label="April Challenge: 10 games in April"
                    current={2}
                    target={10}
                    color={Colours.primary}
                    isChallenge={true}
                />

                {/* Set your goals */}
                {isOwn && <View style={styles.setGoalsContainer}>
                    {/* Set your own goal button */}
                    <TouchableOpacity style={styles.goalButton} onPress={() => setPersonalGoalModalVisible(true)}>
                        <Text style={styles.goalButtonText}>Set Your Own Goal</Text>
                    </TouchableOpacity>

                    {/* Challenges button */}
                    <TouchableOpacity style={styles.goalButton} onPress={() => setChallengesModalVisible(true)}>
                        <Text style={styles.goalButtonText}>Challenges</Text>
                    </TouchableOpacity>
                </View>}
            </View>

            {/* Badges Section */}
            <View style={styles.section}>
                <Text style={styles.goalsTitle}>Badges</Text>
                <Text style={{ fontSize: 16, color: Colours.textSecondary }}>
                    <SimpleLineIcons name="badge" size={40} color={"red"} />
                </Text>
            </View>

            {/* Personal Goal Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={personalGoalModalVisible}
                onRequestClose={() => setPersonalGoalModalVisible(false)}
            >
                <KeyboardAvoidingView style={styles.modalOverlay} behavior="padding" enabled>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Set Personal Goal</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Number of games:</Text>
                            <TextInput
                                style={styles.textInput}
                                value={goalGames ? goalGames.toString() : ''}
                                onChangeText={text => setGoalGames(text ? parseInt(text) : null)}
                                placeholder="Enter number"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Timeframe:</Text>
                            <View style={styles.timeframeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.timeframeButton,
                                        goalTimeframe === 'week' && styles.timeframeButtonSelected
                                    ]}
                                    onPress={() => setGoalTimeframe('week')}
                                >
                                    <Text style={[
                                        styles.timeframeButtonText,
                                        goalTimeframe === 'week' && styles.timeframeButtonTextSelected
                                    ]}>Per Week</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.timeframeButton,
                                        goalTimeframe === 'month' && styles.timeframeButtonSelected
                                    ]}
                                    onPress={() => setGoalTimeframe('month')}
                                >
                                    <Text style={[
                                        styles.timeframeButtonText,
                                        goalTimeframe === 'month' && styles.timeframeButtonTextSelected
                                    ]}>Per Month</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setPersonalGoalModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleSetPersonalGoal}
                            >
                                <Text style={styles.confirmButtonText}>Set Goal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Challenges Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={challengesModalVisible}
                onRequestClose={() => setChallengesModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Available Challenges</Text>

                        <ScrollView style={styles.challengesList}>
                            {availableChallenges.map((challenge) => (
                                <TouchableOpacity
                                    key={challenge.id}
                                    style={[
                                        styles.challengeItem,
                                        selectedChallenges.some(c => c.id === challenge.id) && styles.challengeItemSelected
                                    ]}
                                    onPress={() => handleSelectChallenge(challenge)}
                                >
                                    <View style={styles.challengeInfo}>
                                        <Text style={styles.challengeTitle}>{challenge.title}</Text>
                                        <Text style={styles.challengeDescription}>{challenge.description}</Text>
                                        {challenge.sport && (
                                            <Text style={styles.challengeSport}>Sport: {challenge.sport}</Text>
                                        )}
                                        <Text style={styles.challengeDates}>
                                            {challenge.startDate.toLocaleDateString()} - {challenge.endDate.toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View style={styles.challengeProgress}>
                                        <Text style={styles.challengeProgressText}>
                                            {challenge.currentProgress}/{challenge.targetGames}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setChallengesModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleJoinChallenges}
                            >
                                <Text style={styles.confirmButtonText}>Join Selected</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        textAlign: 'center',
        marginVertical: 12,
        color: Colours.primary,
        paddingTop: 16,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        margin: 8,
        color: Colours.textPrimary,
    },
    playerDetailsContainer: {
        flexDirection: "row",
    },
    playerIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        margin: 16,
    },
    playerDetails: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 16,
    },
    backArrow: {
        position: "absolute",
        left: 8,
        top: 36,
    },
    playerName: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
    },
    playerAge: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
    },
    playerGender: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
    },
    section: {
        margin: 16,
    },
    goalsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
        marginBottom: 12,
    },
    setGoalsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    goalButton: {
        backgroundColor: Colours.primary,
        padding: 12,
        borderRadius: 8,
        flex: 0.48,
        alignItems: 'center',
    },
    goalButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    timeframeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeframeButton: {
        flex: 0.48,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colours.primary,
        alignItems: 'center',
    },
    timeframeButtonSelected: {
        backgroundColor: Colours.primary,
    },
    timeframeButtonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: Colours.primary,
    },
    timeframeButtonTextSelected: {
        color: '#fff',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 0.48,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    confirmButton: {
        backgroundColor: Colours.primary,
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
    },
    confirmButtonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: '#fff',
        fontWeight: 'bold',
    },
    challengesList: {
        maxHeight: 300,
    },
    challengeItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        alignItems: 'center',
    },
    challengeItemSelected: {
        borderColor: Colours.primary,
        backgroundColor: '#f0f8ff',
    },
    challengeInfo: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.textPrimary,
        marginBottom: 4,
    },
    challengeDescription: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
        marginBottom: 2,
    },
    challengeSport: {
        fontSize: 12,
        fontFamily: Fonts.main,
        color: Colours.primary,
        fontStyle: 'italic',
        marginBottom: 2,
    },
    challengeDates: {
        fontSize: 12,
        fontFamily: Fonts.main,
        color: Colours.textSecondary,
    },
    challengeProgress: {
        alignItems: 'center',
    },
    challengeProgressText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        color: Colours.primary,
    },
    messageButton: {
        alignSelf: "center",
        marginRight: 50,
    },
});
