import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,

} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    // Optimized: Faster staggered animation for cards
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

    // Optimized: Faster number counting animation
    Animated.timing(numberAnim, {
      toValue: value,
      duration: 800,
      delay: delay + 100,
      useNativeDriver: false, // Can't use native driver for text
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const listener = numberAnim.addListener(({ value: val }) => {
      setDisplayValue(Math.round(val));
    });
    return () => {
      numberAnim.removeListener(listener);
    };
  }, [numberAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{displayValue}</Text>
      <View style={styles.cardShadow} />
    </Animated.View>
  );
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  // Fixed stats as per requirements: Total Spots: 100, Available: 30
  const total = 100;
  const available = 30;
  const booked = total - available; // 70

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Employee name (can be fetched from auth state later)
  const employeeName = 'Sumit Kaushal';

  useEffect(() => {
    // Header animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Optimized: Faster animations for better performance
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
    <SafeAreaView style={styles.root}>
      {/* Header with Car Icon + GUPIO + Profile */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.ovalContainer}>
            <View style={styles.iconWrapper}>
              <Text style={styles.carIcon}>🚗</Text>
            </View>
            <Text style={styles.appName}>GUPIO</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>👤</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Greeting Section */}
          <Animated.View
            style={[
              styles.greetingSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.name}>{employeeName}</Text>
            <Text style={styles.subtitle}>Plan your parking with ease</Text>
          </Animated.View>

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <StatCard
              label="Total Spots"
              value={100}
              color="#0ea5e9"
              icon="📍"
              delay={50}
            />
            <StatCard
              label="Available Spots"
              value={30}
              color="#22c55e"
              icon="✅"
              delay={100}
            />
            <StatCard
              label="Booked"
              value={70}
              color="#ef4444"
              icon="🔒"
              delay={150}
            />
          </View>

          {/* Quick Stats Info */}
          <Animated.View
            style={[
              styles.infoCard,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Availability</Text>
                <Text style={styles.infoValue}>
                  {Math.round((available / total) * 100)}%
                </Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Occupancy</Text>
                <Text style={styles.infoValue}>
                  {Math.round((booked / total) * 100)}%
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom CTA Button - Fixed at bottom */}
      <Animated.View
        style={[
          styles.bottomContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('Parking')}
          activeOpacity={0.8}
        >
          <View style={styles.ctaContent}>
            <View style={styles.ctaIconWrapper}>
              <Text style={styles.ctaIcon}>🚗</Text>
            </View>
            <Text style={styles.ctaText}>Find Parking Slot</Text>
            <View style={styles.ctaIconWrapper}>
              <Text style={styles.ctaArrow}>🔍</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ovalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrapper: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carIcon: {
    fontSize: 20,
    transform: [{ scaleX: -1 }], // Face right
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1.5,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  profileIconText: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for bottom button
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  greetingSection: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardShadow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardValue: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -1,
  },
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  infoDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: '#f8fafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  cta: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 10,
  },
  ctaIconWrapper: {
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaIcon: {
    fontSize: 20,
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  ctaArrow: {
    fontSize: 18,
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default DashboardScreen;
