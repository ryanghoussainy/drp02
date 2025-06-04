import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import JoinGameScreen from './screens/JoinGameScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import GamesDiscoveryScreen from './screens/GamesDiscoveryScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <PreferencesScreen />
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
