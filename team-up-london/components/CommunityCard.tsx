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

export default function CommunityCard({ community, onPress }: { community: Community, onPress: () => void }) {
    const { sports: allSports } = useSports();
    const sports = allSports.filter(s => community.sports_ids.includes(s.id));

    const { players, creatorId } = useCommunityPlayers(community.id);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* Community Name */}
            <Text style={styles.title}>{community.name}</Text>

            {/* Sport Icon and Name */}
            <View style={[styles.sideBySide, { justifyContent: 'center' }]}>
                {sports?.map(sport => (
                    <SportIcon
                        key={sport.id}
                        name={sport?.icon || 'default-icon'}
                        family={sport?.icon_family as ICON_FAMILIES}
                        size={sport?.icon_size || 20}
                        color={Colours.primary}
                    />
                ))}
            </View>

            {/* Primary Location */}
            <View style={styles.sportText}>
                <FontAwesome6 name="location-dot" size={18} color="black" />
                <Text style={{ marginLeft: 5 }} numberOfLines={1}>{community.primary_location}</Text>
            </View>

            {/* More Details with a right arrow */}
            <View style={[styles.sideBySide, { justifyContent: 'space-between', marginTop: 10 }]}>
                <View style={{ alignItems: 'center' }}>
                    <Ionicons
                        name="people"
                        size={24}
                        color="black"
                        style={{ marginLeft: 5 }}
                    />
                    <Text>{players.length}</Text>
                </View>

                <Text style={styles.moreDetailsText}>
                    Details
                </Text>

                <MaterialIcons name="chevron-right" size={24} color={Colours.primary} />
            </View>

            {/* Public/Private Indicator */}
            {!community.is_public && (
                <FontAwesome5 style={styles.lockIcon} name="lock" size={24} color="black" />
            )}
        </TouchableOpacity>
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
});
