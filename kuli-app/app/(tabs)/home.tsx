import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList, Animated, Dimensions, Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Painting', nameHi: 'पेंटिंग', icon: 'format-paint' as const, color: '#E65100' },
  { id: '2', name: 'Plumbing', nameHi: 'प्लम्बिंग', icon: 'pipe-wrench' as const, color: '#1565C0' },
  { id: '3', name: 'Electrical', nameHi: 'इलेक्ट्रिकल', icon: 'flash' as const, color: '#F57F17' },
  { id: '4', name: 'Carpentry', nameHi: 'बढ़ई', icon: 'hammer' as const, color: '#6D4C41' },
  { id: '5', name: 'Cleaning', nameHi: 'सफाई', icon: 'broom' as const, color: '#2E7D32' },
  { id: '6', name: 'AC Service', nameHi: 'AC सर्विस', icon: 'snowflake' as const, color: '#0277BD' },
  { id: '7', name: 'Gardening', nameHi: 'बागवानी', icon: 'flower' as const, color: '#388E3C' },
  { id: '8', name: 'Masonry', nameHi: 'राजमिस्त्री', icon: 'wall' as const, color: '#D84315' },
];

const WORKERS = [
  { id: '1', name: 'Suresh Kumar', skill: 'Expert Painter', rating: 4.8, reviews: 127, rate: 300, distance: 1.2, verified: true, topRated: true, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Ramesh Yadav', skill: 'Interior Specialist', rating: 4.5, reviews: 89, rate: 250, distance: 2.4, verified: true, topRated: false, image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: '3', name: 'Lakshmi Devi', skill: 'Deep Cleaning Expert', rating: 4.9, reviews: 203, rate: 200, distance: 0.8, verified: true, topRated: true, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '4', name: 'Mohan Singh', skill: 'Master Electrician', rating: 4.7, reviews: 156, rate: 350, distance: 1.5, verified: true, topRated: false, image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { id: '5', name: 'Priya Sharma', skill: 'AC Technician', rating: 4.6, reviews: 78, rate: 400, distance: 3.2, verified: true, topRated: false, image: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

function CategoryTile({ item, index }: { item: typeof CATEGORIES[0]; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, delay: index * 80, friction: 8, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }}>
      <Pressable
        style={({ pressed }) => [styles.categoryTile, pressed && { transform: [{ scale: 0.93 }] }]}
        onPress={() => router.push({ pathname: '/(tabs)/search', params: { category: item.name } })}
      >
        <View style={[styles.categoryIcon, { backgroundColor: item.color + '18' }]}>
          <MaterialCommunityIcons name={item.icon} size={30} color={item.color} />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryNameHi}>{item.nameHi}</Text>
      </Pressable>
    </Animated.View>
  );
}

function WorkerCard({ worker, index }: { worker: typeof WORKERS[0]; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, delay: 300 + index * 100, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
      <Pressable
        style={({ pressed }) => [styles.workerCard, pressed && { transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push({ pathname: '/worker/[id]', params: { id: worker.id } })}
      >
        <Image source={{ uri: worker.image }} style={styles.workerImage} />
        <View style={styles.workerInfo}>
          <View style={styles.workerNameRow}>
            <Text style={styles.workerName}>{worker.name}</Text>
            {worker.verified && (
              <View style={styles.verifiedBadge}>
                <MaterialCommunityIcons name="check-decagram" size={16} color="#2E7D32" />
              </View>
            )}
            {worker.topRated && (
              <View style={styles.topRatedBadge}>
                <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.workerSkill}>{worker.skill}</Text>
          <View style={styles.workerMeta}>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={14} color="#FFB300" />
              <Text style={styles.ratingText}>{worker.rating}</Text>
              <Text style={styles.reviewCount}>({worker.reviews})</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#9E9E9E" />
              <Text style={styles.distanceText}>{worker.distance} km</Text>
            </View>
          </View>
        </View>
        <View style={styles.workerRight}>
          <Text style={styles.workerRate}>₹{worker.rate}</Text>
          <Text style={styles.workerRateUnit}>/hr</Text>
          <Pressable style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book</Text>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#FFFFFF', '#FFF8F0']} style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#E65100" />
              <Text style={styles.locationText}>Ahmedabad</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#757575" />
            </View>
            <View style={styles.headerIcons}>
              <Pressable style={styles.iconButton}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#424242" />
                <View style={styles.notifDot} />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.profileAvatar}
                />
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <Pressable style={styles.searchBar} onPress={() => router.push('/(tabs)/search')}>
            <MaterialCommunityIcons name="magnify" size={22} color="#9E9E9E" />
            <Text style={styles.searchPlaceholder}>Search for services...</Text>
            <View style={styles.micButton}>
              <MaterialCommunityIcons name="microphone" size={20} color="#E65100" />
            </View>
          </Pressable>
        </LinearGradient>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <LinearGradient
            colors={['#E65100', '#FF8F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>₹100 OFF</Text>
              <Text style={styles.promoSubtitle}>Your first booking!</Text>
              <Text style={styles.promoCode}>Code: KULI100</Text>
            </View>
            <MaterialCommunityIcons name="ticket-percent" size={60} color="rgba(255,255,255,0.2)" />
          </LinearGradient>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Services / सभी सेवाएं</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((cat, idx) => (
              <CategoryTile key={cat.id} item={cat} index={idx} />
            ))}
          </View>
        </View>

        {/* Popular Workers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <Pressable>
              <Text style={styles.seeAll}>See All →</Text>
            </Pressable>
          </View>
          {WORKERS.map((worker, idx) => (
            <WorkerCard key={worker.id} worker={worker} index={idx} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 18, fontWeight: '700', color: '#212121' },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C62828' },
  profileAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#E65100' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24,
    backgroundColor: '#F5F5F5', paddingHorizontal: 16, gap: 10,
    borderWidth: 1, borderColor: '#EEEEEE',
  },
  searchPlaceholder: { flex: 1, fontSize: 15, color: '#9E9E9E' },
  micButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  promoBanner: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  promoGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 16 },
  promoContent: {},
  promoTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  promoSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  promoCode: { fontSize: 13, color: '#FFD54F', fontWeight: '600', marginTop: 6, backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#212121' },
  seeAll: { fontSize: 14, fontWeight: '600', color: '#E65100' },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTile: { width: (width - 32 - 36) / 4, alignItems: 'center', gap: 6, marginBottom: 8 },
  categoryIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  categoryName: { fontSize: 12, fontWeight: '600', color: '#424242', textAlign: 'center' },
  categoryNameHi: { fontSize: 10, color: '#9E9E9E', textAlign: 'center', marginTop: -2 },
  workerCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 14, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  workerImage: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#FFF3E0' },
  workerInfo: { flex: 1, marginLeft: 12 },
  workerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  workerName: { fontSize: 16, fontWeight: '700', color: '#212121' },
  verifiedBadge: {},
  topRatedBadge: { backgroundColor: '#FFB300', borderRadius: 8, padding: 2 },
  workerSkill: { fontSize: 13, color: '#757575', marginTop: 2 },
  workerMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, fontWeight: '600', color: '#424242' },
  reviewCount: { fontSize: 12, color: '#9E9E9E' },
  distanceContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  distanceText: { fontSize: 12, color: '#9E9E9E' },
  workerRight: { alignItems: 'flex-end', gap: 4 },
  workerRate: { fontSize: 20, fontWeight: '800', color: '#E65100' },
  workerRateUnit: { fontSize: 11, color: '#9E9E9E', marginTop: -6 },
  bookButton: { backgroundColor: '#E65100', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, marginTop: 4 },
  bookButtonText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});
