import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { GradientScreen } from '../../components/GradientScreen';
import { MeebooFigure } from '../../illustrations/MeebooFigure';
import { defaultProfile, useUserStore } from '../../state/userStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function LoginScreen() {
  const setProfile = useUserStore((s) => s.setProfile);

  const begin = () => setProfile({ ...defaultProfile });

  return (
    <GradientScreen>
      <View style={styles.content}>
        <View style={styles.hero}>
          <MeebooFigure size={140} bodyStage={3} track="muscle" flameLevel="large" />
          <Text style={styles.title}>meeboo</Text>
          <Text style={styles.tagline}>Your personal trainer.{'\n'}Always on. Always rooting for you.</Text>
        </View>

        <View style={styles.buttons}>
          <Button title="Sign in with Apple" onPress={begin} variant="dark" />
          <Button title="Continue with Google" onPress={begin} variant="secondary" style={styles.googleBtn} />
          <Pressable onPress={begin} style={styles.emailLink}>
            <Text style={styles.emailText}>Continue with email</Text>
          </Pressable>
        </View>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', padding: spacing.xxl, paddingBottom: spacing.xxxl },
  hero: { alignItems: 'center', marginTop: spacing.huge },
  title: { ...typography.display, color: colors.white, marginTop: spacing.lg },
  tagline: { ...typography.bodyLarge, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: spacing.sm },
  buttons: { gap: spacing.md },
  googleBtn: { backgroundColor: colors.white },
  emailLink: { alignSelf: 'center', paddingVertical: spacing.sm },
  emailText: { ...typography.bodyMedium, color: colors.white, textDecorationLine: 'underline' },
});
