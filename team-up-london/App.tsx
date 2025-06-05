import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import JoinGameScreen from './screens/JoinGameScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import GamesDiscoveryScreen from './screens/GamesDiscoveryScreen';
import CommunitiesDiscoveryScreen from './screens/CommunitiesDiscoveryScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <CommunitiesDiscoveryScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
