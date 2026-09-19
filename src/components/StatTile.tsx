import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilies } from '../theme/typography';
import { ProgressBar } from './ProgressBar';

interface Props extends PropsWithChildren {
  label: string;
  value: string;
  sublabel?: string;
  dark?: boolean;
  progress?: number; // 0-1, renders a thin bar under the value
  sparkline?: number[]; // 0-1 relative heights, renders a tiny bar chart under the value
}

/** Glass stat card over the blue hero gradient — dark glass for the anchor stat, light glass for the rest. */
export function StatTile({ label, value, sublabel, dark = false, progress, sparkline, children }: Props) {
  return (
    <View style={[styles.card, dark ? styles.dark : styles.light]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: dark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.4)' }]}>
          {children}
        </View>
        <Text style={[styles.label, dark && { color: 'rgba(255,255,255,0.65)' }]}>{label}</Text>
      </View>
      <Text style={[styles.value, dark ? { color: '#FFFFFF' } : styles.valueLight]}>{value}</Text>

      {sparkline && (
        <View style={styles.sparkRow}>
          {sparkline.map((h, i) => (
            <View
              key={i}
              style={[
                styles.sparkBar,
                { height: Math.max(3, h * 18), backgroundColor: dark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.8)' },
              ]}
            />
          ))}
        </View>
      )}
      {progress !== undefined && (
        <View style={{ marginTop: 6 }}>
          <ProgressBar
            progress={progress}
            height={5}
            color={dark ? '#FFFFFF' : 'rgba(255,255,255,0.9)'}
            trackColor={dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.35)'}
          />
        </View>
      )}
      {sublabel ? <Text style={[styles.sublabel, dark ? { color: 'rgba(255,255,255,0.55)' } : styles.sublabelLight]}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    minWidth: '46%',
    gap: 2,
    borderWidth: 1,
  },
  light: { backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.3)' },
  dark: { backgroundColor: 'rgba(6,20,40,0.42)', borderColor: 'rgba(255,255,255,0.14)' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fontFamilies.semiBold, fontSize: 12, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.2 },
  value: { fontFamily: fontFamilies.bold, fontSize: 22, letterSpacing: -0.3 },
  valueLight: { color: '#FFFFFF' },
  sublabel: { fontFamily: fontFamilies.regular, fontSize: 12, marginTop: 3 },
  sublabelLight: { color: 'rgba(255,255,255,0.75)' },
  sparkRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 18, marginTop: 4 },
  sparkBar: { width: 4, borderRadius: 2 },
});
