import React, { Component, useState } from 'react';
import { Button, CheckBox, Slider, Text } from '@rneui/themed';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import { SKILL_MAPPING } from '../constants/skills';
import useSports from '../hooks/useSports';
import CustomIcon from '../components/CustomIcon';
import { ICON_FAMILIES } from '../constants/icon_families';

export default function PreferencesScreen() {
    const { sports } = useSports();
    const [selectedSports, setSelectedSports] = useState<string[]>([]);
    const [skillLevels, setSkillLevels] = useState<{ [key: string]: number }>({});

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Up London</Text>
            <Text style={styles.subTitle}>Preferences</Text>

            {/* Select sports section */}
            <View style={styles.section}>
                <Text style={styles.subTitleText}>Select your sports</Text>

                {/* List sports with checkboxes */}
                <FlatList
                    data={sports}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    renderItem={({ item }) => (
                        <View style={styles.sportItemContainer}>
                            <CheckBox
                                checked={selectedSports.includes(item.name)}
                                onPress={() => {
                                    setSelectedSports((prev) =>
                                        prev.includes(item.name)
                                            ? prev.filter((s) => s !== item.name)
                                            : [...prev, item.name]
                                    ); // select/deselect sports
                                    setSkillLevels((prev) => ({ ...prev, [item.name]: 1 })); // reset skill level when sport is selected/deselected
                                }}
                                containerStyle={styles.checkboxContainer}
                                checkedColor='purple'
                            />

                            <View style={styles.sideBySide}>
                                <Text style={[styles.sportText, { fontWeight: selectedSports.includes(item.name) ? 'bold' : 'normal' }]}>
                                    {item.name}
                                </Text>

                                {/* Icon for the sport */}
                                <CustomIcon
                                    name={item.icon}
                                    family={item.icon_family as ICON_FAMILIES}
                                    size={item.size}
                                    color='purple'
                                />
                            </View>

                        </View>
                    )}
                />
                <Text style={styles.scollHint}>Swipe for more</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subTitleText}>Select skill level</Text>

                <FlatList
                    data={selectedSports}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <View style={styles.selectedSportContainer}>
                            <View style={styles.sideBySide}>
                                <View>
                                    <Text style={styles.selectedSportText}>{item}</Text>
                                </View>

                                <Slider
                                    value={skillLevels[item] || 1}
                                    minimumValue={1}
                                    maximumValue={Object.keys(SKILL_MAPPING).length} // number of skills
                                    step={1}
                                    onValueChange={(value) => setSkillLevels((prev) => ({ ...prev, [item]: value }))}
                                    style={styles.slider}
                                    thumbTintColor='purple'
                                    minimumTrackTintColor='purple'
                                    maximumTrackTintColor='#ccc'
                                    thumbProps={{
                                        children: <Text style={{ color: 'white', fontSize: 12 }}>{SKILL_MAPPING[(skillLevels[item] || 1)]}</Text>,
                                        style: styles.sliderThumb,
                                    }}
                                />
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Next button */}
            <Button
                title="Next"
                buttonStyle={styles.nextButton}
                titleStyle={styles.nextButtonText}
                containerStyle={styles.nextButtonContainer}
                ViewComponent={TouchableOpacity as unknown as typeof Component} // don't ask
            />
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
        textAlign: "left",
    },
    subTitleText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        marginBottom: 8,
        textAlign: "left",
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
    selectedSportSubText: {
        fontSize: 16,
        fontFamily: Fonts.main,
        color: '#666',
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
    skillLabelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    skillLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    sliderThumb: { // ensure full text is visible
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
    nextButton: {
        width: "40%", // increase width for better centering
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: "purple",
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
    nextButtonText: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
        width: '100%',
    },
    nextButtonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        marginRight: 8,
        marginBottom: 8,
        overflow: 'hidden',
        borderRadius: 10,
    },
});
