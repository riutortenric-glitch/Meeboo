import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabBar, Sidebar, TabKey, useIsSidebarLayout } from '../components/AppShell';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';
import { NutritionNavigator } from './NutritionNavigator';
import { ProgressNavigator } from './ProgressNavigator';
import { TrainNavigator } from './TrainNavigator';

/**
 * The top-level tab shell is hand-rolled rather than React Navigation's
 * bottom-tabs: a sidebar on wide web viewports and a bottom bar on mobile
 * share the same active-tab state, which the library's tabBar render prop
 * can't reshape into a side-by-side layout. Each tab's own stack (Train,
 * Nutrition, Progress) still runs through React Navigation underneath.
 */
export function MainTabs() {
  const [active, setActive] = useState<TabKey>('Home');
  const isSidebar = useIsSidebarLayout();

  const renderTab = (tab: TabKey) => {
    switch (tab) {
      case 'Home':
        return <HomeScreen />;
      case 'Train':
        return <TrainNavigator />;
      case 'Nutrition':
        return <NutritionNavigator />;
      case 'Progress':
        return <ProgressNavigator />;
      case 'Me':
        return <ProfileScreen />;
    }
  };

  return (
    <View style={[styles.root, isSidebar && styles.rootRow]}>
      {isSidebar && <Sidebar active={active} onSelect={setActive} />}
      <View key={active} style={styles.content}>
        {renderTab(active)}
      </View>
      {!isSidebar && <BottomTabBar active={active} onSelect={setActive} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  rootRow: { flexDirection: 'row' },
  content: { flex: 1 },
});
