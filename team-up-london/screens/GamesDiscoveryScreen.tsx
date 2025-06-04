import React from 'react';
import { Text } from '@rneui/themed';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import { Feather } from '@expo/vector-icons';
import useGamesDiscoverySections from '../hooks/useGamesDiscoverySections';
import GameCard from '../components/GameCard';

export default function GamesDiscoveryScreen() {
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
    } = useGamesDiscoverySections();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Up London</Text>

            <View style={[styles.sideBySide, { marginBottom: 16 }]}>
                <Text style={styles.subTitle}>Games</Text>

                {/* Filter button */}
                <View style={styles.sideBySide}>
                    <TouchableOpacity style={[styles.button, styles.sideBySide]}>
                        <Feather name="filter" size={20} color="purple" />
                        <Text style={styles.buttonText}>Filter</Text>
                    </TouchableOpacity>

                    {/* Search button */}
                    <TouchableOpacity style={[styles.button, styles.sideBySide]}>
                        <Feather name="search" size={20} color="purple" />
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                </View>
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
                        color="purple"
                    />
                </TouchableOpacity>
                {forYouSectionOpen && (
                <View style={styles.sectionContent}>
                    {/* Games list */}
                    <FlatList
                        data={forYouGames}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <GameCard game={item} />}
                    />
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
                    color="purple"
                />
                </TouchableOpacity>
                {nearYouSectionOpen && (
                <View style={styles.sectionContent}>
                    <Text style={styles.contentText}>
                    
                    </Text>
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
                    color="purple"
                />
                </TouchableOpacity>
                {trySomethingNewSectionOpen && (
                <View style={styles.sectionContent}>
                    <Text style={styles.contentText}>
                    
                    </Text>
                </View>
                )}
            </View>
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
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: 'left',
    },
    subTitleText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        textAlign: 'left',
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#f0f0f0',
        outlineColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginLeft: 8,
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
});
