import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Community from '../interfaces/Community';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import useCommunityPlayers from '../hooks/useCommunityPlayers';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useSports from '../hooks/useSports';
import Colours from '../config/Colours';
import SportIcon from './SportIcon';
import Player from '../interfaces/Player';
import Feather from '@expo/vector-icons/Feather';

export default function CommunityCard({ player, community, onPress }: { player: Player, community: Community, onPress: () => void }) {
    const { sports: allSports } = useSports();
    const sports = allSports.filter(s => community.sports_ids.includes(s.id));

    const { players, creatorId } = useCommunityPlayers(player.id, community.id);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>

            {/* Purple header bar for community name */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText} numberOfLines={2}>{community.name}</Text>
            </View>

            <View style={styles.bodyContainer}>
                {/* Sport Icon and Name */}
                <View style={[styles.sideBySide, { justifyContent: 'center', alignItems: 'center', marginTop: 6 }]}>
                    {sports.slice(0, 3).map(sport => (
                        <SportIcon
                            key={sport.id}
                            name={sport?.icon || 'default-icon'}
                            family={sport?.icon_family as ICON_FAMILIES}
                            size={sport?.icon_size || 20}
                            color={Colours.primary}
                        />
                    ))}
                    {sports.length > 3 && (
                        <Text style={{ marginLeft: 4, fontSize: 16, color: Colours.primary }}>...</Text>
                    )}
                </View>
                
                {/* Primary Location */}
                <View style={styles.sportText}>
                    {/* <FontAwesome6 name="location-dot" size={18} color="black" /> */}
                    <Text style={{ fontStyle: 'italic', textAlign: 'center', marginLeft: 5, color: 'grey' }} numberOfLines={1}>{community.primary_location}</Text>
                </View>

                {/* More Details with a right arrow */}
                <View style={[styles.sideBySide, { justifyContent: 'center', gap: 10, marginTop: 10, marginBottom: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Public/Private Indicator */}
                        {community.is_public ? (
                            <View style={styles.publicCircle}>
                                <Feather name="unlock" size={12} color="white" />
                            </View>
                        ) : (
                            <View style={styles.lockCircle}>
                                <Feather name="lock" size={12} color="white" />
                            </View>
                        )}
                        <Ionicons name="people" size={24} color="black" />
                        <Text style={{ marginLeft: 5 }}>{players.length}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.moreDetailsText}>Details</Text>
                        <MaterialIcons name="chevron-right" size={24} color={Colours.primary} />
                    </View>
                </View>

            </View>

        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colours.primary,
        borderRadius: 16,
        margin: 10,
        marginBottom: 110,
        width: '45%',
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: Colours.primary,
        borderRadius: 10,
    },
    sportText: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        fontStyle: 'italic',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    sideBySide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    moreDetailsText: {
        fontSize: 14,
        color: 'grey',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    lockIcon: {
        position: 'absolute',
        top: -10,
        right: 5,
    },
    lockCircle: {
        marginLeft: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colours.error,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    publicCircle: {
        marginLeft: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colours.success,  // nice deep green for public
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerContainer: {
        backgroundColor: Colours.primary,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        paddingHorizontal: 10,
        marginBottom: 10,
        height: 65,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        justifyContent: "center"
    },
    headerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: -5,
    },
    bodyContainer: {
        position: "absolute",
        width: '100%',
        top: 55,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 4,
        borderWidth: 0,
        borderColor: Colours.primary,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    }
});
