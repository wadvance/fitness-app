import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AppProvider } from './src/store/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

export default function App() {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
