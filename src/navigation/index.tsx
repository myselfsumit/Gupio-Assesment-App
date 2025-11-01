import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ParkingScreen from '../screens/ParkingScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Dashboard: undefined;
  Parking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Parking" component={ParkingScreen} options={{ headerTitle: 'Select Parking', headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

