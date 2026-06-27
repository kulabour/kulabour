import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
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

// ─── Mock Data ──────────────────────────────────────────────────────────
interface SearchWorker {
  id: string;
  name: string;
  skill: string;
  rating: number;
  reviews: number;
  rate: number;
  distance: number;
  verified: boolean;
  topRated: boolean;
  available: boolean;
  experience: number;
  image: string;
}

const ALL_WORKERS: SearchWorker[] = [
  { id: 'w1', name: 'Rajesh Kumar', skill: 'Painting', rating: 4.8, reviews: 234, rate: 350, distance: 2.3, verified: true, topRated: true, available: true, experience: 12, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 'w2', name: 'Amit Patel', skill: 'Plumbing', rating: 4.6, reviews: 187, rate: 400, distance: 1.8, verified: true, topRated: true, available: true, experience: 8, image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 'w3', name: 'Suresh Sharma', skill: 'Electrical', rating: 4.9, reviews: 312, rate: 450, distance: 3.5, verified: true, topRated: true, available: true, experience: 15, image: 'https://randomuser.me/api/portraits/men/68.jpg' },
  { id: 'w4', name: 'Meena Devi', skill: 'Cleaning', rating: 4.5, reviews: 156, rate: 250, distance: 1.2, verified: true, topRated: false, available: true, experience: 5, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'w5', name: 'Dinesh Joshi', skill: 'Carpentry', rating: 4.7, reviews: 198, rate: 500, distance: 4.1, verified: true, topRated: false, available: false, experience: 10, image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 'w6', name: 'Vikram Singh', skill: 'AC Service', rating: 4.8, reviews: 267, rate: 500, distance: 5.0, verified: true, topRated: true, available: false, experience: 9, image: 'https://randomuser.me/api/portraits/men/56.jpg' },
  { id: 'w7', name: 'Lakshmi Bai', skill: 'Cleaning', rating: 4.9, reviews: 340, rate: 300, distance: 0.8, verified: true, topRated: true, available: true, experience: 11, image: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'w8', name: 'Mohammad Irfan', skill: 'Masonry', rating: 4.7, reviews: 145, rate: 450, distance: 6.2, verified: true, topRated: false, available: true, experience: 14, image: 'https://randomuser.me/api/portraits/men/81.jpg' },
];

// ─── Filter Chips ───────────────────────────────────────────────────────
type FilterKey = 'nearby' | 'topRated' | 'available' | 'verified';

interface FilterChip {
  key: FilterKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const FILTERS: FilterChip[] = [
  { key: 'nearby', label: 'Within 5 km', icon: 'map-marker-radius' },
  { key: 'topRated', label: '4+ Stars', icon: 'star' },
  { key: 'available', label: 'Available Now', icon: 'clock-check-outline' },
  { key: 'verified', label: 'Verified', icon: 'check-decagram' },
];

// ─── Worker Card Component (inline, matching home design) ───────────────
function SearchWorkerCard({ worker, index }: { worker: SearchWorker; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      delay: index * 80,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.workerCard, pressed && { transform: [{ scale: 0.97 }] }]}
        onPress={() => router.push({ pathname: '/worker/[id]', params: { id: worker.id } })}
      >
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: worker.image }} style={styles.workerImage} />
          {worker.verified && (
            <View style={styles.verifiedDot}>
              <MaterialCommunityIcons name="check-decagram" size={16} color="#2E7D32" />
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.workerInfo}>
          <View style={styles.workerNameRow}>
            <Text style={styles.workerName} numberOfLines={1}>{worker.name}</Text>
            {worker.topRated && (
              <View style={styles.topRatedBadge}>
                <MaterialCommunityIcons name="star-circle" size={13} color="#FF8F00" />
                <Text style={styles.topRatedText}>Top</Text>
              </View>
            )}
          </View>

          <View style={styles.skillRow}>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>{worker.skill}</Text>
            </View>
            {!worker.available && (
              <View style={styles.busyTag}>
                <Text style={styles.busyText}>Busy</Text>
              </View>
            )}
          </View>

          <View style={styles.workerMeta}>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={14} color="#FFB300" />
              <Text style={styles.ratingText}>{worker.rating}</Text>
              <Text style={styles.reviewCount}>({worker.reviews})</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#9E9E9E" />
              <Text style={styles.distanceText}>{worker.distance} km</Text>
            </View>
            <View style={styles.expContainer}>
              <MaterialCommunityIcons name="briefcase-outline" size={13} color="#9E9E9E" />
              <Text style={styles.expText}>{worker.experience} yrs</Text>
            </View>
          </View>
        </View>

        {/* Right side: Rate & Book */}
        <View style={styles.workerRight}>
          <Text style={styles.workerRate}>₹{worker.rate}</Text>
          <Text style={styles.workerRateUnit}>/hr</Text>
          <Pressable
            style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]}
            onPress={() => router.push({ pathname: '/booking/confirm' })}
          >
            <LinearGradient
              colors={['#FF6D00', '#E65100']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookGradient}
            >
              <Text style={styles.bookText}>Book</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="magnify-close" size={48} color="#E65100" />
      </View>
      <Text style={styles.emptyTitle}>No Workers Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or{'\n'}removing some filters
      </Text>
    </View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────
export default function SearchScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [search, setSearch] = useState(params.category ?? '');
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());

  const toggleFilter = useCallback((key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const filteredWorkers = useMemo(() => {
    let results = ALL_WORKERS;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.skill.toLowerCase().includes(q)
      );
    }

    // Filter chips
    if (activeFilters.has('nearby')) {
      results = results.filter((w) => w.distance <= 5);
    }
    if (activeFilters.has('topRated')) {
      results = results.filter((w) => w.rating >= 4.0);
    }
    if (activeFilters.has('available')) {
      results = results.filter((w) => w.available);
    }
    if (activeFilters.has('verified')) {
      results = results.filter((w) => w.verified);
    }

    return results;
  }, [search, activeFilters]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Workers</Text>
        <Text style={styles.headerSubtitle}>
          {filteredWorkers.length} workers available in Ahmedabad
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#9E9E9E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or skill..."
            placeholderTextColor="#BDBDBD"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#BDBDBD" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            const isActive = activeFilters.has(item.key);
            return (
              <Pressable
                onPress={() => toggleFilter(item.key)}
                style={({ pressed }) => [
                  styles.chip,
                  isActive && styles.chipActive,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#757575'}
                />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Results */}
      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SearchWorkerCard worker={item} index={index} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
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
    paddingBottom: 4,
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

  // Search Bar
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    paddingVertical: 0,
  },

  // Filters
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#E65100',
    borderColor: '#E65100',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#757575',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Worker Card
  workerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    position: 'relative',
  },
  workerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFF3E0',
    backgroundColor: '#EEEEEE',
  },
  verifiedDot: {
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
  workerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  topRatedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF8F00',
    textTransform: 'uppercase',
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  skillTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00796B',
  },
  busyTag: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  busyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C62828',
  },
  workerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
  },
  reviewCount: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  expContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  expText: {
    fontSize: 12,
    color: '#9E9E9E',
  },

  // Right side
  workerRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  workerRate: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E65100',
  },
  workerRateUnit: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: -4,
  },
  bookBtn: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
  },
  bookGradient: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
