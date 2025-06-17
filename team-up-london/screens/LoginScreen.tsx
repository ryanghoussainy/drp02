import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getPlayerByName } from "../operations/Player";
import React, { useState } from "react";
import Colours from "../config/Colours";
import Player from "../interfaces/Player";
import Logo from "../components/Logo";

export default function LoginScreen({ setPlayer }: { setPlayer: (player: Player) => void }) {
    const findPlayerByName = async (): Promise<Player> => {
        const player = await getPlayerByName(name);
        return player;
    }

    const handleLogin = async () => {
        const player = await findPlayerByName();
        setPlayer(player);
    };

    // State for the input value
    const [name, setName] = useState("");

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.title}>Login to Team Up London</Text>
            <TextInput
                placeholder="Enter name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="grey"
            />

           <TouchableOpacity
               onPress={handleLogin}
               style={styles.button}
           >
               <Text style={styles.buttonText}>Login</Text>
           </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colours.primary,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        paddingLeft: 8,
        borderRadius: 5,
        width: '80%',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 10,
        backgroundColor: Colours.primary,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
