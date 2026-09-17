import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MeebooCharacter } from './src/components/MeebooCharacter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useUserStore } from './src/state/userStore';
import { colors } from './src/theme/colors';

export default function App() {
  const hasHydrated = useUserStore((s) => s.hasHydrated);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <MeebooCharacter size={100} flameLevel="medium" bodyStage={3} />
        <ActivityIndicator style={{ marginTop: 16 }} color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
});
