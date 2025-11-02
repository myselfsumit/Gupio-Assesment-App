import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { ParkingSlot } from '../features/parking/parkingSlice';

const { width } = Dimensions.get('window');
const NUM_COLUMNS = 6;
const SCREEN_PADDING = 16; // Padding from screen edges
const CELL_MARGIN = 5; // Margin between cells

// Calculate available width for cells
const totalPadding = SCREEN_PADDING * 2; // Left + Right screen padding
const totalCellMargins = CELL_MARGIN * 2 * (NUM_COLUMNS - 1); // Margins between cells (left+right for each gap)
const availableWidth = width - totalPadding - totalCellMargins;
const CELL_WIDTH = Math.floor(availableWidth / NUM_COLUMNS - 1.95);
const CELL_HEIGHT = CELL_WIDTH * 1.35; // 35% more height for better UX and touch target

type Props = {
  slots: ParkingSlot[];
  onPressSlot: (slot: ParkingSlot) => void;
};

interface SlotCellProps {
  slot: ParkingSlot;
  onPress: () => void;
}

const SlotCell: React.FC<SlotCellProps> = React.memo(({ slot, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isBooked = slot.status === 'booked';
  const isAvailable = slot.status === 'available';
  const slotNumber = slot.id.split('-')[1];

  const handlePressIn = useCallback(() => {
    if (isAvailable) {
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 4,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isAvailable, scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (isAvailable) {
      onPress();
    }
  }, [isAvailable, onPress]);

  const backgroundColor = isBooked ? '#ef4444' : '#22c55e';
  const borderColor = isBooked ? '#dc2626' : '#16a34a';
  const icon = isBooked ? '🔒' : '✓';

  return (
    <Animated.View
      style={[
        styles.cellContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.cell,
          {
            backgroundColor,
            borderColor,
          },
          isBooked && styles.cellBooked,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isBooked}
        activeOpacity={isAvailable ? 0.8 : 1}
      >
        <Text style={styles.cellIcon}>{icon}</Text>
        <Text style={styles.cellText}>{slotNumber}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

SlotCell.displayName = 'SlotCell';

const ParkingGrid: React.FC<Props> = React.memo(({ slots, onPressSlot }) => {
  // Group slots into rows
  const rows = [];
  for (let i = 0; i < slots.length; i += NUM_COLUMNS) {
    rows.push(slots.slice(i, i + NUM_COLUMNS));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((slot) => (
            <SlotCell key={slot.id} slot={slot} onPress={() => onPressSlot(slot)} />
          ))}
        </View>
      ))}
    </View>
  );
});

ParkingGrid.displayName = 'ParkingGrid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: CELL_MARGIN * 2,
  },
  cellContainer: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    marginHorizontal: CELL_MARGIN,
  },
  cell: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  cellBooked: {
    opacity: 0.7,
  },
  cellIcon: {
    fontSize: Math.max(CELL_WIDTH * 0.28, 18),
    marginBottom: 4,
  },
  cellText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: Math.max(CELL_WIDTH * 0.28, 16),
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default ParkingGrid;
