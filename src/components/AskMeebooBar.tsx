import React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii, shadow, spacing } from '../theme/spacing';
import { fontFamilies } from '../theme/typography';
import { ArrowUpIcon, SparkleIcon } from './icons';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export function AskMeebooBar({ value, onChangeText, onSubmit, placeholder = 'What should I eat today?' }: Props) {
  return (
    <View style={styles.wrap}>
      <SparkleIcon color={colors.primaryBlue} size={17} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        returnKeyType="send"
      />
      <Pressable
        onPress={onSubmit}
        disabled={!value.trim()}
        style={[styles.sendBtn, { opacity: value.trim() ? 1 : 0.4 }]}
      >
        <ArrowUpIcon color={colors.white} size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.soft,
  },
  input: { flex: 1, fontSize: 15, fontFamily: fontFamilies.regular, color: colors.textPrimary, paddingVertical: spacing.sm },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
