import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { BadgeTier } from '../theme/colors';
import { badgeImages } from '../assets/badgeAssets';

interface Props {
  tier: BadgeTier;
  size?: number;
  locked?: boolean;
}

export function BadgeIcon({ tier, size = 56, locked = false }: Props) {
  return (
    <Image
      source={badgeImages[tier]}
      style={[{ width: size, height: size }, locked && styles.locked]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  locked: { opacity: 0.35 },
});
