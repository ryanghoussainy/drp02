import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "./MainTabNavigator";
import JoinGameScreen from "../screens/JoinGameScreen";
import CommunityScreen from "../screens/CommunityScreen";

export type RootStackParamList = {
    "Main": undefined;
    "Game": { gameId: string };
    "Community": { communityId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigator () {
  return (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Main"
                component={MainTabNavigator}
            />
            <Stack.Screen name="Game"
                component={JoinGameScreen}
            />

            <Stack.Screen name="Community"
                component={CommunityScreen}
            />

        </Stack.Navigator>
    </NavigationContainer>
  );
};
