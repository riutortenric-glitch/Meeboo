import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TrainScreen } from '../screens/train/TrainScreen';
import { WorkoutSessionScreen } from '../screens/train/WorkoutSessionScreen';
import { WorkoutSummaryScreen } from '../screens/train/WorkoutSummaryScreen';
import { TrainStackParamList } from './types';

const Stack = createNativeStackNavigator<TrainStackParamList>();

export function TrainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainHub" component={TrainScreen} />
      <Stack.Screen name="WorkoutSession" component={WorkoutSessionScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
    </Stack.Navigator>
  );
}
