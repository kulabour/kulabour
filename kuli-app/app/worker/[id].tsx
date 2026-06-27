import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

// ─── Worker Data (resolved by id) ───────────────────────────────────────
const WORKERS_MAP: Record<string, {
  name: string;
  skill: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  dailyRate: number;
  experience: number;
  jobsCompleted: number;
  responseRate: number;
  bio: string;
  skills: string[];
  profileImage: string;
  workPhotos: string[];
  isVerified: boolean;
}> = {
  w1: {
    name: 'Rajesh Kumar',
    skill: 'Painting',
    rating: 4.8,
    reviewCount: 234,
    hourlyRate: 350,
    dailyRate: 2500,
    experience: 12,
    jobsCompleted: 485,
    responseRate: 96,
    bio: 'Professional painter with 12+ years of experience in interior & exterior painting. Specialised in texture finishes and waterproofing. Available for residential and commercial projects across Ahmedabad.',
    skills: ['Interior Painting', 'Exterior Painting', 'Texture Work', 'Waterproofing', 'POP Work', 'Wall Putty'],
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    workPhotos: [
      'https://picsum.photos/seed/paint1/400/300',
      'https://picsum.photos/seed/paint2/400/300',
      'https://picsum.photos/seed/paint3/400/300',
      'https://picsum.photos/seed/paint4/400/300',
    ],
    isVerified: true,
  },
};

// Fallback worker for any id
const DEFAULT_WORKER = {
  name: 'Rajesh Kumar',
  skill: 'Painting',
  rating: 4.8,
  reviewCount: 234,
  hourlyRate: 350,
  dailyRate: 2500,
  experience: 12,
  jobsCompleted: 485,
  responseRate: 96,
  bio: 'Professional painter with 12+ years of experience in interior & exterior painting. Specialised in texture finishes and waterproofing. Available for residential and commercial projects across Ahmedabad.',
  skills: ['Interior Painting', 'Exterior Painting', 'Texture Work', 'Waterproofing', 'POP Work', 'Wall Putty'],
  profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
  workPhotos: [
    'https://picsum.photos/seed/paint1/400/300',
    'https://picsum.photos/seed/paint2/400/300',
    'https://picsum.photos/seed/paint3/400/300',
    'https://picsum.photos/seed/paint4/400/300',
  ],
  isVerified: true,
};

// ─── Reviews Data ───────────────────────────────────────────────────────
const REVIEWS = [
  {
    id: 'r1',
    name: 'Priya Mehta',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 5,
    date: '2 weeks ago',
    text: 'Rajesh did an excellent job painting our 3BHK flat. The texture work on the accent wall is absolutely stunning. He was punctual, professional, and cleaned up everything after the work. Highly recommended!',
  },
  {
    id: 'r2',
    name: 'Karan Shah',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    rating: 4,
    date: '1 month ago',
    text: 'Good quality painting work. Rajesh used premium Asian Paints Royale as promised. Minor delay on the second day but he communicated well about it. Overall satisfied with the result.',
  },
];

