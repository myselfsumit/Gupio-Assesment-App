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
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../app/store';
import { RootStackParamList } from '../navigation';
import ParkingGrid from '../components/ParkingGrid';
import BookingModal from '../components/BookingModal';
import CancelConfirmationModal from '../components/CancelConfirmationModal';
import InactivityReminderModal from '../components/InactivityReminderModal';
import {
  ParkingSlot,
  bookSlot,
  cancelSlot,
  setInactivityWarning,
} from '../features/parking/parkingSlice';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<RootStackParamList, 'ParkingSlots'>;

const ParkingSlotsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { section } = route.params;
  const dispatch = useDispatch();
  const { slots, inactivityWarningAt } = useSelector(
    (s: RootState) => s.parking,
  );
  const [selected, setSelected] = useState<ParkingSlot | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [slotToCancel, setSlotToCancel] = useState<string | undefined>(undefined);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const filtered = useMemo(() => {
    return slots
      .filter(s => s.section === section)
      .sort((a, b) => {
        const numA = parseInt(a.id.split('-')[1], 10);
        const numB = parseInt(b.id.split('-')[1], 10);
        return numA - numB;
      });
  }, [slots, section]);

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

  // Inactivity warning - only when CancelConfirmationModal is visible
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start inactivity timer when CancelConfirmationModal opens
  useEffect(() => {
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    // Reset warning when modal closes
    if (!showCancelConfirm) {
      if (inactivityWarningAt) {
        dispatch(setInactivityWarning(null));
      }
      return;
    }

    // Only track inactivity when CancelConfirmationModal is visible
    if (showCancelConfirm && slotToCancel) {
      // Set timer for inactivity (30 seconds = 30000ms)
      inactivityTimerRef.current = setTimeout(() => {
        dispatch(setInactivityWarning(Date.now()));
      }, 30000);
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [showCancelConfirm, slotToCancel, dispatch, inactivityWarningAt]);

  // Handle user interaction - resets the inactivity timer
  const handleModalInteraction = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    // Clear inactivity warning if it was shown
    if (inactivityWarningAt) {
      dispatch(setInactivityWarning(null));
    }

    // Restart the timer if modal is still visible
    if (showCancelConfirm && slotToCancel) {
      inactivityTimerRef.current = setTimeout(() => {
        dispatch(setInactivityWarning(Date.now()));
      }, 30000);
    }
  }, [showCancelConfirm, slotToCancel, dispatch, inactivityWarningAt]);

  const handleSlotPress = useCallback((slot: ParkingSlot) => {
    if (slot.status === 'available') {
      setSelected(slot);
    }
  }, []);

  const confirmBooking = useCallback((vehicleNumber?: string) => {
    if (!selected || isBooking) return;

    setIsBooking(true);
    setShowSuccessModal(true);
    const selectedId = selected.id;

    setSelected(undefined);

    setTimeout(() => {
      dispatch(
        bookSlot({
          slotId: selectedId,
          userId: 'employee-1',
          bookedAt: new Date().toISOString(),
          vehicleNumber,
        }),
      );

      setTimeout(() => {
        setShowSuccessModal(false);
        setIsBooking(false);
        Toast.show({
          type: 'success',
          text1: 'Booking Confirmed!',
          text2: `Slot ${selectedId} has been booked successfully`,
        });
      }, 2000);
    }, 1500);
  }, [selected, isBooking, dispatch]);

  const handleInactivityCancel = useCallback(() => {
    dispatch(setInactivityWarning(null));
    // Reset timer when showing cancel confirmation
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    // Restart timer for CancelConfirmationModal
    if (slotToCancel) {
      inactivityTimerRef.current = setTimeout(() => {
        dispatch(setInactivityWarning(Date.now()));
      }, 30000);
    }
    setShowCancelConfirm(true);
  }, [dispatch, slotToCancel]);

  const confirmCancelBooking = useCallback(() => {
    if (!slotToCancel) return;

    dispatch(cancelSlot({ slotId: slotToCancel }));
    dispatch(setInactivityWarning(null));
    setShowCancelConfirm(false);
    setSlotToCancel(undefined);

    Toast.show({
      type: 'success',
      text1: 'Booking Cancelled',
      text2: `Slot ${slotToCancel} is now available`,
    });
  }, [slotToCancel, dispatch]);

  // Get all booked slots by the current user
  const bookedSlotsByUser = useMemo(() => {
    return slots.filter(s => s.status === 'booked' && s.bookedBy === 'employee-1');
  }, [slots]);

  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header Background */}
      <AnimatedView
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
      </AnimatedView>

      <AnimatedView
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header with back button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Section {section} Parking</Text>
            <Text style={styles.headerSubtitle}>Select your preferred slot</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Modern Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={styles.legendDotGreen} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotRed} />
                <Text style={styles.legendText}>Booked</Text>
              </View>
            </View>

            {/* Grid */}
            <View style={styles.gridContainer}>
              <ParkingGrid slots={filtered} onPressSlot={handleSlotPress} />
            </View>

            {/* Booked Slots Details Button */}
            {bookedSlotsByUser.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('BookedSlotsDetails')}
                activeOpacity={0.85}
                style={styles.bookedSlotsButton}
              >
                <View style={styles.bookedSlotsButtonContent}>
                  <View style={styles.bookedSlotsIconContainer}>
                    <Text style={styles.bookedSlotsIcon}>📋</Text>
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{bookedSlotsByUser.length}</Text>
                    </View>
                  </View>
                  <View style={styles.bookedSlotsTextContainer}>
                    <Text style={styles.bookedSlotsButtonTitle}>My Booked Slots</Text>
                    <Text style={styles.bookedSlotsButtonSubtitle}>
                      {bookedSlotsByUser.length} {bookedSlotsByUser.length === 1 ? 'slot' : 'slots'} booked
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Icon name="chevron-right" size={24} color="#94a3b8" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </AnimatedView>

      {/* Modals */}
      <BookingModal
        visible={!!selected && !showSuccessModal}
        slot={selected}
        onConfirm={confirmBooking}
        onCancel={() => setSelected(undefined)}
        showSuccess={false}
      />
      <BookingModal
        visible={showSuccessModal}
        slot={selected}
        onConfirm={() => {}}
        onCancel={() => {
          setShowSuccessModal(false);
          setIsBooking(false);
        }}
        showSuccess={true}
      />
      <CancelConfirmationModal
        visible={showCancelConfirm}
        slotId={slotToCancel}
        onConfirm={confirmCancelBooking}
        onCancel={() => {
          setShowCancelConfirm(false);
          setSlotToCancel(undefined);
        }}
        onInteraction={handleModalInteraction}
      />
      <InactivityReminderModal
        visible={!!inactivityWarningAt && !!showCancelConfirm}
        slotId={slotToCancel}
        onCancel={handleInactivityCancel}
        onKeepBooking={() => {
          dispatch(setInactivityWarning(null));
          // Reset timer when user chooses to keep booking
          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
          }
          // Restart timer for CancelConfirmationModal
          if (showCancelConfirm && slotToCancel) {
            inactivityTimerRef.current = setTimeout(() => {
              dispatch(setInactivityWarning(Date.now()));
            }, 30000);
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
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
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  headerTitleContainer: {
    flex: 1,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDotGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  legendDotRed: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  gridContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  bookedSlotsButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  bookedSlotsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookedSlotsIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  bookedSlotsIcon: {
    fontSize: 32,
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  bookedSlotsTextContainer: {
    flex: 1,
  },
  bookedSlotsButtonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  bookedSlotsButtonSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(ParkingSlotsScreen);
