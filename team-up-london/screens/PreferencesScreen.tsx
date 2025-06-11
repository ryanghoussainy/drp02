import Slider from '@react-native-community/slider';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Fonts from '../config/Fonts';
import { SKILL_MAPPING } from '../constants/skills';
import useSports from '../hooks/useSports';
import SportIcon from '../components/SportIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { registerPreferences } from '../operations/Player';
import useTimes from '../hooks/useTimes';
import Time from '../interfaces/Time';
import { format, parse } from 'date-fns';
import { Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import Colours from '../config/Colours';
import usePreferences from '../hooks/usePreferences';
import Sport from '../interfaces/Sport';
import { useEffect, useState } from 'react';
import Player from '../interfaces/Player';

export default function PreferencesScreen(
    { player, preferences }: { player: Player, preferences?: { preferredTimes: string[], selectedSports: Sport[], skillLevels: { [key: string]: number },
        setPreferredTimes: React.Dispatch<React.SetStateAction<string[]>>,
        setSelectedSports: React.Dispatch<React.SetStateAction<Sport[]>>,
        setSkillLevels: React.Dispatch<React.SetStateAction<Record<string, number>>>
     }; }
) {
    const { sports } = useSports();
    const { times } = useTimes();

    const { preferredTimes, skillLevels, selectedSports: parentSelectedSports,
        setPreferredTimes, setSelectedSports, setSkillLevels
    } = preferences || usePreferences(player.id, sports);
    // Selected sports determines whether or not to show the whole main tab navigator
    // So we need to submit it before showing the navigator
    // So we have a "local" temporary selected sports state instead of using the parent one
    const [tempSelectedSports, setTempSelectedSports] = useState<Sport[]>(
        preferences?.selectedSports || parentSelectedSports
    );

    useEffect(() => {
        setTempSelectedSports(parentSelectedSports);
    }, [parentSelectedSports])

    const handleSavePreferences = async () => {
        // Send data to backend
        await registerPreferences(
            player.id,
            preferredTimes,
            tempSelectedSports.map(s => s.id), // send only IDs
            Object.values(skillLevels)
        )

        // Show success message
        Alert.alert("Success", "Your preferences have been saved!");

        // Save temporary selected sports to the parent state
        if (preferences) {
            setSelectedSports(tempSelectedSports);
        }
    }

    const displayTimes = (time: Time) => {
        if (time.start_time && time.end_time) {
            const startDate = parse(time.start_time, "HH:mm:ssX", new Date());
            const endDate = parse(time.end_time, "HH:mm:ssX", new Date());

            // Now format just the times
            const formattedStart = format(startDate, "p"); // e.g. “1:00 PM”
            const formattedEnd = format(endDate, "p"); // e.g. “2:30 PM”

            return `${time.name} (${formattedStart}-${formattedEnd})`;
        }

        return time.name;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Team Up London</Text>
                <Text style={[styles.subTitle, { textAlign: 'center' }]}>Preferences</Text>

                {/* Select sports section */}
                <View style={styles.section}>
                    <Text style={styles.subTitleText}>Which sports interest you? (at least one)</Text>

                    {/* List sports with checkboxes */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {sports.map((item) => {
                            const isChecked = tempSelectedSports.includes(item);
                            return (
                                <View key={item.id} style={styles.sportItemContainer}>
                                    <Checkbox
                                        value={isChecked}
                                        onValueChange={() => {
                                            const alreadySelected = tempSelectedSports.includes(item);
                                            if (alreadySelected) {
                                                setTempSelectedSports((prev) =>
                                                    prev.filter((s) => s !== item)
                                                );
                                                setSkillLevels((prev) => {
                                                    const copy = { ...prev };
                                                    delete copy[item.id];
                                                    return copy;
                                                });
                                            } else {
                                                setTempSelectedSports((prev) => [...prev, item]);
                                                setSkillLevels((prev) => ({ ...prev, [item.id]: 1 }));
                                            }
                                        }}
                                        style={styles.checkboxContainer}
                                        color={Colours.primary}
                                    />
                                    <View style={styles.sideBySide}>
                                        <Text
                                            style={[
                                                styles.sportText,
                                                { fontWeight: isChecked ? 'bold' : 'normal' },
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                        <SportIcon
                                            name={item.icon}
                                            family={item.icon_family as ICON_FAMILIES}
                                            size={item.icon_size}
                                            color={Colours.primary}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                    <Text style={styles.scollHint}>Swipe for more</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subTitleText}>How skilled are you?</Text>

                    {tempSelectedSports.map((item) => {
                        return (
                            <View key={item.id} style={styles.selectedSportContainer}>
                                <View>
                                    <Text style={styles.selectedSportText}>{item.name}</Text>
                                </View>
                                <View style={styles.sideBySide}>
                                    <View style={styles.sliderWrapper}>
                                        <Slider
                                            value={skillLevels[item.id] || 1}
                                            minimumValue={1}
                                            maximumValue={Object.keys(SKILL_MAPPING).length}
                                            step={1}
                                            onValueChange={(value) =>
                                                setSkillLevels((prev) => ({ ...prev, [item.id]: value }))
                                            }
                                            style={styles.slider}
                                            thumbTintColor={Colours.primary}
                                            minimumTrackTintColor={Colours.primary}
                                            maximumTrackTintColor="#444"

                                        />
                                        {/* Notches */}
                                        <View style={styles.notchesContainer} pointerEvents="none">
                                            {Array.from({ length: Object.keys(SKILL_MAPPING).length }).map((_, idx) => (
                                                <View key={idx} style={styles.notch} />
                                            ))}
                                        </View>
                                    </View>
                                    <View style={styles.sliderThumb}>
                                        <Text style={{ color: 'white', fontSize: 12 }}>
                                            {SKILL_MAPPING[skillLevels[item.id] || 1]}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Preferred times section */}
                <View style={styles.section}>
                    <Text style={styles.subTitleText}>
                        Preferred times for sports (tick all that apply)
                    </Text>

                    {/* Specific time slots (have start & end) */}
                    <Text style={styles.timeCategoryText}>Time Slots</Text>
                    {times
                        .filter(t => t.start_time && t.end_time)
                        .map((item) => {
                            const isChecked = preferredTimes.includes(item.id);
                            return (
                                <View
                                    key={item.id}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                                >
                                    <Checkbox
                                        value={isChecked}
                                        style={styles.checkboxContainer}
                                        color={Colours.primary}
                                        onValueChange={() => {
                                            setPreferredTimes((prev) =>
                                                prev.includes(item.id)
                                                    ? prev.filter((time) => time !== item.id)
                                                    : [...prev, item.id]
                                            );
                                        }}
                                    />
                                    <Text style={styles.preferredTimeText}>{displayTimes(item)}</Text>
                                </View>
                            );
                        })}

                    {/* General time preferences (no start/end) */}
                    <Text style={[styles.timeCategoryText, { marginTop: 12 }]}>
                        Days
                    </Text>
                    <View style={[styles.sideBySide, { marginHorizontal: 50 }]}>
                        {times
                            .filter(t => !(t.start_time && t.end_time))
                            .map((item) => {
                                const isChecked = preferredTimes.includes(item.id);
                                return (
                                    <View
                                        key={item.id}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                                    >
                                        <Checkbox
                                            value={isChecked}
                                            style={styles.checkboxContainer}
                                            color={Colours.primary}
                                            onValueChange={() => {
                                                setPreferredTimes((prev) =>
                                                    prev.includes(item.id)
                                                        ? prev.filter((time) => time !== item.id)
                                                        : [...prev, item.id]
                                                );
                                            }}
                                        />
                                        <Text style={styles.preferredTimeText}>{displayTimes(item)}</Text>
                                    </View>
                                );
                            })}
                    </View>
                </View>
            </ScrollView>

            {/* Save Preferences button */}
            <TouchableOpacity
                style={[styles.savePreferencesButton, { backgroundColor: Colours.extraButtons, borderWidth: tempSelectedSports.length === 0 ? 0 : 2 }]} // disable border if no sports selected
                disabled={tempSelectedSports.length === 0} // disable if no sports selected
                onPress={handleSavePreferences}
            >
                <Text style={[styles.saveButtonText, { color: tempSelectedSports.length === 0 ? '#ccc' : 'black' }]}>Save</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
        backgroundColor: '#fff',
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
    },
    subTitleText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: 'left',
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        padding: 0,
        margin: 4,
    },
    sportItemContainer: {
        marginRight: 16,
        paddingVertical: 8,
        alignItems: 'center',
    },
    sportText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        marginRight: 4,
    },
    selectedSportText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    selectedSportContainer: {
        marginBottom: 12,
        padding: 8,
        backgroundColor: Colours.accentBackground,
        borderRadius: 16,
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        marginLeft: 16,
        marginRight: 8,
    },
    sliderThumb: {
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colours.primary,
        borderRadius: 16,
    },
    scollHint: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    savePreferencesButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderColor: Colours.primary,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
    saveButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
    },
    saveButtonContainer: {
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
        overflow: 'hidden',
        borderRadius: 16,
    },
    preferredTimeText: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: '#444',
    },
    timeCategoryText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sliderWrapper: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
    },
    notchesContainer: {
        position: 'absolute',
        left: 30,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 188,
    },
    notch: {
        width: 2,
        height: 8,
        backgroundColor: '#444',
    },
});
