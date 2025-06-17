import Player from "../interfaces/Player";
import ProfileScreen from "./ProfileScreen";


export default function PlayerProfileScreen({ player }: { player: Player }) {
    return (
        <ProfileScreen profilePlayer={player} />
    )
}
