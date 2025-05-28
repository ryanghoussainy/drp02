import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import JoinGameScreen from './screens/JoinGameScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <JoinGameScreen />
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
