import React, { useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radii, shadow, spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', size = 'lg', disabled, loading, style, icon }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDark = variant === 'dark';

  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 6 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          size === 'md' && styles.md,
          isPrimary && styles.primary,
          isDark && styles.dark,
          isSecondary && styles.secondary,
          variant === 'ghost' && styles.ghost,
          (disabled || loading) && { opacity: 0.45 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isPrimary || isDark ? colors.white : colors.primaryBlue} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                (isPrimary || isDark) && { color: colors.white },
                (isSecondary || variant === 'ghost') && { color: colors.primaryBlue },
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
  },
  md: { minHeight: 46, paddingHorizontal: spacing.xl },
  primary: { backgroundColor: colors.primaryBlue, ...shadow.glow },
  dark: { backgroundColor: colors.deepNavy, ...shadow.soft },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primaryBlue,
  },
  ghost: { backgroundColor: 'transparent' },
  text: { fontSize: 16, fontFamily: fontFamilies.semiBold, letterSpacing: -0.1 },
});
