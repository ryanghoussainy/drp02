import { Text } from '@rneui/themed';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Fonts from '../config/Fonts';
import { Feather } from '@expo/vector-icons';

export default function GamesDiscoveryScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Up London</Text>

            <View style={styles.sideBySide}>
                <Text style={styles.subTitle}>Games</Text>

                {/* Filter button */}
                <TouchableOpacity style={[styles.button, styles.sideBySide]}>
                    <Feather name="filter" size={20} color="black" />
                    {/* <Text style={styles.buttonText}>Filter</Text> */}
                </TouchableOpacity>

                {/* Search button */}
                <TouchableOpacity style={[styles.button, styles.sideBySide]}>
                    <Feather name="search" size={20} color="black" />
                    {/* <Text style={styles.buttonText}>Search</Text> */}
                </TouchableOpacity>
            </View>

            <Text style={styles.subTitleText}>
                For you
            </Text>
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
        marginLeft: 8,
    },
});
