import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../theme/colors';
import { LogMealScreen } from '../screens/nutrition/LogMealScreen';
import { NutritionScreen } from '../screens/nutrition/NutritionScreen';
import { RecipeDetailScreen } from '../screens/nutrition/RecipeDetailScreen';
import { UploadRecipeScreen } from '../screens/nutrition/UploadRecipeScreen';
import { NutritionStackParamList } from './types';

const Stack = createNativeStackNavigator<NutritionStackParamList>();

export function NutritionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.primaryBlue }}>
      <Stack.Screen name="NutritionFeed" component={NutritionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="UploadRecipe" component={UploadRecipeScreen} options={{ title: 'Share recipe' }} />
      <Stack.Screen name="LogMeal" component={LogMealScreen} options={{ title: '', presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
