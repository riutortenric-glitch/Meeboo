# Meeboo

Your Personal Trainer. Always On. Always Rooting For You.

Cross-platform (iOS + Android) fitness companion app built with Expo /
React Native + TypeScript, implemented from the MEEBOO Master Product
Document v2.0.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app on your iPhone or Android phone.
No Mac or Xcode required to try it.

## What's implemented

- Onboarding: 8-step quiz → BMI-driven body type calculation
- 5-tab navigation: Home, Progress, Train, Nutrition, Me
- Meeboo character with an animated flame (reacts to training consistency)
  and a body avatar that scales with logged progress
- Home dashboard: stat cards, Ask Meeboo bar, Meeboo's reactive greeting
- Progress tab: 8-badge muscle group grid (Stone → Diamond tiers) with
  per-badge detail sheets
- Train tab: workout templates → set-by-set session flow with rest timers
  and local rest-timer notifications, workout summary screen
- Nutrition tab: recipe discovery feed (High Protein / High Calorie / Low
  Calorie), recipe detail + logging, 3-step recipe upload with automatic
  nutrition estimation from an ingredient list, photo-based meal logging,
  water tracker, daily calorie/macro dashboard
- Me tab: profile summary, data deletion
- All data persisted locally on-device (AsyncStorage) — profile, workouts,
  nutrition history survive app restarts

## What's stubbed and needs real infrastructure

These match the doc's own "Version 2 and beyond" section — they need
accounts/credentials only you can provide, not more app code:

| Feature | What's stubbed | To make it real |
|---|---|---|
| Sign in with Apple / Google | Buttons that set a placeholder name and continue | Apple Developer account + `expo-apple-authentication`; Google Cloud OAuth client |
| Apple Health / Health Connect | Home screen shows static sleep/steps numbers | Requires a native/EAS dev build (not available in Expo Go) + HealthKit/Health Connect entitlements |
| Calendar intelligence | Not wired up | `expo-calendar` + calendar permission, same dev-build requirement |
| AI photo meal recognition | Random plausible result from a small local list | Send the photo to the Claude API (`claude-haiku-4-5` per the spec) with a vision-capable request; needs an Anthropic API key |
| Recipe ingredient → nutrition | Simple local heuristic in `src/utils/nutritionEstimate.ts` | Same Claude API call, text-only |
| Lock-screen notification action buttons (Done / Different reps) | Notifications fire on schedule; tapping opens the app rather than acting from the lock screen | Needs a native/EAS dev build — Expo Go doesn't support custom `UNNotificationAction` categories |
| Barcode scanning | Not implemented | `expo-camera`'s barcode scanner + Open Food Facts API |
| Backend / cross-device sync, friends & leaderboards, weekly/monthly AI letters | Not implemented — everything is local-only, single device | Needs a real backend service |

## Project structure

```
src/
  theme/        colors, typography, spacing tokens
  components/    MeebooCharacter, MeebooFlame, Button, Card, BadgeIcon, ...
  state/         zustand stores (user, workouts, nutrition), AsyncStorage-persisted
  data/          exercises, workout templates, badge tiers, seed recipes
  utils/         BMI/body-type math, flame level, Meeboo's notification voice, notifications
  navigation/    root stack + 5-tab navigator + per-tab stacks
  screens/       auth, onboarding, home, progress, train, nutrition, profile
```

## Design system

Colors, type scale and component rules (pill buttons, 20-24px card radii,
SF Pro / system font) come straight from section 05 of the product doc —
see `src/theme/`.
