import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

// ─── Types ──────────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'default' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: ViewStyle;
}

// ─── AnimatedPressable ──────────────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Component ──────────────────────────────────────────────────────────
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const isDisabled = disabled || loading;
  const height = size === 'large' ? 56 : 48;

  // Resolve variant-specific styles
  const containerStyle: ViewStyle = {
    height,
    borderRadius: 12,
    overflow: 'hidden',
    opacity: isDisabled ? 0.5 : 1,
    ...(variant === 'secondary' && {
      borderWidth: 2,
      borderColor: Colors.secondary[500],
    }),
    ...(variant === 'danger' && {
      backgroundColor: Colors.error,
    }),
  };

  const textColor: string =
    variant === 'secondary' ? Colors.secondary[500] : '#FFFFFF';

  const textSize: number = size === 'large' ? 18 : 16;

  // Inner content (icon + title or loader)
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={textColor}
          size="small"
          style={styles.loader}
        />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={size === 'large' ? 22 : 20}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.label,
              { color: textColor, fontSize: textSize } as TextStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[animatedStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={['#FF6D00', Colors.primary[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.inner, containerStyle]}
        >
          {renderContent()}
        </LinearGradient>
      ) : (
        <Animated.View style={[styles.inner, containerStyle]}>
          {renderContent()}
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    // shadow (iOS + Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  loader: {
    marginRight: 0,
  },
});

export default Button;
