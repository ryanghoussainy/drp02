import { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import useSports from '../hooks/useSports';
import Fonts from '../config/Fonts';
import SportIcon from '../components/SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { createCommunity, joinCommunity } from '../operations/Communities';
import Colours from '../config/Colours';
import BackArrow from '../components/BackArrow';
import Player from '../interfaces/Player';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateCommunity'>;

export default function CreateCommunityScreen({ player, navigation }: { player: Player } & Props) {
    const { sports } = useSports();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [primaryLocation, setPrimaryLocation] = useState('');
    const [locationType, setLocationType] = useState<'Sports Venue' | 'Park' | null>(null);
    const [isPublic, setIsPublic] = useState<boolean | null>(null);
    const [selectedSports, setSelectedSports] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCreateCommunityPress = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a community name.');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a community description.');
            return;
        }
        if (selectedSports.length === 0) {
            Alert.alert('Error', 'Please select at least one sport.');
            return;
        }
        if (!primaryLocation.trim()) {
            Alert.alert('Error', 'Please enter a primary location.');
            return;
        }
        if (!locationType) {
            Alert.alert('Error', 'Please select a location type.');
            return;
        }
        if (isPublic === null) {
            Alert.alert('Error', 'Please choose whether the community is public or private.');
            return;
        }

        setLoading(true);
        const community = await createCommunity(
            name,
            description,
            primaryLocation,
            locationType,
            isPublic,
            selectedSports,
            player.id, // creator ID
        );

        if (!community) {
            setLoading(false);
            Alert.alert('Error', 'Unable to create community. Please try again.');
            return;
        }

        // Add the creator as a member
        await joinCommunity(player.id, community.id);

        setLoading(false);
        navigation.replace('Community', { communityId: community.id });
    };

    const toggleSport = (id: string) => {
        setSelectedSports((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

            <View style={styles.sideBySide}>
                <BackArrow
                    style={{ top: 15 }}
                />
                <Text style={styles.title}>New Community</Text>
            </View>

            <View style={styles.field}>
                <Text style={[styles.label, { paddingTop: 10 }]}>Fields marked with <Text style={{ color: 'red' }}>*</Text> are required.</Text>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Name <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Community Name"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Description <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your community"
                    placeholderTextColor="#888"
                    multiline
                />
            </View>

            <Text style={[styles.label]}>Select Sports <Text style={{ color: 'red' }}>*</Text></Text>
            <View style={styles.sportsContainer}>
                {sports.map((s) => (
                    <TouchableOpacity
                        key={s.id}
                        style={[
                            styles.sportItem,
                            selectedSports.includes(s.id) && styles.sportSelected,
                        ]}
                        onPress={() => toggleSport(s.id)}
                    >
                        <SportIcon
                            name={s.icon || 'default-icon'}
                            family={s.icon_family as ICON_FAMILIES}
                            size={24}
                            color={selectedSports.includes(s.id) ? 'white' : Colours.primary}
                        />
                        <Text
                            style={[
                                styles.sportLabel,
                                selectedSports.includes(s.id) && { color: 'white' },
                            ]}
                        >
                            {s.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.field}>
                <Text style={[styles.label, { paddingTop: 10 }]}>Primary Location <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={primaryLocation}
                    onChangeText={setPrimaryLocation}
                    placeholder="e.g. Hyde Park"
                />
            </View>

            {/* Location Type Boxes */}
            <View style={styles.field}>
                <Text style={styles.label}>Location Type <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.optionContainer}>
                    {['Sports Venue', 'Park'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.optionBox,
                                locationType === type && styles.optionSelected,
                            ]}
                            onPress={() => setLocationType(type as 'Sports Venue' | 'Park')}
                        >
                            <Text
                                style={[
                                    styles.optionLabel,
                                    locationType === type && { color: 'white' },
                                ]}
                            >
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Public/Private Boxes */}
            <View style={styles.field}>
                <Text style={styles.label}>Visibility <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={styles.optionContainer}>
                    {[
                        { label: 'Public', value: true },
                        { label: 'Private', value: false },
                    ].map((opt) => (
                        <TouchableOpacity
                            key={opt.label}
                            style={[
                                styles.optionBox,
                                isPublic === opt.value && styles.optionSelected,
                            ]}
                            onPress={() => setIsPublic(opt.value)}
                        >
                            <Text
                                style={[
                                    styles.optionLabel,
                                    isPublic === opt.value && { color: 'white' },
                                ]}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.explanation}>
                    Public: Anyone can join this community.
                    {'\n'}
                    Private: Players need to be accepted by you to join.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && { backgroundColor: '#ccc' }]}
                disabled={loading}
                onPress={handleCreateCommunityPress}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creating...' : 'Create'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
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
        marginTop: 35,
    },
    field: {
        marginBottom: 16,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontFamily: Fonts.main,
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontFamily: Fonts.main,
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sportItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 4,
        borderWidth: 1,
        borderColor: Colours.primary,
        borderRadius: 8,
    },
    sportSelected: {
        backgroundColor: Colours.primary,
    },
    sportLabel: {
        marginTop: 4,
        fontSize: 12,
        fontFamily: Fonts.main,
        color: Colours.primary,
    },
    optionContainer: {
        flexDirection: 'row',
    },
    optionBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colours.primary,
        borderRadius: 8,
    },
    optionSelected: {
        backgroundColor: Colours.primary,
    },
    optionLabel: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: Colours.primary,
    },
    explanation: {
        marginTop: 8,
        fontFamily: Fonts.main,
        fontSize: 12,
        color: '#555',
    },
    button: {
        marginTop: 24,
        backgroundColor: Colours.primary,
        borderRadius: 12,
        paddingVertical: 14,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Fonts.main,
    },
    sideBySide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
