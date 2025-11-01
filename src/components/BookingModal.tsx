import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';
import { ParkingSlot } from '../features/parking/parkingSlice';

type Props = {
  visible: boolean;
  slot?: ParkingSlot;
  onConfirm: () => void;
  onCancel: () => void;
  showSuccess?: boolean;
};

const BookingModal: React.FC<Props> = ({ visible, slot, onConfirm, onCancel, showSuccess = false }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      if (showSuccess) {
        // Success animation
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        backdropOpacity.setValue(1);

        Animated.parallel([
          Animated.spring(successScale, {
            toValue: 1,
            friction: 5,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(successOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Reset animations
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        backdropOpacity.setValue(0);
        successScale.setValue(0);
        successOpacity.setValue(0);

        // Animate backdrop first
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Then animate modal
          Animated.parallel([
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 6,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, showSuccess, backdropOpacity, opacityAnim, scaleAnim, successScale, successOpacity]);

  if (!slot && !showSuccess) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdropContainer} onPress={showSuccess ? undefined : onCancel}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
        <Pressable onPress={(e) => e.stopPropagation()}>
          {showSuccess ? (
            <Animated.View
              style={[
                styles.successContainer,
                {
                  opacity: successOpacity,
                  transform: [{ scale: successScale }],
                },
              ]}
            >
              <View style={styles.successIconContainer}>
                <Text style={styles.successIcon}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Waiting…</Text>
              <Text style={styles.successMessage}>Thank you for your patience.</Text>
              <Text style={styles.successSubtext}>Your booking is being confirmed</Text>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Header with Icon */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>🚗</Text>
                </View>
                <Text style={styles.title}>Confirm Booking</Text>
                <Text style={styles.subtitle}>Please confirm your parking slot booking</Text>
              </View>

              {/* Slot Information Card */}
              <View style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotLabel}>Parking Slot</Text>
                  <View style={[styles.slotBadge, { backgroundColor: '#22c55e' }]}>
                    <Text style={styles.slotBadgeText}>Available</Text>
                  </View>
                </View>
                <Text style={styles.slotId}>{slot?.id}</Text>
                <View style={styles.slotDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Section</Text>
                    <Text style={styles.detailValue}>{slot?.section}</Text>
                  </View>
                  <View style={styles.detailDivider} />
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Slot Number</Text>
                    <Text style={styles.detailValue}>{slot?.id.split('-')[1]}</Text>
                  </View>
                </View>
              </View>

              {/* Info Message */}
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Your booking will be confirmed once you tap the confirm button below.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={onConfirm}
                  activeOpacity={0.85}
                >
                  <View style={styles.confirmButtonContent}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '95%',
    maxWidth: 420,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '95%',
    maxWidth: 420,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successIcon: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0ea5e9',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 36,
    textAlign: 'center',
    lineHeight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  slotCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  slotBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slotBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  slotId: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111',
    marginBottom: 16,
    letterSpacing: 2,
  },
  slotDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  detailDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.3,
  },
  confirmButton: {
    flex: 1.8,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'visible',
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default React.memo(BookingModal);
