import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Game from '../interfaces/Game';
import { Icon, Image, Text } from '@rneui/themed';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import { formatDate } from 'date-fns';
import useGamePlayers from '../hooks/useGamePlayers';
import useDistanceAndRegion from '../hooks/useDistanceAndRegion';
import useSports from '../hooks/useSports';
import CustomIcon from './CustomIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';

export default function GameCard({ game }: { game: Game }) {
    const { players } = useGamePlayers(game.id);
    const { sports } = useSports();

    const { distance } = useDistanceAndRegion({ gameId: game.id });

    const sport = sports.find(s => s.id === game.sport_id);

    const renderDistance = () => {
        if (distance) {
            return `(${distance?.km.toFixed(1)} km / ${distance?.miles.toFixed(1)} mi)`
        } else {
            return '(Getting distance...)';
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.gameHeader}>
                <CustomIcon
                    name={sport?.icon || 'default-icon'}
                    family={sport?.icon_family as ICON_FAMILIES}
                    size={sport?.icon_size || 20}
                    color="purple"
                />
                <Text style={styles.gameTitle}>{game.name}</Text>
            </View>

            <View style={styles.sideBySide}>
                <View style={{ flex: 1 }}>
                    <Text>{formatDate(new Date(game.start_time), "PP'\n'p")} — {formatDate(new Date(game.end_time), "p")}</Text>
                    <Text><Text style={styles.tagText}>Avg. Skill: </Text>{AVERAGE_SKILL_LEVEL(players)}</Text>
                    <View style={[styles.sideBySide, { marginTop: 2, justifyContent: 'flex-start' }]}>
                        <Icon name="person" size={16}/> 
                        <Text> {players.length}/{game.max_players}</Text>
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={game.location === "Hyde Park" ? require("../assets/images/hydepark.jpg") :
                            require("../assets/images/regentspark.png")
                        }
                        style={styles.gameImage}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </View>
            </View>
            <Text style={styles.locationText}>{game.location} {renderDistance()}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        padding: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        width: '94%',
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'purple',
        borderRadius: 10,
        marginLeft: 10,
    },
    tagText: {
        fontWeight: 'bold',
        color: '#444',
    },
    sideBySide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gameImage: {
        height: 75,
        width: 125,
        borderRadius: 10,
        marginBottom: 8,
    },
    locationText: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});
