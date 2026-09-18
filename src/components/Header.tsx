import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Avatar } from './Avatar';

interface Props {
  title: string;
  onAvatarPress?: () => void;
  right?: React.ReactNode;
}

const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

export function Header({ title, onAvatarPress, right }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.right}>
        {right}
        <Pressable onPress={onAvatarPress}>
          <Avatar size={44} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: spacing.xl },
  date: { ...typography.bodyMuted, marginBottom: 2 },
  title: { ...typography.h1, color: colors.textPrimary },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
