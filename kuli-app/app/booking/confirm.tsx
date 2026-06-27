import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Timeline Steps ─────────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  completed: boolean;
  active: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { label: 'Placed', completed: true, active: false, icon: 'check-circle' },
  { label: 'Assigned', completed: true, active: false, icon: 'check-circle' },
  { label: 'On the Way', completed: false, active: true, icon: 'truck-delivery-outline' },
  { label: 'Working', completed: false, active: false, icon: 'hammer-wrench' },
  { label: 'Done', completed: false, active: false, icon: 'flag-checkered' },
];

// ─── Main Screen ────────────────────────────────────────────────────────
export default function BookingConfirmScreen() {
  const checkAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: checkAnim,
              transform: [
                { scale: checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
              ],
            },
          ]}
        >
          <View style={styles.successCircleOuter}>
            <LinearGradient
              colors={['#2E7D32', '#43A047']}
              style={styles.successCircle}
            >
              <MaterialCommunityIcons name="check" size={48} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>Your worker has been assigned</Text>
        </Animated.View>

        {/* Booking ID */}
        <Animated.View
          style={[
            styles.bookingIdCard,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingIdValue}>#KUL-2026-0847</Text>
        </Animated.View>

        {/* Worker Info Card */}
        <Animated.View
          style={[
            styles.workerCard,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
        >
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.workerAvatar}
          />
          <View style={styles.workerInfo}>
            <View style={styles.workerNameRow}>
              <Text style={styles.workerName}>Rajesh Kumar</Text>
              <MaterialCommunityIcons name="check-decagram" size={18} color="#2E7D32" />
            </View>
            <Text style={styles.workerSkill}>Painting Specialist</Text>
            <View style={styles.workerRatingRow}>
              <MaterialCommunityIcons name="star" size={14} color="#FFB300" />
              <Text style={styles.workerRating}>4.8</Text>
              <Text style={styles.workerReviews}>(234 reviews)</Text>
            </View>
          </View>
        </Animated.View>

        {/* Booking Details Card */}
        <Animated.View
          style={[
            styles.detailsCard,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
            },
          ]}
        >
          <Text style={styles.detailsTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <MaterialCommunityIcons name="format-paint" size={18} color="#E65100" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>Interior Painting – 2 BHK</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <MaterialCommunityIcons name="calendar-outline" size={18} color="#E65100" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>10 June 2026 (Wednesday)</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#E65100" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>8:30 AM – 6:00 PM</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color="#E65100" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>15, Pramukh Residency, Satellite Road, Ahmedabad 380015</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <MaterialCommunityIcons name="currency-inr" size={18} color="#E65100" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Estimated Cost</Text>
              <Text style={styles.detailValueBold}>₹12,000</Text>
            </View>
          </View>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View
          style={[
            styles.paymentCard,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }],
            },
          ]}
        >
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentRow}>
            <View style={styles.paymentIconCircle}>
              <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentMethod}>Google Pay (UPI)</Text>
              <Text style={styles.paymentAccount}>anil@okicici</Text>
            </View>
            <MaterialCommunityIcons name="check-circle" size={22} color="#2E7D32" />
          </View>
        </Animated.View>

        {/* Status Timeline */}
        <Animated.View
          style={[
            styles.timelineCard,
            {
              opacity: contentAnim,
              transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }],
            },
          ]}
        >
          <Text style={styles.timelineTitle}>Booking Status</Text>
          <View style={styles.timeline}>
            {TIMELINE_STEPS.map((step, index) => (
              <View key={step.label} style={styles.timelineStep}>
                {/* Connector line (except first) */}
                {index > 0 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.completed && styles.timelineLineCompleted,
                      step.active && styles.timelineLineActive,
                    ]}
                  />
                )}

                {/* Circle indicator */}
                <View
                  style={[
                    styles.timelineDot,
                    step.completed && styles.timelineDotCompleted,
                    step.active && styles.timelineDotActive,
                  ]}
                >
                  {step.completed ? (
                    <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name={step.icon}
                      size={14}
                      color={step.active ? '#E65100' : '#BDBDBD'}
                    />
                  )}
                </View>

                {/* Label */}
                <Text
                  style={[
                    styles.timelineLabel,
                    step.completed && styles.timelineLabelCompleted,
                    step.active && styles.timelineLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [styles.trackBtn, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <LinearGradient
              colors={['#FF6D00', '#E65100']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.trackGradient}
            >
              <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="#FFFFFF" />
              <Text style={styles.trackText}>Track Worker</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.contactBtn, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <MaterialCommunityIcons name="phone-outline" size={20} color="#00796B" />
            <Text style={styles.contactText}>Contact Worker</Text>
          </Pressable>
        </View>

        {/* Go to Home */}
        <Pressable
          onPress={() => router.replace('/(tabs)/home')}
          style={({ pressed }) => [styles.goHomeBtn, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.goHomeText}>Go to Home</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Success
  successContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 64,
    paddingBottom: 8,
  },
  successCircleOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },

  // Booking ID
  bookingIdCard: {
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderStyle: 'dashed',
  },
  bookingIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingIdValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E65100',
    marginTop: 4,
    letterSpacing: 1,
  },

  // Worker Card
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  workerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFF3E0',
    backgroundColor: '#EEEEEE',
  },
  workerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
  },
  workerSkill: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  workerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  workerRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
  },
  workerReviews: {
    fontSize: 12,
    color: '#9E9E9E',
  },

  // Details Card
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginTop: 2,
    lineHeight: 20,
  },
  detailValueBold: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E65100',
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
    marginLeft: 48,
  },

  // Payment
  paymentCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethod: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  paymentAccount: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 1,
  },

  // Timeline
  timelineCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  timelineStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 14,
    left: -50 + '%' as any,
    right: 50 + '%' as any,
    height: 3,
    backgroundColor: '#E0E0E0',
    zIndex: -1,
  },
  timelineLineCompleted: {
    backgroundColor: '#2E7D32',
  },
  timelineLineActive: {
    backgroundColor: '#FFE0B2',
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  timelineDotCompleted: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  timelineDotActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#E65100',
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#BDBDBD',
    marginTop: 8,
    textAlign: 'center',
  },
  timelineLabelCompleted: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  timelineLabelActive: {
    color: '#E65100',
    fontWeight: '700',
  },

  // Actions
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  trackBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  trackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  trackText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#00796B',
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00796B',
  },

  // Go Home
  goHomeBtn: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  goHomeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9E9E9E',
    textDecorationLine: 'underline',
  },
});
