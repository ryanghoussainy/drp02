import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StyleProp, TextStyle } from 'react-native';

export default function BackArrow(
    { style }: { style?: StyleProp<TextStyle> } = {}
) {
    const navigation = useNavigation();

    return (
        <MaterialIcons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
            style={style}
        />
    );
}