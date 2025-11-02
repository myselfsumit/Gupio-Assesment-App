import React, { useMemo, useEffect, useRef, useCallback } from 'react';
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
import { RootState } from '../app/store';
import { RootStackParamList } from '../navigation';
import { cancelSlot, setInactivityWarning } from '../features/parking/parkingSlice';
import Toast from 'react-native-toast-message';
import CancelConfirmationModal from '../components/CancelConfirmationModal';
import InactivityReminderModal from '../components/InactivityReminderModal';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'BookedSlotsDetails'>;

const AnimatedView = Animated.createAnimatedComponent(View);

const BookedSlotsDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { slots, inactivityWarningAt } = useSelector((s: RootState) => s.parking);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);
  const [slotToCancel, setSlotToCancel] = React.useState<string | undefined>(undefined);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get all booked slots by the current user
  const bookedSlotsByUser = useMemo(() => {
    return slots.filter(s => s.status === 'booked' && s.bookedBy === 'employee-1');
  }, [slots]);

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

  // Start inactivity timer when CancelConfirmationModal opens
  useEffect(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (!showCancelConfirm) {
      if (inactivityWarningAt) {
        dispatch(setInactivityWarning(null));
      }
      return;
    }

    if (showCancelConfirm && slotToCancel) {
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

  const handleModalInteraction = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    if (inactivityWarningAt) {
      dispatch(setInactivityWarning(null));
    }

    if (showCancelConfirm && slotToCancel) {
      inactivityTimerRef.current = setTimeout(() => {
        dispatch(setInactivityWarning(Date.now()));
      }, 30000);
    }
  }, [showCancelConfirm, slotToCancel, dispatch, inactivityWarningAt]);

  const handleCancelBooking = useCallback((slotId: string) => {
    setSlotToCancel(slotId);
    setShowCancelConfirm(true);
  }, []);

  const handleInactivityCancel = useCallback(() => {
    dispatch(setInactivityWarning(null));
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
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

  const formatBookingTime = useCallback((dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  const formatBookingDate = useCallback((dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

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
            <Text style={styles.headerTitle}>My Booked Slots</Text>
            <Text style={styles.headerSubtitle}>View your parking reservations</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
          {bookedSlotsByUser.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
              </View>
              <Text style={styles.emptyTitle}>No Booked Slots</Text>
              <Text style={styles.emptySubtitle}>
                You haven't booked any parking slots yet
              </Text>
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Parking')}
              >
                <Text style={styles.exploreButtonText}>Explore Parking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.statsCard}>
                <View style={styles.statsItem}>
                  <Text style={styles.statsNumber}>{bookedSlotsByUser.length}</Text>
                  <Text style={styles.statsLabel}>
                    {bookedSlotsByUser.length === 1 ? 'Slot' : 'Slots'} Booked
                  </Text>
                </View>
                <View style={styles.statsDivider} />
                <View style={styles.statsItem}>
                  <Text style={styles.statsNumber}>
                    {bookedSlotsByUser.filter(s => s.section === 'US').length}
                  </Text>
                  <Text style={styles.statsLabel}>US</Text>
                </View>
                <View style={styles.statsItem}>
                  <Text style={styles.statsNumber}>
                    {bookedSlotsByUser.filter(s => s.section === 'LS').length}
                  </Text>
                  <Text style={styles.statsLabel}>LS</Text>
                </View>
                <View style={styles.statsItem}>
                  <Text style={styles.statsNumber}>
                    {bookedSlotsByUser.filter(s => s.section === 'B3').length}
                  </Text>
                  <Text style={styles.statsLabel}>B3</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Booked Parking Details</Text>

              {bookedSlotsByUser.map((slot) => (
                <View key={slot.id} style={styles.slotCard}>
                  <View style={styles.slotHeader}>
                    <View style={styles.slotIconContainer}>
                      <Text style={styles.slotIcon}>🚗</Text>
                    </View>
                    <View style={styles.slotInfo}>
                      <Text style={styles.slotId}>{slot.id}</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{slot.section} Section</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📍 Location</Text>
                      <Text style={styles.detailValue}>{slot.section} - Slot {slot.id.split('-')[1]}</Text>
                    </View>

                    {slot.vehicleNumber && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>🚙 Vehicle Number</Text>
                        <Text style={[styles.detailValue, styles.vehicleNumberText]}>
                          {slot.vehicleNumber}
                        </Text>
                      </View>
                    )}

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>📅 Booking Date</Text>
                      <Text style={styles.detailValue}>{formatBookingDate(slot.bookedAt)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>🕐 Booking Time</Text>
                      <Text style={styles.detailValue}>{formatBookingTime(slot.bookedAt)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCancelBooking(slot.id)}
                    style={styles.cancelButton}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.cancelIcon}>✕</Text>
                    <Text style={styles.cancelButtonText}>Drop Your Vehicle</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>
        </ScrollView>
      </AnimatedView>

      {/* Modals */}
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
          if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
          }
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  slotCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slotIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  slotIcon: {
    fontSize: 28,
  },
  slotInfo: {
    flex: 1,
  },
  slotId: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginBottom: 16,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    textAlign: 'right',
  },
  vehicleNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0ea5e9',
    letterSpacing: 1,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default React.memo(BookedSlotsDetailsScreen);

