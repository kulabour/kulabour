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
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Menu Item Type ─────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  subtitle?: string;
  iconColor: string;
  iconBg: string;
  danger?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'addresses',
    icon: 'map-marker-outline',
    label: 'My Addresses',
    subtitle: 'Home, Office, Other',
    iconColor: '#1565C0',
    iconBg: '#E3F2FD',
  },
  {
    id: 'payments',
    icon: 'credit-card-outline',
    label: 'Payment Methods',
    subtitle: 'UPI, Cards, Wallet',
    iconColor: '#2E7D32',
    iconBg: '#E8F5E9',
  },
  {
    id: 'favourites',
    icon: 'heart-outline',
    label: 'Favourites',
    subtitle: '12 workers saved',
    iconColor: '#C62828',
    iconBg: '#FFEBEE',
  },
  {
    id: 'language',
    icon: 'translate',
    label: 'Language',
    subtitle: 'English',
    iconColor: '#6A1B9A',
    iconBg: '#F3E5F5',
  },
  {
    id: 'help',
    icon: 'headset',
    label: 'Help & Support',
    subtitle: '24/7 Customer Support',
    iconColor: '#00796B',
    iconBg: '#E0F2F1',
  },
  {
    id: 'about',
    icon: 'information-outline',
    label: 'About Kuli',
    subtitle: 'Terms, Privacy, Licenses',
    iconColor: '#E65100',
    iconBg: '#FFF3E0',
  },
  {
    id: 'logout',
    icon: 'logout-variant',
    label: 'Logout',
    iconColor: '#C62828',
    iconBg: '#FFEBEE',
    danger: true,
  },
];

// ─── Animated Menu Row ──────────────────────────────────────────────────
function MenuRow({ item, index }: { item: MenuItem; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      delay: 300 + index * 60,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    if (item.id === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive' },
      ]);
    }
  };

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
      }}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.menuRow,
          pressed && { backgroundColor: '#FAFAFA', transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={[styles.menuIconCircle, { backgroundColor: item.iconBg }]}>
          <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
        </View>

        <View style={styles.menuTextContainer}>
          <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
            {item.label}
          </Text>
          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        <MaterialCommunityIcons name="chevron-right" size={22} color="#BDBDBD" />
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [{ scale: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
          }}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFF8F0']}
            style={styles.headerGradient}
          >
            <View style={styles.profileCard}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={styles.avatar}
                />
                <View style={styles.editAvatarBtn}>
                  <MaterialCommunityIcons name="camera" size={14} color="#FFFFFF" />
                </View>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Anil Jadav</Text>
                <View style={styles.phoneRow}>
                  <MaterialCommunityIcons name="phone-outline" size={16} color="#757575" />
                  <Text style={styles.userPhone}>+91 98765 43210</Text>
                </View>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#757575" />
                  <Text style={styles.userLocation}>Ahmedabad, Gujarat</Text>
                </View>
              </View>

              {/* Edit Button */}
              <Pressable
                style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
              >
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#E65100" />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Favourites</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹72K</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <MenuRow key={item.id} item={item} index={index} />
          ))}
        </View>

        {/* Version footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <MaterialCommunityIcons name="hard-hat" size={20} color="#E65100" />
            <Text style={styles.footerBrand}>Kuli</Text>
          </View>
          <Text style={styles.versionText}>Version 1.0.0 (Build 2026.06.01)</Text>
          <Text style={styles.copyrightText}>Made with ❤️ in Ahmedabad, India</Text>
        </View>

        <View style={{ height: 100 }} />
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

  // Header
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 20,
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#E65100',
    backgroundColor: '#EEEEEE',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E65100',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#757575',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  userLocation: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E65100',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#E65100',
  },
  statLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#EEEEEE',
  },

  // Menu Section
  menuSection: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  menuLabelDanger: {
    color: '#C62828',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 1,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 8,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E65100',
    letterSpacing: -0.5,
  },
  versionText: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  copyrightText: {
    fontSize: 12,
    color: '#BDBDBD',
    marginTop: 4,
  },
});
