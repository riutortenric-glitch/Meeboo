export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Progress: undefined;
  Train: undefined;
  Nutrition: undefined;
  Me: undefined;
};

export type TrainStackParamList = {
  TrainHub: undefined;
  WorkoutSession: { templateId: string };
  WorkoutSummary: undefined;
};

export type NutritionStackParamList = {
  NutritionFeed: undefined;
  RecipeDetail: { recipeId: string };
  UploadRecipe: undefined;
  LogMeal: undefined;
};

export type ProgressStackParamList = {
  ProgressHome: undefined;
  BadgeDetail: { muscleGroup: string };
};
