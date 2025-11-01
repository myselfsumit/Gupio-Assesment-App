import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import ParkingGrid from '../components/ParkingGrid';
import BookingModal from '../components/BookingModal';
import CancelConfirmationModal from '../components/CancelConfirmationModal';
import InactivityReminderModal from '../components/InactivityReminderModal';
import { ParkingSection, ParkingSlot, bookSlot, cancelSlot, setInactivityWarning } from '../features/parking/parkingSlice';
import Toast from 'react-native-toast-message';

const sections: ParkingSection[] = ['US', 'LS', 'B3'];

const ParkingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { slots, activeBookingId, inactivityWarningAt } = useSelector((s: RootState) => s.parking);
  const [activeSection, setActiveSection] = useState<ParkingSection>('US');
  const [selected, setSelected] = useState<ParkingSlot | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Optimized filtering with useMemo
  const filtered = useMemo(() => {
    return slots.filter(s => s.section === activeSection).sort((a, b) => {
      const numA = parseInt(a.id.split('-')[1], 10);
      const numB = parseInt(b.id.split('-')[1], 10);
      return numA - numB;
    });
  }, [slots, activeSection]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Inactivity warning (demo: 10s)
  useEffect(() => {
    if (!activeBookingId) return;
    const timeout = setTimeout(() => {
      dispatch(setInactivityWarning(Date.now()));
    }, 10000);
    return () => clearTimeout(timeout);
  }, [activeBookingId, dispatch]);

  const handleSectionChange = useCallback((sec: ParkingSection) => {
    setActiveSection(sec);
    setSelected(undefined);
  }, []);

  const handleSlotPress = useCallback((slot: ParkingSlot) => {
    if (slot.status === 'available') {
      setSelected(slot);
    }
  }, []);

  const confirmBooking = useCallback(() => {
    if (!selected || isBooking) return;
    
    setIsBooking(true);
    
    // Show success modal
    setShowSuccessModal(true);
    setSelected(undefined);

    // Simulate booking confirmation delay
    setTimeout(() => {
      dispatch(
        bookSlot({
          slotId: selected.id,
          userId: 'employee-1',
          bookedAt: new Date().toISOString(),
        })
      );
      
      // Hide success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setIsBooking(false);
        Toast.show({
          type: 'success',
          text1: 'Booking Confirmed!',
          text2: `Slot ${selected.id} has been booked successfully`,
        });
      }, 2000);
    }, 1500);
  }, [selected, isBooking, dispatch]);

  const handleCancelBooking = useCallback(() => {
    if (!activeBookingId) return;
    // Show confirmation modal
    setShowCancelConfirm(true);
  }, [activeBookingId]);

  const handleInactivityCancel = useCallback(() => {
    // Close inactivity modal first, then show confirmation
    dispatch(setInactivityWarning(null));
    setShowCancelConfirm(true);
  }, [dispatch]);

  const confirmCancelBooking = useCallback(() => {
    if (!activeBookingId) return;
    
    // Free the slot and update available spots
    dispatch(cancelSlot({ slotId: activeBookingId }));
    dispatch(setInactivityWarning(null));
    setShowCancelConfirm(false);
    
    Toast.show({
      type: 'success',
      text1: 'Booking Cancelled',
      text2: `Slot ${activeBookingId} is now available`,
    });
  }, [activeBookingId, dispatch]);

  const bookedSlot = useMemo(
    () => slots.find(s => s.id === activeBookingId),
    [slots, activeBookingId]
  );

  // Stats for current section
  const sectionStats = useMemo(() => {
    const sectionSlots = filtered;
    const available = sectionSlots.filter(s => s.status === 'available').length;
    const booked = sectionSlots.length - available;
    return { total: sectionSlots.length, available, booked };
  }, [filtered]);

  // Format booking time
  const formatBookingTime = useCallback((dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {/* Section Tabs - Enhanced */}
          <View style={styles.tabsContainer}>
            {sections.map(sec => {
              const isActive = sec === activeSection;
              return (
                <TouchableOpacity
                  key={sec}
                  onPress={() => handleSectionChange(sec)}
                  style={[styles.tab, isActive && styles.tabActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isActive && styles.tabActiveText]}>
                    {sec}
                  </Text>
                  {isActive && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Enhanced Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Section {activeSection} Overview</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#0ea5e9' }]}>
                  <Text style={styles.statIconText}>📍</Text>
                </View>
                <Text style={styles.statValue}>{sectionStats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#22c55e' }]}>
                  <Text style={styles.statIconText}>✓</Text>
                </View>
                <Text style={[styles.statValue, styles.statValueSuccess]}>
                  {sectionStats.available}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#ef4444' }]}>
                  <Text style={styles.statIconText}>🔒</Text>
                </View>
                <Text style={[styles.statValue, styles.statValueDanger]}>
                  {sectionStats.booked}
                </Text>
                <Text style={styles.statLabel}>Booked</Text>
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>

          {/* Parking Grid */}
          <View style={styles.gridContainer}>
            <ParkingGrid slots={filtered} onPressSlot={handleSlotPress} />
          </View>

          {/* Active Booking Card - Bottom of Content */}
          {bookedSlot && (
            <View style={styles.activeCard}>
              <View style={styles.activeCardHeader}>
                <View style={styles.activeCardIcon}>
                  <Text style={styles.activeCardIconText}>✓</Text>
                </View>
                <View style={styles.activeCardInfo}>
                  <Text style={styles.activeTitle}>Active Booking</Text>
                  <Text style={styles.activeSubtitle}>Slot: {bookedSlot.id}</Text>
                  {bookedSlot.bookedAt && (
                    <Text style={styles.activeTime}>
                      Booked at: {formatBookingTime(bookedSlot.bookedAt)}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={handleCancelBooking}
                style={styles.cancelBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnIcon}>✕</Text>
                <Text style={styles.cancelBtnText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={!!selected && !showSuccessModal}
        slot={selected}
        onConfirm={confirmBooking}
        onCancel={() => setSelected(undefined)}
        showSuccess={false}
      />

      {/* Success Modal */}
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

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        visible={showCancelConfirm}
        slotId={activeBookingId}
        onConfirm={confirmCancelBooking}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* Inactivity Reminder Modal */}
      <InactivityReminderModal
        visible={!!inactivityWarningAt}
        slotId={activeBookingId}
        onCancel={handleInactivityCancel}
        onKeepBooking={() => dispatch(setInactivityWarning(null))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  tabActiveText: {
    color: '#fff',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statsHeader: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statValueSuccess: {
    color: '#22c55e',
  },
  statValueDanger: {
    color: '#ef4444',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  gridContainer: {
    marginBottom: 20,
  },
  activeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#22c55e',
  },
  activeCardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activeCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  activeCardIconText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '900',
  },
  activeCardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  activeSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  activeTime: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cancelBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cancelBtnIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '800',
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});

export default React.memo(ParkingScreen);
