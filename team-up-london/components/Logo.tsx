import { Image, StyleSheet } from "react-native";

export default function Logo() {
    return (
        <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
        />
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 60,
        alignSelf: 'center',
        marginTop: 16,
    },
});
