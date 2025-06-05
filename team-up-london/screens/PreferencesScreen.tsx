import React, { useEffect, useState } from 'react';
import { Button, CheckBox, Slider, Text } from '@rneui/themed';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import Fonts from '../config/Fonts';
import { SKILL_MAPPING } from '../constants/skills';
import useSports from '../hooks/useSports';
import CustomIcon from '../components/CustomIcon';
import { ICON_FAMILIES } from '../constants/iconFamilies';
import { YOU_PLAYER_ID } from '../constants/youPlayerId';
import Sport from '../interfaces/Sport';
import { getPlayerPreferences, registerPreferences } from '../operations/Player';
import useTimes from '../hooks/useTimes';
import Time from '../interfaces/Time';
import { format, parse } from 'date-fns';

export default function PreferencesScreen() {
    const { sports } = useSports();
    const [selectedSports, setSelectedSports] = useState<Sport[]>([]); // Store selected sports by their IDs
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});
    const { times } = useTimes();

    // Preferred times (IDs)
    const [preferredTimes, setPreferredTimes] = useState<string[]>([]);

    const handleSavePreferences = async () => {
        // Send data to backend
        await registerPreferences(
            YOU_PLAYER_ID,
            preferredTimes,
            selectedSports.map(s => s.id), // send only IDs
            Object.values(skillLevels)
        )

        // Navigate to communities
    }

    // Get preferences when screen is focused
    useEffect(() => {
        if (sports.length === 0) return; // wait for sports to load

        const fetchPreferences = async () => {
            const { preferred_times, preferred_sports_ids, preferred_sports_skill_levels } = await getPlayerPreferences(YOU_PLAYER_ID);
            setPreferredTimes(preferred_times || []);
            setSelectedSports(sports.filter(s => preferred_sports_ids?.includes(s.id)));

            // create a map of all the preferred sports and their corresponding skill levels
            const skillLevelMap: { [key: string]: number } = {};
            preferred_sports_ids?.forEach((id: string, index: number) => {
                if (preferred_sports_skill_levels && preferred_sports_skill_levels[index]) {
                    skillLevelMap[id] = preferred_sports_skill_levels[index];
                }
            });

            setSkillLevels(skillLevelMap);
        }

        fetchPreferences();
    }, [sports])

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Team Up London</Text>
            <Text style={styles.subTitle}>Preferences</Text>

            {/* Select sports section */}
            <View style={styles.section}>
                <Text style={styles.subTitleText}>Select your sports (at least one)</Text>

                {/* List sports with checkboxes */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {sports.map((item) => {
                        const isChecked = selectedSports.includes(item);
                        return (
                            <View key={item.id} style={styles.sportItemContainer}>
                                <CheckBox
                                    checked={isChecked}
                                    onPress={() => {
                                        const alreadySelected = selectedSports.includes(item);
                                        if (alreadySelected) {
                                            setSelectedSports((prev) =>
                                                prev.filter((s) => s !== item)
                                            );
                                            setSkillLevels((prev) => {
                                                const copy = { ...prev };
                                                delete copy[item.id];
                                                return copy;
                                            });
                                        } else {
                                            setSelectedSports((prev) => [...prev, item]);
                                            setSkillLevels((prev) => ({ ...prev, [item.id]: 1 }));
                                        }
                                    }}
                                    containerStyle={styles.checkboxContainer}
                                    checkedColor="purple"
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
                                    <CustomIcon
                                        name={item.icon}
                                        family={item.icon_family as ICON_FAMILIES}
                                        size={item.icon_size}
                                        color="purple"
                                    />
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <Text style={styles.scollHint}>Swipe for more</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subTitleText}>Select skill level</Text>

                {selectedSports.map((item) => {
                    return (
                        <View key={item.id} style={styles.selectedSportContainer}>
                            <View style={styles.sideBySide}>
                                <View>
                                    <Text style={styles.selectedSportText}>{item.name}</Text>
                                </View>
                                <Slider
                                    value={skillLevels[item.id] || 1}
                                    minimumValue={1}
                                    maximumValue={Object.keys(SKILL_MAPPING).length}
                                    step={1}
                                    onValueChange={(value) =>
                                        setSkillLevels((prev) => ({ ...prev, [item.id]: value }))
                                    }
                                    style={styles.slider}
                                    thumbTintColor="purple"
                                    minimumTrackTintColor="purple"
                                    maximumTrackTintColor="#ccc"
                                    thumbProps={{
                                        children: (
                                            <Text style={{ color: 'white', fontSize: 12 }}>
                                                {SKILL_MAPPING[skillLevels[item.id] || 1]}
                                            </Text>
                                        ),
                                        style: styles.sliderThumb,
                                    }}
                                />
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
                {times.map((item) => {
                    const isChecked = preferredTimes.includes(item.id);
                    return (
                        <CheckBox
                            key={item.id}
                            title={displayTimes(item)}
                            checked={isChecked}
                            containerStyle={styles.checkboxContainer}
                            checkedColor="purple"
                            textStyle={styles.preferredTimeText}
                            onPress={() => {
                                setPreferredTimes((prev) =>
                                    prev.includes(item.id)
                                        ? prev.filter((time) => time !== item.id)
                                        : [...prev, item.id]
                                );
                            }}
                        />
                    );
                })}
            </View>

            {/* Save Preferences button */}
            <Button
                title="Save Preferences"
                buttonStyle={[styles.savePreferencesButton, { borderWidth: selectedSports.length === 0 ? 0 : 2 }]} // disable border if no sports selected
                titleStyle={styles.saveButtonText}
                containerStyle={styles.saveButtonContainer}
                disabled={selectedSports.length === 0} // disable if no sports selected
                onPress={handleSavePreferences}
            />
        </ScrollView>
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
        borderRadius: 10,
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
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
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
        backgroundColor: 'purple',
        borderRadius: 20,
    },
    scollHint: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    savePreferencesButton: {
        width: '40%',
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderColor: 'purple',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    saveButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center',
    },
    saveButtonContainer: {
        flex: 1,
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
        overflow: 'hidden',
        borderRadius: 10,
    },
    preferredTimeText: {
        fontSize: 14,
        fontFamily: Fonts.main,
        color: '#444',
    },
});
