import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navigator from './navigation/StackNavigator';
import usePreferences from './hooks/usePreferences';
import useSports from './hooks/useSports';
import PreferencesScreen from './screens/PreferencesScreen';

export default function App() {
  const { sports } = useSports();

  const preferences = usePreferences(sports);
  const { selectedSports } = preferences;
  const preferencesSelected = selectedSports.length > 0;

  return (
    <View style={styles.container}>
      {preferencesSelected ? (
        <Navigator />
      ) : (
        <PreferencesScreen preferences={preferences} />
      )}
      
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
