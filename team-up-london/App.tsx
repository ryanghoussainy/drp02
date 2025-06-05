import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import JoinGameScreen from './screens/JoinGameScreen';
import PreferencesScreen from './screens/PreferencesScreen';
import GamesDiscoveryScreen from './screens/GamesDiscoveryScreen';
import CommunitiesDiscoveryScreen from './screens/CommunitiesDiscoveryScreen';
import CommunityScreen from './screens/CommunityScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <CommunityScreen communityId="cd342b7a-13b0-4396-84e4-6ec27839c585" />
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
