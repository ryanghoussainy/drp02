import React, { useEffect, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Fonts from '../config/Fonts';
import { Feather } from '@expo/vector-icons';
import useGamesDiscoverySections from '../hooks/useGamesDiscoverySections';
import useSports from '../hooks/useSports';
import GameCard from '../components/GameCard';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import { getPlayersInGame } from '../operations/Games';
import Player from '../interfaces/Player';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import Colours from '../config/Colours';
import useDistancesAndRegions from '../hooks/useDistancesAndRegions';
import Game from '../interfaces/Game';
import { Region } from 'react-native-maps';

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

interface GameWithDistanceAndRegion {
    game: Game;
    distance: { km: number; miles: number };
    mapRegion: Region;
}

export default function GamesDiscoveryScreen({ player }: { player: Player }) {
    const navigation = useNavigation<GamesNavProp>();
    const { sports } = useSports();

    const {
        // For you section
        forYouSectionOpen,
        setForYouSectionOpen,
        forYouGames,

        // Near you section
        nearYouSectionOpen,
        setNearYouSectionOpen,
        nearYouGames,

        // Try something new section
        trySomethingNewSectionOpen,
        setTrySomethingNewSectionOpen,
        trySomethingNewGames,
    } = useGamesDiscoverySections(player);

    const { distances: forYouDistances, mapRegions: forYouMapRegions } = useDistancesAndRegions(forYouGames);
    const { distances: nearYouDistances, mapRegions: nearYouMapRegions } = useDistancesAndRegions(nearYouGames);
    const { distances: trySomethingNewDistances, mapRegions: trySomethingNewMapRegions } = useDistancesAndRegions(trySomethingNewGames);

    // States for sorted games by distance
    const [forYouSortedGames, setForYouSortedGames] = useState<GameWithDistanceAndRegion[]>([]);
    const [nearYouSortedGames, setNearYouSortedGames] = useState<GameWithDistanceAndRegion[]>([]);
    const [trySomethingNewSortedGames, setTrySomethingNewSortedGames] = useState<GameWithDistanceAndRegion[]>([]);
    useEffect(() => {
        // Combine games with their distances and regions
        setForYouSortedGames(forYouGames.map((game, idx) => ({
            game,
            distance: forYouDistances[idx],
            mapRegion: forYouMapRegions[idx],
        })).sort((a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km));

        setNearYouSortedGames(nearYouGames.map((game, idx) => ({
            game,
            distance: nearYouDistances[idx],
            mapRegion: nearYouMapRegions[idx],
        })).sort((a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km));

        setTrySomethingNewSortedGames(trySomethingNewGames.map((game, idx) => ({
            game,
            distance: trySomethingNewDistances[idx],
            mapRegion: trySomethingNewMapRegions[idx],
        })).sort((a, b) => (a.distance || { km: 0 }).km - (b.distance || { km: 0 }).km));
    }, [
        forYouGames, forYouDistances, forYouMapRegions,
        nearYouGames, nearYouDistances, nearYouMapRegions,
        trySomethingNewGames, trySomethingNewDistances, trySomethingNewMapRegions
    ]);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Players cache keyed by game id
    const [playersByGame, setPlayersByGame] = useState<{ [key: string]: Player[] }>({});

    useEffect(() => {
        const fetchPlayers = async () => {
            // Collect all unique game IDs across the three sections
            const allGames = [...forYouGames, ...nearYouGames, ...trySomethingNewGames];
            const uniqueIds = Array.from(new Set(allGames.map((g) => g.id)));

            const entries = await Promise.all(
                uniqueIds.map(async (id) => [id, await getPlayersInGame(id)] as [string, Player[]])
            );

            setPlayersByGame(Object.fromEntries(entries));
        };

        fetchPlayers();
    }, [forYouGames, nearYouGames, trySomethingNewGames]);

    // Filters
    const [skillFilter, setSkillFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('all');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSportIds, setSelectedSportIds] = useState<string[]>([]);

    // Modal state for filters
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempSkillFilter, setTempSkillFilter] = useState(skillFilter);
    const [tempLocationFilter, setTempLocationFilter] = useState(locationFilter);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(selectedDate);
    const [tempSelectedSportIds, setTempSelectedSportIds] = useState<string[]>(selectedSportIds);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const toggleSportSelection = (sportId: string, isTemp: boolean = false) => {
        const currentSelection = isTemp ? tempSelectedSportIds : selectedSportIds;
        const setSelection = isTemp ? setTempSelectedSportIds : setSelectedSportIds;
        
        if (currentSelection.includes(sportId)) {
            setSelection(currentSelection.filter(id => id !== sportId));
        } else {
            setSelection([...currentSelection, sportId]);
        }
    };

    const applyAllFilters = (games: Array<GameWithDistanceAndRegion>) => {
        return games.filter((gameWithDistanceAndRegion) => {
            const game = gameWithDistanceAndRegion.game;
            // 1. Name search (case-insensitive substring)
            if (!game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // 2. Skill-level filter
            const averageSkillLevel = AVERAGE_SKILL_LEVEL(playersByGame[game.id] || [], game.sport_id);
            if (skillFilter !== 'all' && averageSkillLevel !== skillFilter) {
                return false;
            }

            // 3. Location filter (case-insensitive substring)
            if (
                locationFilter.length > 0 &&
                !game.location.toLowerCase().includes(locationFilter.toLowerCase())
            ) {
                return false;
            }

            // 4. Date filter (if a date is selected, show only games whose start_time falls on that day)
            if (selectedDate) {
                const gameDate = new Date(game.start_time);
                if (!isSameDay(gameDate, selectedDate)) {
                    return false;
                }
            }

            // 5. Sports filter (if sports are selected, game must match one of the selected sports)
            if (selectedSportIds.length > 0) {
                if (!selectedSportIds.includes(game.sport_id)) {
                    return false;
                }
            }

            return true;
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Team Up London</Text>

                <Text style={styles.subTitle}>Discovery</Text>

                <View style={[styles.sideBySide, { marginBottom: 16 }]}>
                    {/* Filter button */}
                    <TouchableOpacity
                        style={[styles.button, { marginLeft: 8, paddingVertical: 12, width: '40%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
                        onPress={() => {
                            setTempSkillFilter(skillFilter);
                            setTempLocationFilter(locationFilter);
                            setTempSelectedDate(selectedDate);
                            setTempSelectedSportIds([...selectedSportIds]);
                            setShowFilterModal(true);
                        }}
                    >
                        <Feather name="filter" size={24} color={Colours.primary} />
                        <Text style={styles.buttonText}>Filter</Text>
                    </TouchableOpacity>

                    {/* Search input */}
                    <TextInput
                        style={styles.searchInput}
                        placeholderTextColor='#888'
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* For you section */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setForYouSectionOpen(!forYouSectionOpen)}
                    >
                        <Text style={styles.subTitleText}>For You</Text>
                        <Feather
                            name={forYouSectionOpen ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={Colours.primary}
                        />
                    </TouchableOpacity>
                    {forYouSectionOpen && (
                        <View style={styles.sectionContent}>
                            {/* Games list */}
                            {applyAllFilters(forYouSortedGames).map((game, idx) => (
                                <GameCard
                                    key={idx}
                                    player={player}
                                    game={game.game}
                                    onPress={() => navigation.navigate("Game", { game: game.game, distance: game.distance, mapRegion: game.mapRegion })}
                                    distance={game.distance}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Near You section */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setNearYouSectionOpen(!nearYouSectionOpen)}
                    >
                        <Text style={styles.subTitleText}>Near You</Text>
                        <Feather
                            name={nearYouSectionOpen ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={Colours.primary}
                        />
                    </TouchableOpacity>
                    {nearYouSectionOpen && (
                        <View style={styles.sectionContent}>
                            {applyAllFilters(nearYouSortedGames).map((game, idx) => (
                                <GameCard
                                    key={idx}
                                    player={player}
                                    game={game.game}
                                    onPress={() => navigation.navigate("Game", { game: game.game, distance: game.distance, mapRegion: game.mapRegion })}
                                    distance={game.distance}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Try Something New section */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => setTrySomethingNewSectionOpen(!trySomethingNewSectionOpen)}
                    >
                        <Text style={styles.subTitleText}>Try Something New</Text>
                        <Feather
                            name={trySomethingNewSectionOpen ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={Colours.primary}
                        />
                    </TouchableOpacity>
                    {trySomethingNewSectionOpen && (
                        <View style={styles.sectionContent}>
                            {applyAllFilters(trySomethingNewSortedGames).map((game, idx) => (
                                <GameCard
                                    key={idx}
                                    player={player}
                                    game={game.game}
                                    onPress={() => navigation.navigate("Game", { game: game.game, distance: game.distance, mapRegion: game.mapRegion })}
                                    distance={game.distance}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Filter Modal */}
                <Modal
                    visible={showFilterModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowFilterModal(false)}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            padding: 20,
                            width: '90%',
                            maxWidth: 400,
                            maxHeight: '80%',
                        }}>
                            <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 16 }]}>Filter Games</Text>
                            
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Sports Filter */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.subTitleText}>Sports</Text>
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false}
                                        style={styles.sportsContainer}
                                        contentContainerStyle={styles.sportsContentContainer}
                                    >
                                        {sports.map((sport) => (
                                            <TouchableOpacity
                                                key={sport.id}
                                                style={[
                                                    styles.sportChip,
                                                    tempSelectedSportIds.includes(sport.id) && styles.sportChipSelected
                                                ]}
                                                onPress={() => toggleSportSelection(sport.id, true)}
                                            >
                                                <Text style={[
                                                    styles.sportChipText,
                                                    tempSelectedSportIds.includes(sport.id) && styles.sportChipTextSelected
                                                ]}>
                                                    {sport.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    {tempSelectedSportIds.length > 0 && (
                                        <TouchableOpacity
                                            onPress={() => setTempSelectedSportIds([])}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Text style={{ color: 'red', textAlign: 'center', fontSize: 14 }}>Clear All Sports</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Skill-Level Picker */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.subTitleText}>Skill Level</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={tempSkillFilter}
                                            onValueChange={(itemValue) =>
                                                setTempSkillFilter(itemValue as 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert')
                                            }
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="All" value="all" />
                                            <Picker.Item label="Beginner" value="beginner" />
                                            <Picker.Item label="Intermediate" value="intermediate" />
                                            <Picker.Item label="Advanced" value="advanced" />
                                            <Picker.Item label="Expert" value="expert" />
                                        </Picker>
                                    </View>
                                </View>
                                
                                {/* Location Filter Input */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.subTitleText}>Location</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Location..."
                                        placeholderTextColor={'#888'}
                                        value={tempLocationFilter}
                                        onChangeText={setTempLocationFilter}
                                    />
                                </View>
                                
                                {/* Date Filter */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.subTitleText}>Date</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker(true)}
                                        style={[styles.button, { paddingVertical: 12 }]}
                                    >
                                        <Text style={styles.buttonText}>
                                            {tempSelectedDate
                                                ? tempSelectedDate.toLocaleDateString()
                                                : 'Pick Date'}
                                        </Text>
                                    </TouchableOpacity>
                                    {tempSelectedDate && (
                                        <TouchableOpacity
                                            onPress={() => setTempSelectedDate(null)}
                                            style={{ marginTop: 8 }}
                                        >
                                            <Text style={{ color: 'red', textAlign: 'center' }}>Clear Date</Text>
                                        </TouchableOpacity>
                                    )}
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={tempSelectedDate || new Date()}
                                            mode="date"
                                            display="default"
                                            style={styles.datePicker}
                                            onChange={(event, date) => {
                                                setShowDatePicker(Platform.OS === 'ios');
                                                if (date) setTempSelectedDate(date);
                                            }}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            
                            {/* Modal Actions */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                                    onPress={() => setShowFilterModal(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: Colours.primary }]}
                                    onPress={() => {
                                        setSkillFilter(tempSkillFilter);
                                        setLocationFilter(tempLocationFilter);
                                        setSelectedDate(tempSelectedDate);
                                        setSelectedSportIds([...tempSelectedSportIds]);
                                        setShowFilterModal(false);
                                    }}
                                >
                                    <Text style={[styles.buttonText, { color: 'white' }]}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>

            {/* Create Game Button */}
            <TouchableOpacity
                style={[styles.button, 
                    { backgroundColor: Colours.extraButtons, borderColor: Colours.primary, borderWidth: 2, position: "absolute", bottom: 10, width: "90%", alignSelf: "center", paddingVertical: 12, flexDirection: 'row' }]}
                onPress={() => navigation.navigate("CreateGame", { communityId: null })}
            >
                <Feather name="plus" size={24} color={Colours.primary} />
                <Text style={[styles.buttonText, { fontWeight: 'bold', color: '#003366' }]}>Create Game</Text>
            </TouchableOpacity>
        </SafeAreaView>
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
        color: Colours.primary,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: 'left',
        alignSelf: 'center',
    },
    subTitleText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: Fonts.main,
        textAlign: 'left',
        marginBottom: 8,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: Colours.extraButtons,
        outlineColor: Colours.primary,
        borderWidth: 2,
        padding: 10,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        marginLeft: 8,
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionContent: {
        marginTop: 10,
        paddingHorizontal: 4,
    },
    contentText: {
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    searchInput: {
        height: 50,
        width: '43%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    formGroup: {
        marginBottom: 24,
        width: '100%',
    },
    modalInput: {
        height: 55,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    picker: {
        width: '100%',
        height: '100%',
        fontSize: 16,
        fontFamily: Fonts.main,
        color: '#333',
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        height: Platform.OS === 'ios' ? 150 : 55, // keep wheel visible on iOS, dropdown‑sized on Android
        justifyContent: 'flex-start',
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: 10,
    },
    sportsContainer: {
        maxHeight: 60,
    },
    sportsContentContainer: {
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    sportChip: {
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginVertical: 4,
    },
    sportChipSelected: {
        backgroundColor: Colours.primary,
        borderColor: Colours.primary,
    },
    sportChipText: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: '#333',
    },
    sportChipTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
});