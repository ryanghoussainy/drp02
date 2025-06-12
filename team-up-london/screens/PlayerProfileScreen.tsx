import Player from "../interfaces/Player";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import ProfileScreen from "./ProfileScreen";

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, "Main">;

export default function PlayerProfileScreen({ player }: { player: Player }) {
    return (
        <ProfileScreen profilePlayer={player} />
    )
}
