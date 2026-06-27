import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// ─── Types ──────────────────────────────────────────────────────────────
export type BadgeVariant =
  | 'pending'
  | 'inProgress'
  | 'completed'
  | 'cancelled'
  | 'verified';

export interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  style?: ViewStyle;
}

interface VariantConfig {
  bg: string;
  text: string;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const VARIANT_MAP: Record<BadgeVariant, VariantConfig> = {
  pending: {
    bg: '#FFF8E1',
    text: '#F57F17',
    label: 'Pending',
  },
  inProgress: {
    bg: Colors.primary[50],
    text: Colors.primary[500],
    label: 'In Progress',
  },
  completed: {
    bg: '#E8F5E9',
    text: '#2E7D32',
    label: 'Completed',
  },
  cancelled: {
    bg: '#FFEBEE',
    text: '#C62828',
    label: 'Cancelled',
  },
  verified: {
    bg: '#E8F5E9',
    text: '#2E7D32',
    label: 'Verified',
    icon: 'check-circle',
  },
};

// ─── Component ──────────────────────────────────────────────────────────
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  style,
}) => {
  const config = VARIANT_MAP[variant];
  const displayLabel = label ?? config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      {config.icon && (
        <MaterialCommunityIcons
          name={config.icon}
          size={14}
          color={config.text}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, { color: config.text }]}>
        {displayLabel}
      </Text>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12, // pill shape
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

export default StatusBadge;