// ─── Stars Component ────────────────────────────────────────────────────
function StarRating({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialCommunityIcons
          key={star}
          name={rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half-full' : 'star-outline'}
          size={size}
          color={rating >= star - 0.5 ? '#FFB300' : '#E0E0E0'}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────
export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const worker = WORKERS_MAP[id ?? ''] ?? DEFAULT_WORKER;
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.3, 1],
    extrapolateRight: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [1, 0.3],
    extrapolateRight: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Parallax Header */}
      <Animated.View
        style={[
          styles.headerBg,
          { transform: [{ scale: headerScale }], opacity: headerOpacity },
        ]}
      >
        <LinearGradient
          colors={['#E65100', '#FF8F00', '#FFB300']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
      </Pressable>

      {/* Share Button */}
      <Pressable
        style={({ pressed }) => [styles.shareButton, pressed && { opacity: 0.7 }]}
      >
        <MaterialCommunityIcons name="share-variant-outline" size={22} color="#FFFFFF" />
      </Pressable>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: worker.profileImage }} style={styles.avatar} />
            {worker.isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons name="check-decagram" size={24} color="#2E7D32" />
              </View>
            )}
          </View>

          <Text style={styles.workerName}>{worker.name}</Text>

          <View style={styles.skillRow}>
            <MaterialCommunityIcons name="format-paint" size={16} color="#FFFFFF" />
            <Text style={styles.skillLabel}>{worker.skill} Specialist</Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconCircle}>
                <MaterialCommunityIcons name="briefcase-outline" size={20} color="#E65100" />
              </View>
              <Text style={styles.statValue}>{worker.experience} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconCircle}>
                <MaterialCommunityIcons name="clipboard-check-outline" size={20} color="#E65100" />
              </View>
              <Text style={styles.statValue}>{worker.jobsCompleted}</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconCircle}>
                <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color="#E65100" />
              </View>
              <Text style={styles.statValue}>{worker.responseRate}%</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>
          </View>

          {/* Rating Display */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingLeft}>
              <Text style={styles.ratingNumber}>{worker.rating}</Text>
              <View style={styles.ratingDetails}>
                <StarRating rating={worker.rating} size={18} />
                <Text style={styles.reviewCountText}>{worker.reviewCount} reviews</Text>
              </View>
            </View>
          </View>

          {/* Rate Card */}
          <View style={styles.rateCard}>
            <Text style={styles.rateCardTitle}>Rate Card</Text>
            <View style={styles.rateOptions}>
              <View style={styles.rateOption}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#E65100" />
                <Text style={styles.rateAmount}>₹{worker.hourlyRate}</Text>
                <Text style={styles.rateUnit}>per hour</Text>
              </View>
              <View style={styles.rateOptionDivider} />
              <View style={styles.rateOption}>
                <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#E65100" />
                <Text style={styles.rateAmount}>₹{worker.dailyRate.toLocaleString('en-IN')}</Text>
                <Text style={styles.rateUnit}>per day</Text>
              </View>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{worker.bio}</Text>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            <View style={styles.skillChips}>
              {worker.skills.map((skill) => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Work Portfolio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Portfolio</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.portfolioScroll}
            >
              {worker.workPhotos.map((photo, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => [styles.portfolioItem, pressed && { transform: [{ scale: 0.97 }] }]}
                >
                  <Image source={{ uri: photo }} style={styles.portfolioImage} />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Pressable>
                <Text style={styles.seeAllText}>See All →</Text>
              </Pressable>
            </View>

            {REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <StarRating rating={review.rating} size={14} />
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomRate}>₹{worker.hourlyRate}</Text>
          <Text style={styles.bottomRateUnit}>/hr</Text>
        </View>
        <Pressable
          onPress={() => router.push('/booking/confirm')}
          style={({ pressed }) => [styles.bookWorkerBtn, pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={['#FF6D00', '#E65100']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookWorkerGradient}
          >
            <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
            <Text style={styles.bookWorkerText}>Book This Worker</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Parallax Header
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  headerGradient: {
    flex: 1,
  },

  // Back / Share buttons
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  shareButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 86,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  workerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Content Card
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    minHeight: 600,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  statLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },

  // Rating
  ratingSection: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF8F0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: '#E65100',
  },
  ratingDetails: {
    gap: 4,
  },
  reviewCountText: {
    fontSize: 13,
    color: '#757575',
  },

  // Rate Card
  rateCard: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E65100',
    borderStyle: 'dashed',
  },
  rateCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  rateOptions: {
    flexDirection: 'row',
  },
  rateOption: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  rateOptionDivider: {
    width: 1,
    backgroundColor: '#EEEEEE',
  },
  rateAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E65100',
  },
  rateUnit: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
  },

  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 12,
  },

  // Bio
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#616161',
  },

  // Skills
  skillChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skillChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00796B',
  },

  // Portfolio
  portfolioScroll: {
    gap: 10,
  },
  portfolioItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: width * 0.55,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
  },

  // Reviews
  reviewCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEEEEE',
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 10,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 1,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#616161',
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16,
  },
  bottomRate: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E65100',
  },
  bottomRateUnit: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  bookWorkerBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bookWorkerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  bookWorkerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
