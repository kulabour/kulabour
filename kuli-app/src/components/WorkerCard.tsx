import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';
import { RatingStars } from './RatingStars';

// ─── Types ──────────────────────────────────────────────────────────────
export interface WorkerCardProps {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  skill: string;
  hourlyRate: number;
  distance: number;
  isVerified?: boolean;
  isTopRated?: boolean;
  onPress?: (id: string) => void;
  onBook?: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Component ──────────────────────────────────────────────────────────
export const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  profileImage,
  rating,
  reviewCount,
  skill,
  hourlyRate,
  distance,
  isVerified = false,
  isTopRated = false,
  onPress,
  onBook,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 350 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 350 });
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  const handleBook = useCallback(() => {
    onBook?.(id);
  }, [id, onBook]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={`Worker card for ${name}`}
    >
      {/* ─── Top Row ─────────────────────────────────────── */}
      <View style={styles.topRow}>
        {/* Profile Image */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profileImage }}
            style={styles.avatar}
            accessibilityLabel={`${name}'s photo`}
          />
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color="#2E7D32"
              />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          {/* Name row */}
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {isTopRated && (
              <View style={styles.topRatedBadge}>
                <MaterialCommunityIcons
                  name="star-circle"
                  size={14}
                  color={Colors.accent[400] ?? '#FFB300'}
                />
                <Text style={styles.topRatedText}>Top Rated</Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <RatingStars
              rating={rating}
              size="sm"
              showCount
              count={reviewCount}
            />
          </View>

          {/* Skill tag */}
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        </View>
      </View>

      {/* ─── Bottom Row ──────────────────────────────────── */}
      <View style={styles.bottomRow}>
        {/* Rate */}
        <View style={styles.rateContainer}>
          <Text style={styles.rateAmount}>₹{hourlyRate}</Text>
          <Text style={styles.rateUnit}>/hr</Text>
        </View>

        {/* Distance */}
        <View style={styles.distanceContainer}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={14}
            color={Colors.neutral[500]}
          />
          <Text style={styles.distanceText}>{distance} km</Text>
        </View>

        {/* Book Button */}
        <Pressable
          onPress={handleBook}
          style={({ pressed }) => [
            styles.bookButton,
            pressed && styles.bookButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Book ${name}`}
        >
          <LinearGradient
            colors={['#FF6D00', Colors.primary[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookGradient}
          >
            <Text style={styles.bookText}>Book</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </AnimatedPressable>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    // premium shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  // ── Top Row ──
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.neutral[200],
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral[900],
    flex: 1,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  topRatedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF8F00',
    marginLeft: 3,
    textTransform: 'uppercase',
  },
  ratingRow: {
    marginBottom: 6,
  },
  skillTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary[500],
  },

  // ── Bottom Row ──
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rateAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary[500],
  },
  rateUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.neutral[500],
    marginLeft: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    flex: 1,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.neutral[500],
    marginLeft: 3,
  },
  bookButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookButtonPressed: {
    opacity: 0.85,
  },
  bookGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default WorkerCard;
