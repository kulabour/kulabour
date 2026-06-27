import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// ─── Types ──────────────────────────────────────────────────────────────
export type StarSize = 'sm' | 'md' | 'lg';

export interface RatingStarsProps {
  rating: number;
  size?: StarSize;
  showCount?: boolean;
  count?: number;
}

const STAR_SIZES: Record<StarSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

const FONT_SIZES: Record<StarSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

// ─── Component ──────────────────────────────────────────────────────────
export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
  showCount = false,
  count = 0,
}) => {
  const iconSize = STAR_SIZES[size];
  const fontSize = FONT_SIZES[size];
  const goldColor = Colors.accent[400] ?? '#FFB300';
  const emptyColor = Colors.neutral[300];
  const totalStars = 5;

  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
    if (rating >= i) {
      iconName = 'star';
    } else if (rating >= i - 0.5) {
      iconName = 'star-half-full';
    } else {
      iconName = 'star-outline';
    }

    stars.push(
      <MaterialCommunityIcons
        key={`star-${i}`}
        name={iconName}
        size={iconSize}
        color={rating >= i - 0.5 ? goldColor : emptyColor}
        style={styles.star}
      />,
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>

      {showCount && (
        <Text style={[styles.count, { fontSize, color: Colors.neutral[600] }]}>
          ({count.toLocaleString()})
        </Text>
      )}
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
  count: {
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default RatingStars;
