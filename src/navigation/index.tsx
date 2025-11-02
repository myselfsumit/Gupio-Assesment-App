import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ParkingScreen from '../screens/ParkingScreen';
import ParkingSlotsScreen from '../screens/ParkingSlotsScreen';
import BookedSlotsDetailsScreen from '../screens/BookedSlotsDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ParkingSection } from '../features/parking/parkingSlice';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Parking: undefined;
  ParkingSlots: { section: ParkingSection };
  BookedSlotsDetails: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Parking" component={ParkingScreen} options={{ headerTitle: 'Select Parking', headerShown: true }} />
        <Stack.Screen name="ParkingSlots" component={ParkingSlotsScreen} options={{ headerTitle: 'Parking Slots', headerShown: false }} />
        <Stack.Screen name="BookedSlotsDetails" component={BookedSlotsDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

