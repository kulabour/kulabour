import React, { useCallback } from 'react';
import { Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

// ─── Types ──────────────────────────────────────────────────────────────
export interface CategoryTileProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  name: string;
  nameHindi: string;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Component ──────────────────────────────────────────────────────────
export const CategoryTile: React.FC<CategoryTileProps> = ({
  icon,
  name,
  nameHindi,
  color,
  onPress,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  // 10% opacity tint from the category colour
  const bgColor = `${color}1A`; // hex alpha ≈ 10%

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tile, { backgroundColor: bgColor }, animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={`${name} category`}
    >
      <MaterialCommunityIcons name={icon} size={32} color={color} />

      <Text style={[styles.name, { color: Colors.neutral[900] }]} numberOfLines={1}>
        {name}
      </Text>

      <Text style={[styles.hindi, { color: Colors.neutral[500] }]} numberOfLines={1}>
        {nameHindi}
      </Text>
    </AnimatedPressable>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  tile: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  hindi: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
  },
});

export default CategoryTile;
