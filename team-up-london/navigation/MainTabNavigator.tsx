import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StyleSheet } from "react-native";
import PreferencesScreen from "../screens/PreferencesScreen";
import CommunitiesScreen from "../screens/CommunitiesDiscoveryScreen";
import GamesDiscoveryScreen from "../screens/GamesDiscoveryScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ tabBarStyle: [styles.tabBar, { backgroundColor: "purple" }] }}>
        <Tab.Screen
            name="Preferences"
            options={() => ({
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="sliders" size={24} color={color} />
            ),
            headerShown: false,
            tabBarActiveTintColor: "white",
            tabBarLabelStyle: styles.tabBarLabel,
            })}>
            {() => <PreferencesScreen />}
        </Tab.Screen>

        <Tab.Screen
            name="Communities"
            options={() => ({
            tabBarIcon: ({ color }) => (
                <Ionicons name="people" size={30} color={color} />
            ),
            headerShown: false,
            tabBarActiveTintColor: "white",
            tabBarLabelStyle: styles.tabBarLabel,
            })}
        >
            {() => <CommunitiesScreen />}
        </Tab.Screen>

        <Tab.Screen
            name="Discover Games"
            options={() => ({
            tabBarIcon: ({ color }) => (
                <Ionicons name="football" size={30} color={color} />
            ),
            headerShown: false,
            tabBarActiveTintColor: "white",
            tabBarLabelStyle: styles.tabBarLabel,
            })}
        >
            {() => <GamesDiscoveryScreen />}
        </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: 0,
    },
    tabBarLabel: {
        fontSize: 13,
        fontWeight: "bold",
    },
});
