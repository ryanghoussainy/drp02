import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Game from '../interfaces/Game';
import { AVERAGE_SKILL_LEVEL } from '../constants/averageSkillLevel';
import { formatDate } from 'date-fns';
import useGamePlayers from '../hooks/useGamePlayers';
import useSports from '../hooks/useSports';
import SportIcon from './SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useGameCommunity from '../hooks/useGameCommunity';
import Colours from '../config/Colours';
import Player from '../interfaces/Player';

export default function GameCard({
    player,
    game,
    onPress,
    distance,
    isCommunityMember,
    numPlayers,
}: {
    player: Player,
    game: Game,
    onPress?: () => void,
    distance: { km: number, miles: number },
    isCommunityMember: boolean,
    numPlayers: number,
}) {
    const { players } = useGamePlayers(player.id, game.id);
    const { sports } = useSports();

    const sport = sports.find(s => s.id === game.sport_id);

    const renderDistance = () => {
        if (distance) {
            return `(${distance.km.toFixed(1)} km / ${distance.miles.toFixed(1)} mi)`
        } else {
            return '(Getting distance...)';
        }
    }

    const { community } = useGameCommunity(game.id);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.gameHeader}>
                <SportIcon
                    name={sport?.icon || 'default-icon'}
                    family={sport?.icon_family as ICON_FAMILIES}
                    size={sport?.icon_size || 20}
                    color={Colours.primary}
                />
                <Text style={styles.gameTitle}>{game.name}</Text>
            </View>

            {community && <Text style={styles.gameCommunity}>Community: {community.name} {isCommunityMember && <Text style={{ color: Colours.success }}>(Member)</Text>}</Text>}

            <View style={styles.sideBySide}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600' }}>{formatDate(new Date(game.start_time), "EEEE, PP'\n'p")} — {formatDate(new Date(game.end_time), "p")}</Text>
                    <Text style={{ color: Colours.primary }}><Text style={styles.tagText}>Skill: </Text>{AVERAGE_SKILL_LEVEL(players, game.sport_id)}</Text>
                    <View style={[styles.sideBySide, { marginTop: 2, justifyContent: 'flex-start' }]}>
                        <Ionicons name="people" size={16} color="black" />
                        <Text> {numPlayers}/{game.max_players}</Text>
                    </View>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={game.location.toLowerCase().includes("hyde") ? require("../assets/images/hydepark.jpg") :
                            game.location.toLowerCase().includes("regent's") ? require("../assets/images/regentspark.png") :
                            game.location.toLowerCase().includes("hackney") ? require("../assets/images/hackneydownscourts.png") :
                            game.location.toLowerCase().includes("westway") ? require("../assets/images/westwaysportscentre.png") :
                            game.location.toLowerCase().includes("huxley") ? require("../assets/images/huxleybuilding.png") :
                            game.location.toLowerCase().includes("wormwood") ? require("../assets/images/wormwoodscrubspark.png") :
                            game.location.toLowerCase().includes("brixton") ? require("../assets/images/brixtonrecreationcentre.png") :
                            game.location.toLowerCase().includes("wandsworth") ? require("../assets/images/wandsworthcommon.png") :
                            game.location.toLowerCase().includes("barn") ? require("../assets/images/barnelmssportscentre.png") :
                            game.location.toLowerCase().includes("islington") ? require("../assets/images/islingtontenniscentre.jpg") :
                            game.location.toLowerCase().includes("swiss") ? require("../assets/images/swisscottageleisurecentre.jpg") :
                            game.location.toLowerCase().includes("finsbury") ? require("../assets/images/finsburyleisurecentre.jpg") :
                            game.location.toLowerCase().includes("lee") ? require("../assets/images/leevalley.jpg") :
                            game.location.toLowerCase().includes("lord") ? require("../assets/images/lordscricket.jpg") :
                            game.location.toLowerCase().includes("ethos") ? require("../assets/images/ethos.jpg") :
                            game.location.toLowerCase().includes("battersea") ? require("../assets/images/battersea.jpg") :
                            game.location.toLowerCase().includes("clapham") ? require("../assets/images/clapham.jpg") :
                            game.location.toLowerCase().includes("crystal palace") ? require("../assets/images/crystalpalace.jpg") :
                            game.location.toLowerCase().includes("wimbledon") ? require("../assets/images/wimbledon.jpg") :
                            game.location.toLowerCase().includes("paddington") ? require("../assets/images/paddington.jpg") :
                            game.location.toLowerCase().includes("victoria") ? require("../assets/images/victoria.jpg") :
                            require("../assets/images/hydepark.jpg")}
                        style={styles.gameImage}
                    />
                </View>
            </View>
            <Text style={styles.locationText}>{game.location} {renderDistance()}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colours.accentBackground,
        borderRadius: 16,
        padding: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        elevation: 2,
        width: '94%',
        borderWidth: 0,
        borderColor: Colours.primary,
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
        borderBottomColor: Colours.primary,
        borderRadius: 10,
        textAlign: 'center',
        flex: 1,
        color: Colours.primary,
    },
    gameCommunity: {
        fontStyle: 'italic',
        marginTop: -5,
        marginBottom: 5,
        textAlign: 'center',
        color: Colours.primary,
    },
    tagText: {
        fontWeight: 'bold',
        color: '#555',
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
