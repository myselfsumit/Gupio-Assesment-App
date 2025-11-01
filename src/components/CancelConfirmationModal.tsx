import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Pressable } from 'react-native';

type Props = {
  visible: boolean;
  slotId?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const CancelConfirmationModal: React.FC<Props> = ({ visible, slotId, onConfirm, onCancel }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      backdropOpacity.setValue(0);

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
      ]).start();
    }
  }, [visible, backdropOpacity, opacityAnim, scaleAnim]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.backdropContainer} onPress={onCancel}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Warning Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⚠️</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Cancel Booking?</Text>

            {/* Message */}
            <Text style={styles.message}>
              Do you want to cancel your booking?
            </Text>

            {/* Slot Info */}
            {slotId && (
              <View style={styles.slotInfo}>
                <Text style={styles.slotInfoText}>Slot: {slotId}</Text>
              </View>
            )}

            {/* Warning Text */}
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This action will free up your parking slot and make it available for others.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.noButton}
                onPress={onCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={onConfirm}
                activeOpacity={0.85}
              >
                <Text style={styles.yesButtonText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginHorizontal: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: '#fbbf24',
  },
  icon: {
    fontSize: 38,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 14,
    fontWeight: '500',
  },
  slotInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  slotInfoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.3,
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
    width: '100%',
  },
  warningText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  noButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  noButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.2,
  },
  yesButton: {
    flex: 1.5,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  yesButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
});

export default React.memo(CancelConfirmationModal);

