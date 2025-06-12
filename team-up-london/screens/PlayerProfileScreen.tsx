import Player from "../interfaces/Player";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import ProfileScreen from "./ProfileScreen";
import { useNavigation } from "@react-navigation/native";

type GamesNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function PlayerProfileScreen({ player }: { player: Player }) {
    const navigation = useNavigation<GamesNavProp>();

    return (
        <ProfileScreen player={player} onPress={() => navigation.navigate("Preferences")}/>
    )
}
