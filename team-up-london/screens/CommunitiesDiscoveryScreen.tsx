import React, { useState, useRef, useEffect } from 'react';
import { FlatList, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import { Picker } from '@react-native-picker/picker';
import useCommunities from '../hooks/useCommunities';
import CommunityCard from '../components/CommunityCard';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from '@expo/vector-icons/Feather';
import Sport from '../interfaces/Sport';
import useSports from '../hooks/useSports';
import { Text } from 'react-native';
import Colours from '../config/Colours';
import Player from '../interfaces/Player';
import { Animated, Dimensions, SafeAreaView } from 'react-native';
import Community from '../interfaces/Community';
import Logo from '../components/Logo';

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

type TabType = 'Your Communities' | 'Discover';

export default function CommunitiesScreen({ player }: { player: Player }) {
    const { communities, communityPlayers } = useCommunities();

    const [yourCommunities, setYourCommunities] = useState<Community[]>([]);
    const [discoverCommunities, setDiscoverCommunities] = useState<Community[]>([]);

    useEffect(() => {
        setYourCommunities(
            communities.filter(community => communityPlayers.get(community.id)?.includes(player.id))
        )
        setDiscoverCommunities(
            communities.filter(community => !communityPlayers.get(community.id)?.includes(player.id))
        );
    }, [communities, communityPlayers]);

    const getCurrentCommunities = () => {
        switch (activeTab) {
            case 'Your Communities':
                return applyAllFilters(yourCommunities);
            case 'Discover':
                return applyAllFilters(discoverCommunities);
            default:
                return [];
        }
    }

    // Tab navigation animation
    const tabTranslateX = useRef(new Animated.Value(0)).current;

    const switchTab = (tab: TabType) => {
        setActiveTab(tab);
        let toValue = 0;
        const tabWidth = (screenWidth - 16) / 2; // Assuming equal width tabs

        if (tab === 'Your Communities') toValue = 0;
        else if (tab === 'Discover') toValue = tabWidth - 12; // Account for container padding

        Animated.spring(tabTranslateX, {
            toValue,
            useNativeDriver: true,
            tension: 60,
            friction: 8,
        }).start();
    };

    const navigation = useNavigation<GamesNavProp>();

    const { sports } = useSports();

    // Active tab state
    const [activeTab, setActiveTab] = useState<TabType>('Your Communities');

    // Search (+ animation)
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchWidth = useRef(new Animated.Value(0)).current;

    // Open/close
    const toggleSearch = () => {
        if (!searchActive) {
            setSearchActive(true);
            Animated.timing(searchWidth, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(searchWidth, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setSearchActive(false);
                setSearchQuery('');
            });
        }
    };

    const interpolatedWidth = searchWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '52%'],
    });

    const screenWidth = Dimensions.get('window').width;
    const maxSearchWidth = screenWidth * 0.3;

    const interpolatedFilterShift = searchWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -maxSearchWidth * 0.1],  // shift left as much as search bar expands
    });

    // Filters
    const [locationFilter, setLocationFilter] = useState('');
    const [sportFilter, setSportFilter] = useState<'all' | Sport>('all');
    const [privacyFilter, setPrivacyFilter] = useState<'all' | 'public' | 'private'>('all');

    // Modal state for filters
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempLocationFilter, setTempLocationFilter] = useState(locationFilter);
    const [tempSportFilter, setTempSportFilter] = useState(sportFilter);
    const [tempPrivacyFilter, setTempPrivacyFilter] = useState(privacyFilter);

    const applyAllFilters = (communities: Array<Community>) => {
        return communities.filter((community) => {
            // 1. Name search (case-insensitive substring)
            if (!community.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // 2. Sport filter (if selected, show only games of that sport)
            if (sportFilter !== 'all' && !community.sports_ids.includes(sportFilter.id)) {
                return false;
            }

            // 3. Location filter (case-insensitive substring)
            if (
                locationFilter.length > 0 &&
                !community.primary_location.toLowerCase().includes(locationFilter.toLowerCase())
            ) {
                return false;
            }

            // 4. Privacy filter
            if (privacyFilter === 'public' && !community.is_public) {
                return false;
            }
            if (privacyFilter === 'private' && community.is_public) {
                return false;
            }

            return true;
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.container}>
                <Logo />
                <View style={[styles.sideBySide, { marginLeft: 24, marginBottom: 4, justifyContent: 'flex-end', alignItems: 'center' }]}>
                    <Text style={[styles.subTitle, { marginTop: 12, marginRight: 20, zIndex: 0, position: 'relative' }]}>Communities</Text>
                    {/* Group everything inside one row */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        {/* Filter button */}
                        <Animated.View style={{ transform: [{ translateX: interpolatedFilterShift }] }}>
                            <TouchableOpacity
                                style={[styles.button, { marginLeft: 0, height: 50, width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}
                                onPress={() => {
                                    setTempLocationFilter(locationFilter);
                                    setTempSportFilter(sportFilter);
                                    setTempPrivacyFilter(privacyFilter);
                                    setShowFilterModal(true);
                                }}
                            >
                                <Feather name="filter" size={24} color={Colours.primary} />
                                <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Filter</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Search bar */}
                        <Animated.View style={[styles.animatedSearchContainer, { width: interpolatedWidth, marginLeft: 2 }]}>
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor="#888"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                                autoFocus={searchActive}
                            />
                        </Animated.View>

                        {/* Search icon */}
                        <TouchableOpacity onPress={toggleSearch} style={[styles.searchButton, { marginLeft: 2 }]}>
                            <Feather name={searchActive ? "x" : "search"} size={24} color={Colours.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tab Navigation */}
                <View style={[styles.tabContainer, { marginTop: 15 }]}>
                    <Animated.View
                        style={[
                            styles.tabIndicator,
                            {
                                transform: [{ translateX: tabTranslateX }]
                            }
                        ]}
                    />
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('Your Communities')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Your Communities' && styles.activeTabText]}>
                            Your Communities
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('Discover')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Discover' && styles.activeTabText]}>
                            Discover
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={getCurrentCommunities()}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <CommunityCard
                            community={item}
                            player={player}
                            onPress={() => navigation.navigate("Community", { communityId: item.id })}
                            numMembers={communityPlayers.get(item.id)?.length || 0}
                        />
                    )}
                />

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
                        }}>
                            <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 16 }]}>Filter Communities</Text>
                            {/* Skill-Level Picker */}
                            <View style={styles.formGroup}>
                                <Text style={styles.subTitleText}>Sports</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={tempSportFilter}
                                        dropdownIconColor={Colours.primary}
                                        onValueChange={(itemValue) =>
                                            setTempSportFilter(itemValue as 'all' | Sport)
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="All Sports" value="all" />
                                        {Object.entries(sports).map(([key, sport]) => (
                                            <Picker.Item key={key} label={sport.name} value={sport} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            {/* Location Filter Input */}
                            <View style={styles.formGroup}>
                                <Text style={styles.subTitleText}>Location</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Location..."
                                    placeholderTextColor="#888"
                                    value={tempLocationFilter}
                                    onChangeText={setTempLocationFilter}
                                />
                            </View>

                            {/* Private or Public Filter*/}
                            <View style={styles.formGroup}>
                                <Text style={styles.subTitleText}>Privacy</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={tempPrivacyFilter}
                                        dropdownIconColor={Colours.primary}
                                        onValueChange={(itemValue) =>
                                            setTempPrivacyFilter(itemValue as 'all' | 'public' | 'private')
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="All" value="all" />
                                        <Picker.Item label="Public Only" value="public" />
                                        <Picker.Item label="Private Only" value="private" />
                                    </Picker>
                                </View>
                            </View>

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
                                        setSportFilter(tempSportFilter);
                                        setLocationFilter(tempLocationFilter);
                                        setPrivacyFilter(tempPrivacyFilter);
                                        setShowFilterModal(false);
                                    }}
                                >
                                    <Text style={[styles.buttonText, { color: 'white' }]}>Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

            {/* Create Community Button */}
            <TouchableOpacity
                style={[styles.button,
                { backgroundColor: Colours.primary, borderColor: Colours.highlightButton, borderWidth: 0, position: "absolute", bottom: 20, width: "90%", alignSelf: "center", paddingVertical: 12, flexDirection: 'row' }]}
                onPress={() => navigation.navigate("CreateCommunity")}
            >
                <Feather name="plus" size={24} color={Colours.success} />
                <Text style={[styles.buttonText, { fontWeight: 'bold', color: 'white' }]}>Create Community</Text>
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
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: 'left',
        marginLeft: 10,
    },
    subTitleText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        textAlign: 'left',
        marginBottom: 8,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        outlineColor: '#ccc',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: Colours.extraButtons,
        borderColor: Colours.primary,
        borderWidth: 0,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        marginLeft: 8,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
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
        borderColor: '#ccc',
        borderWidth: 0,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        justifyContent: 'center',
    },
    animatedSearchContainer: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        marginRight: 15,
        overflow: 'hidden',
        paddingHorizontal: 0,
        justifyContent: 'center',
    },
    searchButton: {
        padding: 12,
        backgroundColor: Colours.extraButtons,
        borderRadius: 12,
        borderWidth: 0,
        borderColor: Colours.primary,
        marginRight: 8
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderRadius: 999,
        justifyContent: 'center',
        display: 'flex',
        zIndex: 2, // Ensure text appears above the sliding indicator
    },
    activeTab: {
        backgroundColor: Colours.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontFamily: Fonts.main,
        fontWeight: '500',
        color: '#666',
        textAlign: 'center',
        width: '100%',
    },
    activeTabText: {
        color: 'white',
        fontWeight: '600',
    },
    tabIndicator: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: `${100 / 2}%`, // One third of the container
        height: '100%',
        backgroundColor: Colours.primary,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 1,
    },
});
