import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import JoinGameScreen from "../screens/JoinGameScreen";
import CommunityScreen from "../screens/CommunityScreen";
import CreateCommunityScreen from "../screens/CreateCommunityScreen";
import PreferencesScreen from "../screens/PreferencesScreen";
import Player from "../interfaces/Player";

export type RootStackParamList = {
    "Main": undefined;
    "Game": { gameId: string };
    "Community": { communityId: string };
    "CreateCommunity": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator ({ player }: { player: Player }) {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
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

        </Stack.Navigator>
    </NavigationContainer>
  );
};
