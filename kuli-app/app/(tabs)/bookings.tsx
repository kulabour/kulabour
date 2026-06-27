import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Types ──────────────────────────────────────────────────────────────
type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

interface BookingItem {
  id: string;
  workerName: string;
  workerImage: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  status: BookingStatus;
  rating?: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────
const BOOKINGS: BookingItem[] = [
  {
    id: 'BK-2026-0841',
    workerName: 'Suresh Sharma',
    workerImage: 'https://randomuser.me/api/portraits/men/68.jpg',
    service: 'Electrical – Full House Wiring',
    date: '28 May 2026',
    time: '9:00 AM – 6:00 PM',
    amount: 8500,
    status: 'completed',
    rating: 5,
  },
  {
    id: 'BK-2026-0843',
    workerName: 'Lakshmi Bai',
    workerImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    service: 'Deep Cleaning – 3 BHK Flat',
    date: '20 May 2026',
    time: '10:00 AM – 2:00 PM',
    amount: 3500,
    status: 'completed',
    rating: 4,
  },
  {
    id: 'BK-2026-0845',
    workerName: 'Dinesh Joshi',
    workerImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    service: 'Carpentry – Modular Kitchen',
    date: '15 May 2026',
    time: '9:00 AM – 5:00 PM',
    amount: 45000,
    status: 'completed',
    rating: 5,
  },
  {
    id: 'BK-2026-0847',
    workerName: 'Rajesh Kumar',
    workerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    service: 'Painting – 2 BHK Interior',
    date: '10 Jun 2026',
    time: '8:30 AM – 6:00 PM',
    amount: 12000,
    status: 'upcoming',
  },
  {
    id: 'BK-2026-0849',
    workerName: 'Vikram Singh',
    workerImage: 'https://randomuser.me/api/portraits/men/56.jpg',
    service: 'AC Service – Split AC Gas Refill',
    date: '1 Jun 2026',
    time: '2:00 PM – 4:00 PM',
    amount: 2800,
    status: 'cancelled',
  },
];

const TABS: { key: BookingStatus; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_CONFIGS: Record<BookingStatus, { bg: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }> = {
  upcoming: { bg: '#FFF3E0', color: '#E65100', icon: 'clock-outline', label: 'Upcoming' },
  completed: { bg: '#E8F5E9', color: '#2E7D32', icon: 'check-circle-outline', label: 'Completed' },
  cancelled: { bg: '#FFEBEE', color: '#C62828', icon: 'close-circle-outline', label: 'Cancelled' },
};

// ─── Booking Card ───────────────────────────────────────────────────────
function BookingCard({ booking, index }: { booking: BookingItem; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const statusConfig = STATUS_CONFIGS[booking.status];

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      delay: index * 100,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.bookingCard, pressed && { transform: [{ scale: 0.97 }] }]}
      >
        {/* Top row: Worker info + Status badge */}
        <View style={styles.cardTop}>
          <Image source={{ uri: booking.workerImage }} style={styles.workerAvatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.workerName} numberOfLines={1}>{booking.workerName}</Text>
            <Text style={styles.serviceText} numberOfLines={1}>{booking.service}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <MaterialCommunityIcons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Details row */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
        </View>

        {/* Bottom row: Amount + Rating */}
        <View style={styles.cardBottom}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountValue}>₹{booking.amount.toLocaleString('en-IN')}</Text>
          </View>

          {booking.rating && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <MaterialCommunityIcons
                  key={star}
                  name={star <= (booking.rating ?? 0) ? 'star' : 'star-outline'}
                  size={16}
                  color={star <= (booking.rating ?? 0) ? '#FFB300' : '#E0E0E0'}
                />
              ))}
            </View>
          )}

          <Text style={styles.bookingId}>#{booking.id}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────
function EmptyBookingState({ status }: { status: BookingStatus }) {
  const configs: Record<BookingStatus, { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; subtitle: string }> = {
    upcoming: {
      icon: 'calendar-blank-outline',
      title: 'No Upcoming Bookings',
      subtitle: 'Book a worker from the search screen\nand your bookings will appear here',
    },
    completed: {
      icon: 'clipboard-check-outline',
      title: 'No Completed Bookings',
      subtitle: 'Your completed bookings\nwill show up here',
    },
    cancelled: {
      icon: 'cancel',
      title: 'No Cancelled Bookings',
      subtitle: 'Good news! You haven\'t\ncancelled any bookings',
    },
  };

  const config = configs[status];

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name={config.icon} size={48} color="#E65100" />
      </View>
      <Text style={styles.emptyTitle}>{config.title}</Text>
      <Text style={styles.emptySubtitle}>{config.subtitle}</Text>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');

  const filteredBookings = useMemo(
    () => BOOKINGS.filter((b) => b.status === activeTab),
    [activeTab]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track and manage your service bookings</Text>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = BOOKINGS.filter((b) => b.status === tab.key).length;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Booking list */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <BookingCard booking={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyBookingState status={activeTab} />}
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabActive: {
    borderBottomColor: '#E65100',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  tabTextActive: {
    color: '#E65100',
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeActive: {
    backgroundColor: '#FFF3E0',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
  },
  tabBadgeTextActive: {
    color: '#E65100',
  },

  // Booking Card
  bookingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEEEEE',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  serviceText: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },

  detailsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#757575',
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E65100',
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginRight: 12,
  },
  bookingId: {
    fontSize: 11,
    color: '#BDBDBD',
    fontWeight: '500',
  },

  // List
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
  },
});
