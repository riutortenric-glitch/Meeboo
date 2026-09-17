import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { GradientScreen } from '../../components/GradientScreen';
import { MeebooCharacter } from '../../components/MeebooCharacter';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useUserStore } from '../../state/userStore';

export function LoginScreen() {
  const updateProfile = useUserStore((s) => s.updateProfile);
  const [mode, setMode] = useState<'landing' | 'email'>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithProvider = (provider: 'apple' | 'google') => {
    // Real Sign in with Apple / Google OAuth requires expo-apple-authentication
    // and a configured OAuth client (Apple Developer account / Google Cloud
    // project) — wired here as a stub that moves the user forward so the
    // onboarding flow underneath is fully testable today.
    updateProfile({ name: provider === 'apple' ? 'Apple User' : 'Google User' });
  };

  const continueWithEmail = () => {
    if (!email.trim()) return;
    updateProfile({ name: email.split('@')[0] });
  };

  return (
    <GradientScreen>
      <View style={styles.content}>
        <View style={styles.hero}>
          <MeebooCharacter size={130} flameLevel="large" bodyStage={4} />
          <Text style={styles.title}>MEEBOO</Text>
          <Text style={styles.subtitle}>Your Personal Trainer. Always On. Always Rooting For You.</Text>
        </View>

        <View style={styles.buttons}>
          {mode === 'landing' ? (
            <>
              <Button title="Sign in with Apple" onPress={() => signInWithProvider('apple')} variant="primary" style={styles.blackBtn} />
              <Button title="Continue with Google" onPress={() => signInWithProvider('google')} variant="secondary" />
              <Button title="Continue with email" onPress={() => setMode('email')} variant="ghost" />
            </>
          ) : (
            <View style={styles.emailCard}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
              <Button title="Sign up / Log in" onPress={continueWithEmail} />
              <Button title="Back" onPress={() => setMode('landing')} variant="ghost" />
            </View>
          )}
        </View>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', padding: spacing.xl, paddingTop: spacing.xxxl },
  hero: { alignItems: 'center', marginTop: spacing.xxxl },
  title: { ...typography.logo, color: colors.white, marginTop: spacing.lg },
  subtitle: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.sm,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  buttons: { gap: spacing.md, paddingBottom: spacing.xl },
  blackBtn: { backgroundColor: colors.deepNavy },
  emailCard: { backgroundColor: colors.white, borderRadius: 20, padding: spacing.lg, gap: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.deepNavy,
  },
});
