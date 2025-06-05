import React from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import Community from '../interfaces/Community';
import { Icon, Text } from '@rneui/themed';
import useSport from '../hooks/useSport';
import CustomIcon from './CustomIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import useCommunityPlayers from '../hooks/useCommunityPlayers';

export default function CommunityCard({ community, onPress }: { community: Community, onPress: () => void }) {
    const { sport } = useSport(community.sport_id);
    const { players, creatorId } = useCommunityPlayers(community.id);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {/* Community Name */}
            <Text style={styles.title}>{community.name}</Text>


            {/* Sport Icon and Name */}
            <View style={[styles.sideBySide, { justifyContent: 'center' }]}>
                <Text style={[styles.sportText, { marginRight: 5 }]}>{sport?.name}</Text>
                <CustomIcon
                    name={sport?.icon || 'default-icon'}
                    family={sport?.icon_family as ICON_FAMILIES}
                    size={sport?.icon_size || 20}
                    color="purple"
                />
            </View>

            {/* Primary Location */}
            <Text style={styles.sportText}>
                <Text style={{ fontWeight: 'bold' }}>Primary Location:</Text> {community.primary_location}
            </Text>

            {/* Public/private */}
            <Text style={styles.sportText}>
                <Text style={{ fontWeight: 'bold' }}> {community.is_public ? 'Public' : 'Private'} Community</Text>
            </Text>

            {/* More Details with a right arrow */}
            <View style={[styles.sideBySide, { justifyContent: 'space-between', marginTop: 10 }]}>
                <View style={{ alignItems: 'center' }}>
                    <Icon
                        name="group"
                        type="material"
                        size={24}
                        color="black"
                        style={{ marginLeft: 5 }}
                    />
                    <Text>{players.length}</Text>
                </View>

                <Text style={styles.moreDetailsText}>
                    Details
                </Text>

                <Icon name="chevron-right" type="material" size={24} color="purple" />
            </View>
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
        borderBottomColor: 'purple',
        borderRadius: 10,
    },
    sportText: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        fontStyle: 'italic',
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
});
