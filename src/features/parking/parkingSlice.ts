import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ParkingSection = 'US' | 'LS' | 'B3';
export type ParkingStatus = 'available' | 'booked';

export type ParkingSlot = {
  id: string;
  section: ParkingSection;
  status: ParkingStatus;
  bookedBy?: string;
  bookedAt?: string;
  vehicleNumber?: string;
};

type ParkingState = {
  slots: ParkingSlot[];
  activeBookingId?: string;
};

const createInitialSlots = (): ParkingSlot[] => {
  const sections: ParkingSection[] = ['US', 'LS', 'B3'];
  const slots: ParkingSlot[] = [];
  
  // Create 100 total slots: 30 available, 70 booked
  let slotCount = 0;
  
  sections.forEach(section => {
    // Distribute slots across sections: US ~34, LS ~33, B3 ~33
    const slotsPerSection = section === 'US' ? 34 : 33;
    
    for (let i = 1; i <= slotsPerSection; i+=1) {
      slotCount++;
      // First 30 slots are available, rest are booked
      const status: ParkingStatus = slotCount <= 30 ? 'available' : 'booked';
      
      slots.push({
        id: `${section}-${i.toString().padStart(2, '0')}`,
        section,
        status,
      });
    }
  });
  
  return slots;
};

const initialState: ParkingState = {
  slots: createInitialSlots(),
  activeBookingId: undefined,
};

const parkingSlice = createSlice({
  name: 'parking',
  initialState,
  reducers: {
    bookSlot: (
      state,
      action: PayloadAction<{ slotId: string; userId: string; bookedAt: string; vehicleNumber?: string }>,
    ) => {
      const slot = state.slots.find(s => s.id === action.payload.slotId);
      if (!slot || slot.status === 'booked') return;
      slot.status = 'booked';
      slot.bookedBy = action.payload.userId;
      slot.bookedAt = action.payload.bookedAt;
      if (action.payload.vehicleNumber) {
        slot.vehicleNumber = action.payload.vehicleNumber;
      }
      state.activeBookingId = slot.id;
    },
    cancelSlot: (state, action: PayloadAction<{ slotId: string }>) => {
      const slot = state.slots.find(s => s.id === action.payload.slotId);
      if (!slot || slot.status === 'available') return;
      slot.status = 'available';
      delete slot.bookedBy;
      delete slot.bookedAt;
      delete slot.vehicleNumber;
      if (state.activeBookingId === slot.id) {
        state.activeBookingId = undefined;
      }
    },
  },
});

export const { bookSlot, cancelSlot } = parkingSlice.actions;
export default parkingSlice.reducer;


