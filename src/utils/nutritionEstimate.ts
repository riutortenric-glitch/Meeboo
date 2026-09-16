/**
 * Placeholder nutrition estimator standing in for the spec's Claude API
 * ingredient-to-nutrition calculation (see 13 | Technical Requirements).
 * Swap this for a real `claude-haiku-4-5` call once an API key is configured —
 * the call signature (ingredients + serving size -> macros) is kept identical
 * so the UI layer doesn't need to change.
 */
export function estimateNutritionFromIngredients(ingredients: string[], servingSizeG: number) {
  const ingredientWeight = Math.max(1, ingredients.length);
  const baseCaloriesPerGram = 1.6;
  const calories = Math.round(servingSizeG * baseCaloriesPerGram * (0.8 + ingredientWeight * 0.03));
  const proteinG = Math.round((calories * 0.28) / 4);
  const fatG = Math.round((calories * 0.3) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
  return { calories, proteinG, carbsG: Math.max(0, carbsG), fatG };
}

export function estimateNutritionFromPhoto(_photoUri: string) {
  // Real implementation sends the photo to Claude's vision API and parses
  // a structured {name, calories, proteinG, carbsG, fatG} response.
  const options = [
    { name: 'Grilled chicken & vegetables', calories: 480, proteinG: 42, carbsG: 30, fatG: 16, emoji: '🍗' },
    { name: 'Pasta with tomato sauce', calories: 620, proteinG: 20, carbsG: 90, fatG: 14, emoji: '🍝' },
    { name: 'Mixed salad bowl', calories: 310, proteinG: 18, carbsG: 22, fatG: 14, emoji: '🥗' },
    { name: 'Protein shake', calories: 260, proteinG: 35, carbsG: 18, fatG: 5, emoji: '🥤' },
  ];
  return options[Math.floor(Math.random() * options.length)];
}
