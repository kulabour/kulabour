import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { role, lang } = useLocalSearchParams<{ role?: 'customer' | 'worker'; lang?: string }>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      animateTransition(() => setStep('otp'));
    }, 1200);
  };

  const handleVerifyOTP = () => {
    if (otp.length < 4) {
      alert('Please enter the 4-digit OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'worker') {
        router.replace('/worker/dashboard');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 1200);
  };

  const handleResendOTP = () => {
    if (timer === 0) {
      setTimer(59);
      alert('OTP resent successfully!');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <LinearGradient
          colors={['#E65100', '#FF8F00']}
          style={styles.headerGradient}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerInfo}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="hard-hat" size={32} color="#E65100" />
            </View>
            <Text style={styles.welcomeText}>
              {role === 'worker' ? 'Worker Login' : 'Customer Login'}
            </Text>
            <Text style={styles.subtext}>
              {role === 'worker' 
                ? 'Register or login to find daily wage work near you' 
                : 'Login to hire verified local workers in seconds'}
            </Text>
          </View>
        </LinearGradient>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {step === 'phone' ? (
            <View>
              <Text style={styles.inputLabel}>Mobile Number / मोबाइल नंबर</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholderTextColor="#999"
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleSendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Send OTP / ओटीपी भेजें</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                  </>
                )}
              </Pressable>
            </View>
          ) : (
            <View>
              <Text style={styles.inputLabel}>Enter 4-Digit OTP / ओटीपी डालें</Text>
              <Text style={styles.otpSentText}>Sent to +91 {phoneNumber}</Text>
              
              <View style={styles.otpContainer}>
                <TextInput
                  style={styles.otpInput}
                  placeholder="xxxx"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  placeholderTextColor="#999"
                  secureTextEntry={false}
                />
              </View>

              <View style={styles.timerRow}>
                <Text style={styles.timerText}>
                  {timer > 0 ? `Resend in ${timer}s` : 'Didn\'t receive OTP?'}
                </Text>
                {timer === 0 && (
                  <Pressable onPress={handleResendOTP}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Verify & Proceed</Text>
                    <MaterialCommunityIcons name="check-decagram" size={20} color="#FFFFFF" />
                  </>
                )}
              </Pressable>

              <Pressable
                style={styles.changePhoneButton}
                onPress={() => animateTransition(() => setStep('phone'))}
              >
                <Text style={styles.changePhoneText}>Change Mobile Number</Text>
              </Pressable>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#E65100',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  otpSentText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    width: 140,
    height: 56,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    letterSpacing: 8,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
  changePhoneButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  changePhoneText: {
    fontSize: 14,
    color: '#64748B',
    textDecorationLine: 'underline',
  },
});
