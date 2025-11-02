import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../app/store';
import { RootStackParamList } from '../navigation';
import {
  ParkingSection,
} from '../features/parking/parkingSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const sections: ParkingSection[] = ['US', 'LS', 'B3'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ParkingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { slots } = useSelector(
    (s: RootState) => s.parking,
  );
  const [activeSection, setActiveSection] = useState<ParkingSection>('US');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sectionIndicatorAnim = useRef(new Animated.Value(0)).current;

  const filtered = useMemo(() => {
    return slots
      .filter(s => s.section === activeSection)
      .sort((a, b) => {
        const numA = parseInt(a.id.split('-')[1], 10);
        const numB = parseInt(b.id.split('-')[1], 10);
        return numA - numB;
      });
  }, [slots, activeSection]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Animate section indicator - Optimized calculation
  useEffect(() => {
    const index = sections.indexOf(activeSection);
    const containerPadding = 40;
    const tabContainerPadding = 16;
    const availableWidth = width - containerPadding - tabContainerPadding;
    const tabWidth = availableWidth / sections.length;
    const targetPosition = tabWidth * index;

    Animated.spring(sectionIndicatorAnim, {
      toValue: targetPosition,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [activeSection, sectionIndicatorAnim]);

  const handleSectionChange = useCallback((sec: ParkingSection) => {
    setActiveSection(sec);
  }, []);

  const handleViewSlots = useCallback(() => {
    navigation.navigate('ParkingSlots', { section: activeSection });
  }, [navigation, activeSection]);

  const sectionStats = useMemo(() => {
    const sectionSlots = filtered;
    const available = sectionSlots.filter(s => s.status === 'available').length;
    const booked = sectionSlots.length - available;
    return { total: sectionSlots.length, available, booked };
  }, [filtered]);

  const tabWidth = (width - 56) / sections.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Gradient Header Background */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
      </Animated.View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header Title */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Smart Parking</Text>
          <Text style={styles.headerSubtitle}>Select your preferred section</Text>
        </View>

        {/* Enhanced Section Tabs */}
        <View style={styles.tabsContainer}>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                width: tabWidth,
                transform: [{ translateX: sectionIndicatorAnim }],
              },
            ]}
          />
          {sections.map(sec => {
            const isActive = sec === activeSection;
            return (
              <TouchableOpacity
                key={sec}
                onPress={() => handleSectionChange(sec)}
                activeOpacity={0.8}
                style={styles.tabButton}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive ? styles.tabTextActive : styles.tabTextInactive,
                  ]}
                >
                  {sec}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Enhanced Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Available Stats Card */}
          <View style={[styles.statCard, styles.statCardGreen]}>
            <View style={[styles.statCardDecoration, styles.statCardDecorationGreen]} />
            <View style={styles.statCardContent}>
              <View style={styles.statCardLeft}>
                <View style={[styles.statIconContainer, styles.statIconContainerGreen]}>
                  <Text style={styles.statIcon}>✓</Text>
                </View>
                <View style={styles.statValueContainer}>
                  <Text style={[styles.statValue, styles.statValueGreen]}>
                    {sectionStats.available}
                  </Text>
                  <Text style={styles.statLabel}>Available</Text>
                </View>
              </View>
              <Text style={styles.statFooterText}>Ready to book</Text>
            </View>
          </View>

          {/* Booked Stats Card */}
          <View style={[styles.statCard, styles.statCardRed]}>
            <View style={[styles.statCardDecoration, styles.statCardDecorationRed]} />
            <View style={styles.statCardContent}>
              <View style={styles.statCardLeft}>
                <View style={[styles.statIconContainer, styles.statIconContainerRed]}>
                  <Text style={styles.statIcon}>🔒</Text>
                </View>
                <View style={styles.statValueContainer}>
                  <Text style={[styles.statValue, styles.statValueRed]}>
                    {sectionStats.booked}
                  </Text>
                  <Text style={styles.statLabel}>Booked</Text>
                </View>
              </View>
              <Text style={styles.statFooterText}>Occupied</Text>
            </View>
          </View>

          {/* Total Stats Card */}
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={[styles.statCardDecoration, styles.statCardDecorationBlue]} />
            <View style={styles.statCardContent}>
              <View style={styles.statCardLeft}>
                <View style={[styles.statIconContainer, styles.statIconContainerBlue]}>
                  <Text style={styles.statIcon}>📍</Text>
                </View>
                <View style={styles.statValueContainer}>
                  <Text style={[styles.statValue, styles.statValueBlue]}>
                    {sectionStats.total}
                  </Text>
                  <Text style={styles.statLabel}>Total Slots</Text>
                </View>
              </View>
              <Text style={styles.statFooterText}>Section {activeSection}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* View Parking Slots Button - Bottom Fixed */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleViewSlots}
          activeOpacity={0.85}
          style={styles.viewSlotsButton}
        >
          <Text style={styles.viewSlotsIcon}>🚗</Text>
          <Text style={styles.viewSlotsText}>View Parking Slots</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 270,
    backgroundColor: '#0ea5e9',
  },
  decorationCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 300,
  },
  headerTitleContainer: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    height: 48,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  tabTextActive: {
    fontWeight: '800',
    color: '#fff',
  },
  tabTextInactive: {
    fontWeight: '600',
    color: '#64748b',
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
    marginTop: 38,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderTopWidth: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  statCardBlue: {
    shadowColor: '#0ea5e9',
    borderTopColor: '#0ea5e9',
  },
  statCardGreen: {
    shadowColor: '#22c55e',
    borderTopColor: '#22c55e',
  },
  statCardRed: {
    shadowColor: '#ef4444',
    borderTopColor: '#ef4444',
  },
  statCardDecoration: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statCardDecorationBlue: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  statCardDecorationGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statCardDecorationRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconContainerBlue: {
    backgroundColor: '#dbeafe',
  },
  statIconContainerGreen: {
    backgroundColor: '#dcfce7',
  },
  statIconContainerRed: {
    backgroundColor: '#fee2e2',
  },
  statIcon: {
    fontSize: 24,
  },
  statValueContainer: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  statValueBlue: {
    color: '#0ea5e9',
  },
  statValueGreen: {
    color: '#22c55e',
  },
  statValueRed: {
    color: '#ef4444',
  },
  statFooterText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'right',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
    marginBottom : 20,
  },
  viewSlotsButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  viewSlotsIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  viewSlotsText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default React.memo(ParkingScreen);
