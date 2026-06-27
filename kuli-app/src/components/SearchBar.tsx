import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

// ─── Types ──────────────────────────────────────────────────────────────
export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onMicPress?: () => void;
  style?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

// ─── Component ──────────────────────────────────────────────────────────
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search workers, skills…',
  value,
  onChangeText,
  onSubmit,
  onMicPress,
  style,
}) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const focusProgress = useSharedValue(0);

  const handleFocus = useCallback(() => {
    focusProgress.value = withTiming(1, { duration: 200 });
  }, [focusProgress]);

  const handleBlur = useCallback(() => {
    focusProgress.value = withTiming(0, { duration: 200 });
  }, [focusProgress]);

  const handleChangeText = useCallback(
    (text: string) => {
      setLocalValue(text);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const handleSubmit = useCallback(() => {
    onSubmit?.(localValue);
  }, [localValue, onSubmit]);

  const animatedBorder = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [Colors.neutral[200], Colors.primary[500]],
    );
    return {
      borderColor,
      borderWidth: focusProgress.value > 0.5 ? 1.5 : 1,
    };
  });

  return (
    <AnimatedView style={[styles.container, animatedBorder, style]}>
      {/* Search icon */}
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={Colors.neutral[500]}
        style={styles.searchIcon}
      />

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral[400]}
        value={localValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Mic icon */}
      <Pressable
        onPress={onMicPress}
        hitSlop={8}
        style={styles.micButton}
        accessibilityLabel="Voice search"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="microphone-outline"
          size={22}
          color={Colors.neutral[500]}
        />
      </Pressable>
    </AnimatedView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 16,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.neutral[900],
    paddingVertical: 0,
  },
  micButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchBar;
