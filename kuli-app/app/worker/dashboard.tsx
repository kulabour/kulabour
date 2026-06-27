import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOCK_JOBS = [
  {
    id: '1',
    customer: 'Amit Sharma',
    service: 'Interior Painting (Living Room)',
    distance: '1.2 km away',
    time: 'Start: Today 10:00 AM',
    rate: '₹350/hr',
    address: 'Satellite, Ahmedabad',
  },
  {
    id: '2',
    customer: 'Neha Patel',
    service: 'Wall Texture Work',
    distance: '3.5 km away',
    time: 'Start: Tomorrow 9:00 AM',
    rate: '₹2,500/day',
    address: 'Bodakdev, Ahmedabad',
  },
];

export default function WorkerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [jobQueue, setJobQueue] = useState(MOCK_JOBS);
  const [earnings, setEarnings] = useState({ today: 1200, jobs: 3 });

  const handleAcceptJob = (job: any) => {
    setActiveJob(job);
    setJobQueue((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleDeclineJob = (jobId: string) => {
    setJobQueue((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleCompleteJob = () => {
    // Add active job rate to earnings
    const amt = activeJob.rate.includes('hr') ? 1050 : 2500; // Mock calculation
    setEarnings((prev) => ({
      today: prev.today + amt,
      jobs: prev.jobs + 1,
    }));
    setActiveJob(null);
    alert('Job marked as completed! Payout sent to wallet.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Image
            source={{ uri: 'https://picsum.photos/id/91/150/150' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.workerName}>Ramesh Kumar</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, styles.verifiedBadge]}>
                <MaterialCommunityIcons name="check-decagram" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
              <View style={[styles.badge, styles.ratingBadge]}>
                <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.badgeText}>4.8</Text>
              </View>
            </View>
          </View>
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.replace('/')}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#FF8F00" />
          </Pressable>
        </View>

        {/* Online/Offline Card */}
        <View style={[styles.statusCard, isOnline ? styles.statusCardOnline : styles.statusCardOffline]}>
          <View style={styles.statusTextRow}>
            <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
            <Text style={styles.statusLabel}>
              {isOnline ? 'Online — Ready to receive jobs' : 'Offline — Tap toggle to go online'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#475569', true: '#2E7D32' }}
            thumbColor={isOnline ? '#FFFFFF' : '#94A3B8'}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} bounces={false}>
        {/* Earnings Card */}
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          style={styles.earningsCard}
        >
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>Today's Earnings</Text>
            <Text style={styles.earningsValue}>₹{earnings.today}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.earningsItem}>
            <Text style={styles.earningsLabel}>Jobs Completed</Text>
            <Text style={styles.earningsValue}>{earnings.jobs}</Text>
          </View>
        </LinearGradient>

        {/* Active Job Section */}
        {activeJob ? (
          <View style={styles.activeJobContainer}>
            <Text style={styles.sectionTitle}>Active Job / वर्तमान कार्य</Text>
            <View style={styles.activeJobCard}>
              <View style={styles.activeJobHeader}>
                <MaterialCommunityIcons name="hammer-screwdriver" size={24} color="#E65100" />
                <Text style={styles.activeJobService}>{activeJob.service}</Text>
              </View>
              <Text style={styles.activeJobCustomer}>Customer: {activeJob.customer}</Text>
              <Text style={styles.activeJobAddress}>Address: {activeJob.address}</Text>
              <Text style={styles.activeJobRate}>Rate: {activeJob.rate}</Text>
              
              <View style={styles.activeJobActions}>
                <Pressable
                  style={[styles.actionBtn, styles.navigateBtn]}
                  onPress={() => alert('Opening Navigation...')}
                >
                  <MaterialCommunityIcons name="google-maps" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Navigate</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.completeBtn]}
                  onPress={handleCompleteJob}
                >
                  <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Mark Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

        {/* Job Requests Queue */}
        {isOnline && !activeJob ? (
          <View style={styles.queueContainer}>
            <View style={styles.queueHeader}>
              <Text style={styles.sectionTitle}>Job Requests / कार्य अनुरोध</Text>
              <Text style={styles.queueCount}>{jobQueue.length} Available</Text>
            </View>
            
            {jobQueue.length > 0 ? (
              <FlatList
                data={jobQueue}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.jobRequestCard}>
                    <View style={styles.requestTop}>
                      <Text style={styles.requestService}>{item.service}</Text>
                      <Text style={styles.requestRate}>{item.rate}</Text>
                    </View>
                    <Text style={styles.requestDetails}>{item.customer} • {item.distance}</Text>
                    <Text style={styles.requestAddress}>📍 {item.address}</Text>
                    <Text style={styles.requestTime}>🕒 {item.time}</Text>

                    <View style={styles.requestActions}>
                      <Pressable
                        style={({ pressed }) => [styles.declineBtn, pressed && styles.buttonPressed]}
                        onPress={() => handleDeclineJob(item.id)}
                      >
                        <Text style={styles.declineBtnText}>Decline</Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [styles.acceptBtn, pressed && styles.buttonPressed]}
                        onPress={() => handleAcceptJob(item)}
                      >
                        <Text style={styles.acceptBtnText}>Accept Job</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="clock-outline" size={48} color="#94A3B8" />
                <Text style={styles.emptyStateText}>Waiting for new job requests...</Text>
              </View>
            )}
          </View>
        ) : null}

        {!isOnline && (
          <View style={styles.offlineState}>
            <MaterialCommunityIcons name="power-plug-off" size={64} color="#94A3B8" />
            <Text style={styles.offlineStateText}>You are currently offline</Text>
            <Text style={styles.offlineStateSubtext}>Go online to start receiving work requests in your area</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark mode background as specified in PRD v2.0
  },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#FF8F00',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  verifiedBadge: {
    backgroundColor: '#2E7D32',
  },
  ratingBadge: {
    backgroundColor: '#FFB300',
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutButton: {
    padding: 8,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  statusCardOnline: {
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.3)',
  },
  statusCardOffline: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  statusTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOnline: {
    backgroundColor: '#4CAF50',
  },
  dotOffline: {
    backgroundColor: '#94A3B8',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    flexShrink: 1,
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 40,
  },
  earningsCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 6,
  },
  earningsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#334155',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  activeJobContainer: {
    marginBottom: 24,
  },
  activeJobCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E65100',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeJobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activeJobService: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  activeJobCustomer: {
    fontSize: 14,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  activeJobAddress: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  activeJobRate: {
    fontSize: 14,
    color: '#FFB300',
    fontWeight: '600',
    marginBottom: 16,
  },
  activeJobActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 10,
    gap: 6,
  },
  navigateBtn: {
    backgroundColor: '#00796B',
  },
  completeBtn: {
    backgroundColor: '#E65100',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  queueContainer: {
    marginBottom: 20,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  queueCount: {
    fontSize: 13,
    color: '#94A3B8',
  },
  jobRequestCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  requestTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestService: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    paddingRight: 10,
  },
  requestRate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFB300',
  },
  requestDetails: {
    fontSize: 13,
    color: '#E2E8F0',
    marginBottom: 4,
  },
  requestAddress: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '600',
    marginBottom: 16,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  acceptBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 12,
  },
  offlineState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  offlineStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
  },
  offlineStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 30,
    lineHeight: 20,
  },
});
