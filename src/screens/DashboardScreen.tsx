import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  icon,
  delay,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.timing(numberAnim, {
      toValue: value,
      duration: 800,
      delay: delay + 100,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const listener = numberAnim.addListener(({ value: val }) => {
      setDisplayValue(Math.round(val));
    });
    return () => numberAnim.removeListener(listener);
  }, [numberAnim]);

  return (
    <AnimatedView
      style={[
        styles.statCard,
        { backgroundColor: color, opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.statCardIconContainer}>
        <Text style={styles.statCardIcon}>{icon}</Text>
      </View>

      <Text style={styles.statCardLabel}>{label}</Text>

      <Text style={styles.statCardValue}>{displayValue}</Text>

      <View style={styles.statCardCircle} />
    </AnimatedView>
  );
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  const total = 100;
  const available = 30;
  const booked = total - available;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const employeeName = 'Sumit Kaushal';
  
  // Responsive button bottom position
  const buttonBottomOffset = useMemo(() => {
    if (SCREEN_HEIGHT < 700) return 16; // Small screens
    if (SCREEN_HEIGHT < 800) return 24; // Medium screens
    return 32; // Large screens
  }, []);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconWrapper}>
            <Text style={styles.logoIcon}>🚗</Text>
          </View>
          <Text style={styles.logoText}>GUPIO</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileIconContainer}>
            <Text style={styles.profileIcon}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedView style={styles.contentContainer}>
          <AnimatedView style={[styles.greetingContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.greetingText}>{greeting}!</Text>
            <Text style={styles.employeeName}>{employeeName}</Text>
            <Text style={styles.subtitleText}>Plan your parking with ease</Text>
          </AnimatedView>

          <View style={styles.statCardsRow}>
            <StatCard
              label="Total Spots"
              value={total}
              color="#0ea5e9"
              icon="📍"
              delay={50}
            />
            <StatCard
              label="Available Spots"
              value={available}
              color="#22c55e"
              icon="✅"
              delay={100}
            />
            <StatCard
              label="Booked"
              value={booked}
              color="#ef4444"
              icon="🔒"
              delay={150}
            />
          </View>

          <AnimatedView style={[styles.metricsCard, { opacity: fadeAnim }]}>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Availability</Text>
                <Text style={styles.metricValue}>
                  {Math.round((available / total) * 100)}%
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Occupancy</Text>
                <Text style={styles.metricValue}>
                  {Math.round((booked / total) * 100)}%
                </Text>
              </View>
            </View>
          </AnimatedView>
        </AnimatedView>
      </ScrollView>

      <AnimatedView 
        style={[
          styles.bottomButtonContainer, 
          { 
            opacity: fadeAnim,
            bottom: buttonBottomOffset + insets.bottom,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.findParkingButton}
          onPress={() => navigation.navigate('Parking')}
          activeOpacity={0.8}
        >
          <View style={styles.findParkingButtonContent}>
            <View style={styles.buttonIconWrapper}>
              <Text style={styles.buttonCarIcon}>🚗</Text>
            </View>
            <Text style={styles.findParkingButtonText}>Find Parking Slot</Text>
            <View style={styles.buttonIconWrapper}>
              <Text style={styles.buttonSearchIcon}>🔍</Text>
            </View>
          </View>
        </TouchableOpacity>
      </AnimatedView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  logoIconWrapper: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 20,
    transform: [{ scaleX: -1 }],
    lineHeight: 20,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1.5,
    lineHeight: 22,
  },
  profileButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  profileIcon: {
    fontSize: 22,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  greetingContainer: {
    marginBottom: 32,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  employeeName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginTop: 4,
  },
  statCardsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statCardIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statCardIcon: {
    fontSize: 28,
  },
  statCardLabel: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statCardValue: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -1,
  },
  statCardCircle: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  metricsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  findParkingButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: SCREEN_HEIGHT < 700 ? 16 : 18,
    paddingHorizontal: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minHeight: SCREEN_HEIGHT < 700 ? 52 : 56,
  },
  findParkingButtonContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 10,
  },
  buttonIconWrapper: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCarIcon: {
    fontSize: 20,
    transform: [{ scaleX: -1 }],
  },
  findParkingButtonText: {
    color: '#fff',
    fontSize: SCREEN_HEIGHT < 700 ? 16 : 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  buttonSearchIcon: {
    fontSize: 18,
  },
});