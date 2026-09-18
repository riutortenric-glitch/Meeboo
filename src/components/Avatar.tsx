import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MeebooHead } from '../illustrations/MeebooFigure';
import { brand } from '../theme/colors';
import { radii } from '../theme/spacing';

interface Props {
  size?: number;
}

export function Avatar({ size = 40 }: Props) {
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radii.pill }]}>
      <MeebooHead size={size * 0.86} animated={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: brand.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: brand.blue100,
    overflow: 'hidden',
  },
});
