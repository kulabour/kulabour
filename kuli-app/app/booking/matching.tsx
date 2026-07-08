import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { socketService } from '../../services/socket';
import { LinearGradient } from 'expo-linear-gradient';

export default function MatchingScreen() {
  const { customerId, bookingId } = useLocalSearchParams<{ customerId: string; bookingId: string }>();
  const [statusText, setStatusText] = useState('Finding your worker...');
  
  // Animation values
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;
  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  // Simulate user ID if not provided
  const uid = customerId || 'test-customer-123';

  useEffect(() => {
    // 1. Connect to WebSocket
    const socket = socketService.connect(uid);

    // 2. Listen for booking status events from the backend matching engine
    socket.on('booking:status', (data: any) => {
      console.log('Received booking status:', data);
      
      if (data.status === 'ACCEPTED') {
        setStatusText('Worker Found!');
        
        // Wait a brief moment so user sees the success text, then navigate
        setTimeout(() => {
          socketService.disconnect();
          router.replace('/booking/confirm');
        }, 1500);
      }
    });

    // 3. Start pulsing radar animations
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const pulse1 = createPulseAnimation(pulseAnim1, 0);
    const pulse2 = createPulseAnimation(pulseAnim2, 600);
    const pulse3 = createPulseAnimation(pulseAnim3, 1200);

    // Float the center icon
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloatAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconFloatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse1.start();
    pulse2.start();
    pulse3.start();
    float.start();

    // Cleanup on unmount
    return () => {
      socket.off('booking:status');
      // If we exit this screen without matching, we might want to keep the socket alive globally, 
      // but for this demo flow, we disconnect.
      socketService.disconnect();
      pulse1.stop();
      pulse2.stop();
      pulse3.stop();
      float.stop();
    };
  }, [uid]);

  // Helper to render pulsing circles
  const renderPulseCircle = (animValue: Animated.Value) => {
    return (
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            opacity: animValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.8, 0.3, 0],
            }),
            transform: [
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 4],
                }),
              },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#121212', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.radarContainer}>
        {renderPulseCircle(pulseAnim1)}
        {renderPulseCircle(pulseAnim2)}
        {renderPulseCircle(pulseAnim3)}
        
        <Animated.View
          style={[
            styles.centerIconContainer,
            {
              transform: [
                {
                  translateY: iconFloatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons name="radar" size={48} color="#00C853" />
        </Animated.View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{statusText}</Text>
        <Text style={styles.subtitle}>Our smart matching engine is scanning the area for the best available worker.</Text>
      </View>
      
      <View style={styles.tipContainer}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#FFB300" />
        <Text style={styles.tipText}>Usually takes less than 60 seconds.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 200, 83, 0.2)', // Action Green with opacity
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.5)',
  },
  centerIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 200, 83, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00C853',
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 24,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: 'rgba(255, 179, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 0, 0.3)',
    gap: 8,
  },
  tipText: {
    color: '#FFB300',
    fontSize: 14,
    fontWeight: '600',
  },
});
