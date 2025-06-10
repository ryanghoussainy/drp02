import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './navigation/StackNavigator';
import usePreferences from './hooks/usePreferences';
import useSports from './hooks/useSports';
import PreferencesScreen from './screens/PreferencesScreen';
import { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import Player from './interfaces/Player';

export default function App() {
  const [player, setPlayer] = useState<Player | null>(null);

  const { sports } = useSports();

  // Always call hooks at the top level
  const preferences = usePreferences(player?.id || '', sports);
  const { selectedSports } = preferences || {};
  const preferencesSelected = (selectedSports ?? []).length > 0;

  const renderScreen = () => {
    if (!player) {
      return <LoginScreen setPlayer={setPlayer} />;
    }
    if (!preferencesSelected) {
      return <PreferencesScreen player={player} preferences={preferences} />;
    }
    return <Navigator player={player} />;
  }

  return (
    <View style={styles.container}>
      {renderScreen()}

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
