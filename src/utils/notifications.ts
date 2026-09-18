import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const SET_ACTION_CATEGORY = 'workout-set';

/**
 * Registers the interactive "Done" / "Different reps" category used by the
 * notification-first workout flow. Action buttons that work from the lock
 * screen without opening the app require a native/EAS dev build — in Expo
 * Go the notification still appears but tapping it just opens the app.
 */
export async function configureNotificationCategories() {
  if (Platform.OS === 'web') return;
  await Notifications.setNotificationCategoryAsync(SET_ACTION_CATEGORY, [
    { identifier: 'DONE', buttonTitle: 'Done', options: { opensAppToForeground: false } },
    { identifier: 'DIFFERENT_REPS', buttonTitle: 'Different reps', options: { opensAppToForeground: true } },
  ]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleRestTimer(seconds: number, nextExerciseName: string) {
  if (Platform.OS === 'web') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Rest complete',
      body: `Next up: ${nextExerciseName}`,
      categoryIdentifier: SET_ACTION_CATEGORY,
    },
    trigger: Platform.OS === 'android'
      ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds, channelId: 'default' }
      : { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
  });
}

export async function scheduleWeeklyPlanNotification() {
  if (Platform.OS === 'web') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your week with Meeboo',
      body: "This week's plan is ready. Looks good, or want changes?",
    },
    trigger: null,
  });
}

export async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Meeboo',
    importance: Notifications.AndroidImportance.HIGH,
  });
}
