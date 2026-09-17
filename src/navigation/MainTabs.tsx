import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { HomeIcon, MeIcon, NutritionIcon, ProgressIcon, TrainIcon } from '../components/TabIcon';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';
import { fontFamilies } from '../theme/typography';
import { MainTabParamList } from './types';
import { NutritionNavigator } from './NutritionNavigator';
import { ProgressNavigator } from './ProgressNavigator';
import { TrainNavigator } from './TrainNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingTop: 6, height: 64 },
        tabBarLabelStyle: { fontSize: 11, fontFamily: fontFamilies.semiBold },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tab.Screen name="Progress" component={ProgressNavigator} options={{ tabBarLabel: 'You', tabBarIcon: ({ color }) => <ProgressIcon color={color} /> }} />
      <Tab.Screen name="Train" component={TrainNavigator} options={{ tabBarIcon: ({ color }) => <TrainIcon color={color} /> }} />
      <Tab.Screen name="Nutrition" component={NutritionNavigator} options={{ tabBarLabel: 'Food', tabBarIcon: ({ color }) => <NutritionIcon color={color} /> }} />
      <Tab.Screen name="Me" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <MeIcon color={color} /> }} />
    </Tab.Navigator>
  );
}
