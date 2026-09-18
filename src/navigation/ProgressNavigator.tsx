import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { BadgeDetailScreen } from '../screens/progress/BadgeDetailScreen';
import { ProgressScreen } from '../screens/progress/ProgressScreen';
import { ProgressStackParamList } from './types';

const Stack = createNativeStackNavigator<ProgressStackParamList>();

export function ProgressNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primaryBlue,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fontFamilies.semiBold, fontSize: 16, color: colors.textPrimary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ProgressHome" component={ProgressScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BadgeDetail" component={BadgeDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
