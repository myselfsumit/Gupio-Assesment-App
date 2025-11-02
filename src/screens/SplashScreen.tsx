import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION = 1500;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Animation refs - using useRef to prevent recreation
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const carScale = useRef(new Animated.Value(0)).current;
  const carTranslateY = useRef(new Animated.Value(-120)).current;
  const carOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  // Loading dots animation
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Memoized navigation callback to prevent recreation
  const navigateToLogin = useCallback(() => {
    navigation.replace('Login');
  }, [navigation]);

  useEffect(() => {
    // Optimized: All animations start together for faster loading
    Animated.parallel([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Car animation - faster spring
      Animated.spring(carScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(carTranslateY, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(carOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Logo animation - faster
      Animated.spring(logoOpacity, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
        delay: 100,
      }),
      // Tagline and loader
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: 200,
      }),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();

    // Optimized: Faster loading dots animation
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const dot1Anim = createDotAnimation(dot1, 0);
    const dot2Anim = createDotAnimation(dot2, 150);
    const dot3Anim = createDotAnimation(dot3, 300);

    dot1Anim.start();
    dot2Anim.start();
    dot3Anim.start();

    // Navigate after total duration
    const timer = setTimeout(() => {
      navigateToLogin();
    }, SPLASH_DURATION);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      dot1Anim.stop();
      dot2Anim.stop();
      dot3Anim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized interpolated values
  const dot1Scale = useMemo(
    () =>
      dot1.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.2],
      }),
    [dot1],
  );

  const dot2Scale = useMemo(
    () =>
      dot2.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.2],
      }),
    [dot2],
  );

  const dot3Scale = useMemo(
    () =>
      dot3.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1.2],
      }),
    [dot3],
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Animated.View style={[styles.container, { opacity: backgroundOpacity }]}>
        {/* Gradient Background Layers */}
        <View style={styles.backgroundLayer1} />
        <View style={styles.backgroundLayer2} />
        <View style={styles.gradientCircle1} />
        <View style={styles.gradientCircle2} />

        {/* Car Icon with Optimized Animation */}
        <Animated.View
          style={[
            styles.carContainer,
            {
              opacity: carOpacity,
              transform: [
                { translateY: carTranslateY },
                { scale: carScale },
                { scaleX: -1 }, // Face right
              ],
            },
          ]}
        >
          <Text style={styles.carIcon}>🚗</Text>
        </Animated.View>

        {/* GUPIO Logo with Smooth Animation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Text style={styles.logoText}>GUPIO</Text>
          <View style={styles.logoUnderline} />
        </Animated.View>

        {/* Tagline with Fade Animation */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
            },
          ]}
        >
          <Text style={styles.tagline}>Smart Parking Services</Text>
          <Text style={styles.taglineSub}>Your Parking Solution</Text>
        </Animated.View>

        {/* Animated Loading Dots */}
        <Animated.View
          style={[
            styles.loaderContainer,
            {
              opacity: loaderOpacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.loaderDot,
              {
                transform: [{ scale: dot1Scale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loaderDot,
              {
                transform: [{ scale: dot2Scale }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loaderDot,
              {
                transform: [{ scale: dot3Scale }],
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1e40af',
    opacity: 0.15,
  },
  backgroundLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
  },
  gradientCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#1e40af',
    opacity: 0.15,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  gradientCircle2: {
    position: 'absolute',
    width: width * 1.0,
    height: width * 1.0,
    borderRadius: width * 0.5,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  carContainer: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carIcon: {
    fontSize: 110,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  logoUnderline: {
    width: 140,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginTop: 12,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  tagline: {
    fontSize: 19,
    color: 'rgba(255,255,255,0.98)',
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  taglineSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  loaderContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default React.memo(SplashScreen);