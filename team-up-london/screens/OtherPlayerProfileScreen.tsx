import Player from "../interfaces/Player";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import ProfileScreen from "./ProfileScreen";

type Props = NativeStackScreenProps<RootStackParamList, "OtherPlayerProfile">;

export default function OtherPlayerProfileScreen({ player, route }: { player: Player } & Props) {
    const { player: otherPlayer } = route.params;

    return (
        <ProfileScreen player={otherPlayer} />
    )
}
