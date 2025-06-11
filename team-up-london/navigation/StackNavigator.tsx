import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import JoinGameScreen from "../screens/JoinGameScreen";
import CommunityScreen from "../screens/CommunityScreen";
import CreateCommunityScreen from "../screens/CreateCommunityScreen";
import Player from "../interfaces/Player";
import CreateGameScreen from "../screens/CreateGameScreen";
import PlayerChatScreen from "../screens/PlayerChatScreen";

export type RootStackParamList = {
    "Main": undefined;
    "Game": { gameId: string };
    "Community": { communityId: string };
    "CreateCommunity": undefined;
    "CreateGame": { communityId: string | null };
    "PlayerChat": { player: Player };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator ({ player }: { player: Player }) {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right"
            }}
        >
            <Stack.Screen name="Main">
                {() => <MainTabNavigator player={player} />}
            </Stack.Screen>

            <Stack.Screen name="Game">
                {(props) => <JoinGameScreen {...props} player={player} />}
            </Stack.Screen>

            <Stack.Screen name="Community">
                {(props) => <CommunityScreen {...props} player={player} />}
            </Stack.Screen>

            <Stack.Screen name="CreateCommunity">
                {(props) => <CreateCommunityScreen {...props} player={player} />}
            </Stack.Screen>

            <Stack.Screen name="CreateGame">
                {(props) => <CreateGameScreen {...props} player={player} />}
            </Stack.Screen>

            <Stack.Screen name="PlayerChat">
                {(props) => <PlayerChatScreen {...props} player={player} />}
            </Stack.Screen>

        </Stack.Navigator>
    </NavigationContainer>
  );
};
