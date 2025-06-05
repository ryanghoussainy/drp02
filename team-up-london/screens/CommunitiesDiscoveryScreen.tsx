import React, { useState } from 'react';
import { Text } from '@rneui/themed';
import { FlatList, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import useCommunities from '../hooks/useCommunities';
import CommunityCard from '../components/CommunityCard';

export default function CommunitiesScreen() {
    const { communities } = useCommunities();

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Filters
    const [skillFilter, setSkillFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('all');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);


    // Modal state for filters
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempSkillFilter, setTempSkillFilter] = useState(skillFilter);
    const [tempLocationFilter, setTempLocationFilter] = useState(locationFilter);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(selectedDate);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const applyAllFilters = (games: Array<any>) => {
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Up London</Text>

            <View style={[styles.sideBySide, { marginBottom: 16 }]}>
                <Text style={styles.subTitle}>Communities</Text>

                {/* Filter button */}
                <TouchableOpacity
                    style={[styles.button, { marginLeft: 8, paddingVertical: 12 }]}
                    onPress={() => {
                        setTempSkillFilter(skillFilter);
                        setTempLocationFilter(locationFilter);
                        setTempSelectedDate(selectedDate);
                        setShowFilterModal(true);
                    }}
                >
                    <Text style={styles.buttonText}>Filter</Text>
                </TouchableOpacity>

                {/* Search input */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search games..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={communities}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={({ item }) => <CommunityCard community={item} />}
            />

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        width: '90%',
                        maxWidth: 400,
                    }}>
                        <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 16 }]}>Filter Games</Text>
                        {/* Skill-Level Picker */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Skill Level</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={tempSkillFilter}
                                    onValueChange={(itemValue) =>
                                        setTempSkillFilter(itemValue as 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert')
                                    }
                                    style={styles.picker}
                                >
                                    <Picker.Item label="All" value="all" />
                                    <Picker.Item label="Beginner" value="beginner" />
                                    <Picker.Item label="Intermediate" value="intermediate" />
                                    <Picker.Item label="Advanced" value="advanced" />
                                    <Picker.Item label="Expert" value="expert" />
                                </Picker>
                            </View>
                        </View>
                        {/* Location Filter Input */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Location</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Location..."
                                value={tempLocationFilter}
                                onChangeText={setTempLocationFilter}
                            />
                        </View>
                        {/* Date Filter */}
                        <View style={styles.formGroup}>
                            <Text style={styles.subTitleText}>Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={[styles.button, { paddingVertical: 12 }]}
                            >
                                <Text style={styles.buttonText}>
                                    {tempSelectedDate
                                        ? tempSelectedDate.toLocaleDateString()
                                        : 'Pick Date'}
                                </Text>
                            </TouchableOpacity>
                            {tempSelectedDate && (
                                <TouchableOpacity
                                    onPress={() => setTempSelectedDate(null)}
                                    style={{ marginTop: 8 }}
                                >
                                    <Text style={{ color: 'red', textAlign: 'center' }}>Clear Date</Text>
                                </TouchableOpacity>
                            )}
                            {showDatePicker && (
                                <DateTimePicker
                                    value={tempSelectedDate || new Date()}
                                    mode="date"
                                    display="default"
                                    style={styles.datePicker}
                                    onChange={(event, date) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (date) setTempSelectedDate(date);
                                    }}
                                />
                            )}
                        </View>
                        {/* Modal Actions */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                            <TouchableOpacity
                                style={[styles.button, { flex: 1, marginRight: 8 }]}
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: 'purple' }]}
                                onPress={() => {
                                    setSkillFilter(tempSkillFilter);
                                    setLocationFilter(tempLocationFilter);
                                    setSelectedDate(tempSelectedDate);
                                    setShowFilterModal(false);
                                }}
                            >
                                <Text style={[styles.buttonText, { color: 'white' }]}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        alignSelf: 'center',
    },
    subTitleText: {
        fontSize: 18,
        fontFamily: Fonts.main,
        textAlign: 'left',
        marginBottom: 8,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Fonts.main,
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
    searchInput: {
        height: 50,
        width: '50%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    formGroup: {
        marginBottom: 24,
        width: '100%',
    },
    modalInput: {
        height: 55,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    filtersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    picker: {
        width: '100%',
        height: '100%',
        fontSize: 16,
        fontFamily: Fonts.main,
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        height: Platform.OS === 'ios' ? 150 : 55, // keep wheel visible on iOS, dropdown‑sized on Android
        justifyContent: 'flex-start',
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: 10,
    },
});
